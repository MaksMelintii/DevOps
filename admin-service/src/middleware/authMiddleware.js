import jwt from "jsonwebtoken";
import { error } from "../utils/response.js";

export const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return error(res, "NO_TOKEN", "Token required", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    // тут буде:
    // req.user.id
    // req.user.is_admin

    next();

  } catch (err) {
    return error(res, "INVALID_TOKEN", "Invalid token", 401);
  }
};