import express from "express";
import { getAuthorProfileController,
        getAuthorArticlesController
 } from "../controllers/authorController.js";

const router = express.Router();

// Профіль автора за slug
router.get("/:slug", getAuthorProfileController);
router.get("/:slug/articles", getAuthorArticlesController);

export default router;