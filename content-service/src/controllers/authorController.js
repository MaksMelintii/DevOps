import { supabase } from "../models/supabaseClient.js";
import { success, error } from "../utils/response.js";

// Профіль автора
export const getAuthorProfileController = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: author, error: authErr } = await supabase
      .from("users")
      .select("id, name, slug, email, bio, avatar_url, created_at")
      .eq("slug", slug)
      .single();

    if (authErr || !author) return error(res, "AUTHOR_NOT_FOUND", "Author not found", 404);

    return success(res, author);
  } catch (err) {
    return error(res, "GET_AUTHOR_FAILED", err.message, 500);
  }
};

// Статті автора
export const getAuthorArticlesController = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Знайти автора
    const { data: author, error: authErr } = await supabase
      .from("users")
      .select("id")
      .eq("slug", slug)
      .single();

    if (authErr || !author) return error(res, "AUTHOR_NOT_FOUND", "Author not found", 404);

    // 2. Вибрати статті автора
    const { data: articles, error: articlesErr } = await supabase
      .from("articles")
      .select(`
        id, title, slug, excerpt, cover_url, status, views, published_at, created_at, updated_at,
        categories(name, slug),
        article_tags(tag_id)
      `)
      .eq("author_id", author.id)
      .order("created_at", { ascending: false });

    if (articlesErr) throw articlesErr;

    return success(res, articles);

  } catch (err) {
    return error(res, "GET_AUTHOR_ARTICLES_FAILED", err.message, 500);
  }
};