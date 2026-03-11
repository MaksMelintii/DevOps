import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import articleRoutes from "./routes/articleRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/articles", articleRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/authors", authorRoutes);


app.get("/", (req, res) => {
  res.send("Backend працює 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});