import {    getAllArticlesAdmin, 
            createArticle,
            updateArticle,
            deleteArticle
} from "../models/articleModel.js";
import { success, successPaginated, error } from "../utils/response.js";
import slugify from "slugify";
import { supabase } from "../models/supabaseClient.js";
import multer from "multer";
import path from "path";
import crypto from "crypto";

export const getArticleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: article, error: err } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single(); // повертає один об'єкт

    if (err || !article) {
      return error(res, "NOT_FOUND", "Article not found", 404);
    }

    return success(res, article);
  } catch (err) {
    return error(res, "SERVER_ERROR", err.message, 500);
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await getAllArticlesAdmin();

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const total = articles.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / perPage);

    return successPaginated(res, articles, {
      total: total, //загальна кількість елементів у базі або у вибірці.
      page: page, //поточна сторінка, яку ти повертаєш.
      perPage: perPage,  //скільки елементів повертається на одній сторінці.
      totalPages: totalPages  //
    });

  } catch (err) {
    return error(res, "SERVER_ERROR", err.message, 500);
  }
};

export const createArticleController = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      cover_url,
      category_id,
      status,
      meta_title,
      meta_description,
      published_at,
    } = req.body;

    const author_id = req.user.id; // ✅ беремо з токена

    // Перевірка автора (необов’язково, бо автор точно існує)
    const { data: author } = await supabase
      .from("users")
      .select("id")
      .eq("id", author_id)
      .single();
    if (!author) return error(res, "INVALID_AUTHOR", "Author not found", 400);

    // Перевірка category_id
    if (category_id) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("id", category_id)
        .single();
      if (!category) return error(res, "INVALID_CATEGORY", "Category not found", 400);
    }

    // Генерація унікального slug
    let baseSlug = slugify(title, { lower: true });
    let slug = baseSlug;
    let count = 1;
    while (true) {
      const { data: existing } = await supabase
        .from("articles")
        .select("id")
        .eq("slug", slug)
        .single();
      if (!existing) break;
      slug = `${baseSlug}-${count++}`;
    }

    // Створення статті
    const article = await createArticle({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      cover_url: cover_url || null,
      author_id, // ✅ автоматично
      category_id: category_id || null,
      status: status || "draft",
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      published_at: published_at || null,
    });

    return success(res, article);
  } catch (err) {
    return error(res, "CREATE_FAILED", err.message, 500);
  }
};

export const updateArticleController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Отримуємо статтю
    const { data: article } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (!article) return error(res, "NOT_FOUND", "Article not found", 404);

    // Перевірка авторства
    if (!isAdmin && article.author_id !== userId)
      return error(res, "FORBIDDEN", "You cannot update this article", 403);

    let updatedData = { ...req.body, updated_at: new Date().toISOString() };

    // Якщо змінився title → генеруємо новий slug
    if (req.body.title && req.body.title !== article.title) {
      let baseSlug = slugify(req.body.title, { lower: true });
      let slug = baseSlug;
      let count = 1;

      while (true) {
        const { data: existing } = await supabase
          .from("articles")
          .select("id")
          .eq("slug", slug)
          .neq("id", id) // виключаємо поточну статтю
          .single();

        if (!existing) break;
        slug = `${baseSlug}-${count++}`;
      }

      updatedData.slug = slug;
    }

    // Оновлюємо
    const { data: updatedArticle, error: updateError } = await supabase
      .from("articles")
      .update(updatedData)
      .eq("id", id)
      .single();

    if (updateError) return error(res, "UPDATE_FAILED", updateError.message, 500);

    return success(res, updatedArticle);

  } catch (err) {
    return error(res, "UPDATE_FAILED", err.message, 500);
  }
};

export const deleteArticleController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;       // з JWT
    const isAdmin = req.user.is_admin;

    // 1️⃣ Шукаємо статтю
    const { data: article, error: fetchError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !article)
      return error(res, "NOT_FOUND", "Article not found", 404);

    // 2️⃣ Перевірка авторства
    if (!isAdmin && article.author_id !== userId) {
      return error(res, "FORBIDDEN", "You cannot delete this article", 403);
    }

    // 3️⃣ Видалення статті
    const { error: deleteError } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (deleteError) return error(res, "DELETE_FAILED", deleteError.message, 500);

    return success(res, { message: "Article deleted" });

  } catch (err) {
    return error(res, "DELETE_FAILED", err.message, 500);
  }
};


// ---- Upload controller ----
export const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, "NO_FILE", "No file provided", 400);
    }

    // Генеруємо унікальну назву файлу
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${crypto.randomUUID()}${fileExt}`;

    // Завантажуємо файл у Supabase
    const { data, error: uploadError } = await supabase.storage
      .from("images")        // Назва bucket
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return error(res, "UPLOAD_FAILED", uploadError.message, 500);
    }

    // Повертаємо публічний URL файлу
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return success(res, { url: publicUrlData.publicUrl });
  } catch (err) {
    return error(res, "UPLOAD_FAILED", err.message, 500);
  }
};