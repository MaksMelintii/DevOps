import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.json({ service: "admin-service", status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Admin service running on port ${PORT}`);
});