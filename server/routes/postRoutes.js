import express from "express";
import { createPost, getPosts, togglePostLike, togglePostSave } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getPosts).post(createPost);
router.put("/:id/like", togglePostLike);
router.put("/:id/save", togglePostSave);

export default router;
