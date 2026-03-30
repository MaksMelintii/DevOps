import express from "express";
import { getCategoriesController,
         getCategoryArticlesController
 } from "../controllers/сategoryController.js";

const router = express.Router();

router.get("/", getCategoriesController);
router.get("/:slug/articles", getCategoryArticlesController);

export default router;