import { supabase } from "../models/supabaseClient.js";

export const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

export const createCategory = async ({ name, slug, description }) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        name,
        slug,
        description: description || null
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateCategory = async (id, data) => {
  const { data: category, error } = await supabase
    .from("categories")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return category;
};

export const deleteCategory = async (id) => {
  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};