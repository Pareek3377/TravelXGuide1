import express from "express";
import { applyGuide } from "../controllers/guideController.js";

const router = express.Router();

// POST /api/guide/apply
router.post("/apply", applyGuide);

export default router;
