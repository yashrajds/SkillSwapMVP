import express from "express";
import { getProfile, getUsers, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

export default router;
