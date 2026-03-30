import express from "express";
import { getAllArticles, 
        createArticleController, 
        updateArticleController, 
        deleteArticleController,
        getArticleByIdController,
        uploadImageController } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { getAdminCategoriesController, 
        createCategoryController, 
        updateCategoryController,
        deleteCategoryController} from "../controllers/adminCategoryController";

const router = express.Router();

router.get("/articles", getAllArticles);
router.post("/articles",authMiddleware, createArticleController);
router.put("/articles/:id",authMiddleware, updateArticleController);
router.delete("/articles/:id",authMiddleware, deleteArticleController);
router.get("/articlesid/:id" , getArticleByIdController);
router.get("/categories", getAdminCategoriesController);
router.post(
  "/categories",
  authMiddleware,
  createCategoryController
);
router.put(
  "/categories/:id",
  authMiddleware,
  updateCategoryController
);
router.delete(
  "/categories/:id",
  authMiddleware,
  deleteCategoryController
);
router.post(
  "/upload",
  authMiddleware,
  upload.single("images"),
  uploadImageController
);

export default router;