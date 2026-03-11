import express from "express";
import { getTagsController, getArticlesByTagController } from "../controllers/tagController.js";

const router = express.Router();

router.get("/", getTagsController);
router.get("/:slug/articles", getArticlesByTagController);

export default router;