import { getArticles } from "../models/articleModel.js";
import { success, error } from "../utils/response.js";
import { supabase } from "../models/supabaseClient.js";

export const getArticlesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Викликаємо функцію з page і limit
    const { data, count } = await getArticles(page, limit);

    return success(res, {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return error(res, "Не вдалося отримати статті", 500);
  }
};

export const getArticleBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error: err } = await supabase
      .from("articles")
      .select(`
        *,
        users(name, email),
        categories(name, slug),
        article_tags(*)
      `)
      .eq("slug", slug)
      .single(); // повертає лише один запис

    if (err) throw err;
    if (!data) return error(res, "NOT_FOUND", "Article not found", 404);

    return success(res, data);
  } catch (err) {
    return error(res, "GET_ARTICLE_FAILED", err.message, 500);
  }
};

export const getRelatedArticlesController = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Отримуємо статтю по slug
    const { data: article, error: errArticle } = await supabase
      .from("articles")
      .select("id, category_id")
      .eq("slug", slug)
      .single();

    if (errArticle || !article) {
      return error(res, "NOT_FOUND", "Article not found", 404);
    }

    // 2. Беремо пов'язані статті з тієї ж категорії, крім самої статті
    const { data: related, error: errRelated } = await supabase
      .from("articles")
      .select("*")
      .eq("category_id", article.category_id)
      .neq("id", article.id)
      .order("created_at", { ascending: false })
      .limit(5); // максимум 5 пов’язаних

    if (errRelated) {
      return error(res, "GET_RELATED_FAILED", errRelated.message, 500);
    }

    return success(res, related);
  } catch (err) {
    return error(res, "GET_RELATED_FAILED", err.message, 500);
  }
};

export const incrementArticleViewController = async (req, res) => {
  try {
    const { id } = req.params;

    // Спочатку отримуємо поточну статтю
    const { data: article, error: fetchErr } = await supabase
      .from("articles")
      .select("views")
      .eq("id", id)
      .single();

    if (fetchErr) throw fetchErr;
    if (!article) return error(res, "NOT_FOUND", "Article not found", 404);

    // Оновлюємо лічильник
    const { data, error: updateErr } = await supabase
      .from("articles")
      .update({ views: article.views + 1 })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return success(res, data);

  } catch (err) {
    return error(res, "INCREMENT_VIEW_FAILED", err.message, 500);
  }
};

//Пошук статтей
export const searchArticlesController = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return error(res, "NO_QUERY", "Query parameter 'q' is required", 400);
    }

    // розбиваємо запит на слова
    const words = query.trim().split(/\s+/);

    // створюємо умову OR для кожного слова
    const orQuery = words
      .map(word => `title.ilike.%${word}%`)
      .join(",");

    const { data, error: searchErr } = await supabase
      .from("articles")
      .select("*")
      .or(orQuery)
      .order("created_at", { ascending: false });

    if (searchErr) throw searchErr;

    return success(res, data);

  } catch (err) {
    return error(res, "SEARCH_FAILED", err.message, 500);
  }
};