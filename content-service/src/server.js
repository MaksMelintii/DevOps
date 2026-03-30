import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import articleRoutes from "./routes/articleRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "content-service", status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Content service running on port ${PORT}`);
});