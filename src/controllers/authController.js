import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/userModel.js";
import { success, error } from "../utils/response.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password, bio, avatar_url, is_admin } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      email,
      password: hashedPassword,
      bio: bio || null,
      avatar_url: avatar_url || null,
      is_admin: is_admin || false
      // created_at — Supabase автоматично поставить NOW()
    });

    return success(res, user);

  } catch (err) {
    return error(res, "SERVER_ERROR", err.message, 500);
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, bio, avatar_url } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      email,
      password: hashedPassword,
      bio: bio || null,
      avatar_url: avatar_url || null,
      is_admin: true // ✅ тут автоматично адмін
      // created_at — Supabase автоматично поставить NOW()
    });

    return success(res, user);

  } catch (err) {
    return error(res, "REGISTER_ADMIN_FAILED", err.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    // Токен - id, email і is_admin
    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return success(res, {
      token,
      user
    }); // повертаємо токен і дані користувача

  } catch (err) {
    return error(res, "SERVER_ERROR", err.message, 500);
  }
};

export const logout = async (req, res) => {
  // для logout достатньо видалити токен на фронті , фронт видаляє токен з localStorage / cookies.
  // Але ми можемо відправити підтвердження
  res.json({ message: "Logout successful" });
};