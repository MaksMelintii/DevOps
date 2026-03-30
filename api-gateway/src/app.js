import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl
  })
);

app.use(
  "/api/articles",
  createProxyMiddleware({
    target: process.env.CONTENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl
  })
);

app.use(
  "/api/authors",
  createProxyMiddleware({
    target: process.env.CONTENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl
  })
);

app.use(
  "/api/categories",
  createProxyMiddleware({
    target: process.env.CONTENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl
  })
);

app.use(
  "/api/tags",
  createProxyMiddleware({
    target: process.env.CONTENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl
  })
);

app.use(
  "/api/admin",
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl
  })
);

app.get("/health", (req, res) => {
  res.json({ service: "api-gateway", status: "ok" });
});

export default app;