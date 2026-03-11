import { supabase } from "./supabaseClient.js";

export const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return data;
};

export const createUser = async (user) => {
  const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select()
    .single();

  if (error) throw error;

  return data;
};