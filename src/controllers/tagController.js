import { supabase } from "../models/supabaseClient.js";
import { success, error } from "../utils/response.js";

// Повертає всі теги
export const getTagsController = async (req, res) => {
  try {
    const { data, error: err } = await supabase
      .from("tags")
      .select("*")
      .order("created_at", { ascending: true });

    if (err) throw err;

    return success(res, data);
  } catch (err) {
    return error(res, "GET_TAGS_FAILED", err.message, 500);
  }
};

// Повертає всі статті для певного тегу
export const getArticlesByTagController = async (req, res) => {
  try {
    const { slug } = req.params;

    // Знаходимо тег
    const { data: tag, error: tagErr } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .single();

    if (tagErr || !tag) return error(res, "TAG_NOT_FOUND", "Tag not found", 404);

    // Знаходимо всі article_id з article_tags
    const { data: articleTags, error: atErr } = await supabase
      .from("article_tags")
      .select("article_id")
      .eq("tag_id", tag.id);

    if (atErr) throw atErr;

    const articleIds = articleTags.map((t) => t.article_id);

    if (articleIds.length === 0) return success(res, []);

    // Повертаємо статті
    const { data: articles, error: artErr } = await supabase
      .from("articles")
      .select(`
        *,
        users(id, name, email),
        categories(id, name, slug)
      `)
      .in("id", articleIds)
      .order("created_at", { ascending: false });

    if (artErr) throw artErr;

    return success(res, articles);
  } catch (err) {
    return error(res, "GET_ARTICLES_BY_TAG_FAILED", err.message, 500);
  }
};