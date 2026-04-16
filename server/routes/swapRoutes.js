import express from "express";
import { createSwap, getSwaps, updateSwapStatus } from "../controllers/swapController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createSwap).get(protect, getSwaps);
router.route("/:id").put(protect, updateSwapStatus);

export default router;
