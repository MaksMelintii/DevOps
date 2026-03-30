import { supabase } from "./supabaseClient.js";

export const getAllArticlesAdmin = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      users(name, email),
      categories(name, slug),
      article_tags(
        tags(name, slug)
      )
    `);

  if (error) throw error;

  return data;
};

export const createArticle = async (article) => {
  const { data, error } = await supabase
    .from("articles")
    .insert([article])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateArticle = async (id, article) => {
  const { data, error } = await supabase
    .from("articles")
    .update(article)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data;
};

export const deleteArticle = async (id) => {
  const { data, error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data;
};

export const getArticles = async (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to); // range має бути після order

  if (error) throw error;

  return { data, count };
};