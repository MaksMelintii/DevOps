import express from "express";
import { getArticlesController,
        getArticleBySlugController,
        getRelatedArticlesController,
        incrementArticleViewController,
        searchArticlesController
 } from "../controllers/articleController.js";

const router = express.Router();

router.get("/search", searchArticlesController);
router.get("/articles", getArticlesController);
router.get("/:slug", getArticleBySlugController);
router.get("/:slug/related", getRelatedArticlesController);
router.post("/:id/view", incrementArticleViewController);


export default router;