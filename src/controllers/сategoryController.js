import { supabase } from "../models/supabaseClient.js";
import { success, error } from "../utils/response.js";

// Контролер для отримання всіх категорій
export const getCategoriesController = async (req, res) => {
  try {
    const { data, error: fetchErr } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (fetchErr) throw fetchErr;

    return success(res, data);
  } catch (err) {
    return error(res, "GET_CATEGORIES_FAILED", err.message, 500);
  }
};

// Статті певної категорії за slug
export const getCategoryArticlesController = async (req, res) => {
  try {
    const { slug } = req.params;

    // Шукаємо категорію
    const { data: category, error: catErr } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("slug", slug)
      .single();

    if (catErr || !category)
      return error(res, "CATEGORY_NOT_FOUND", "Category not found", 404);

    // Шукаємо статті цієї категорії
    const { data: articles, error: artErr } = await supabase
      .from("articles")
      .select(`
        id, title, slug, excerpt, cover_url, author_id, status, views, created_at,
        users (id, name, email)
      `)
      .eq("category_id", category.id)
      .order("created_at", { ascending: false });

    if (artErr) throw artErr;

    return success(res, { category, articles });

  } catch (err) {
    return error(res, "GET_CATEGORY_ARTICLES_FAILED", err.message, 500);
  }
};