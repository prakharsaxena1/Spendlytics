import express from "express";
import { authenticate } from "../middleware/auth";
import { getAnalytics } from "../controllers/dashboard.controller";

const router = express.Router();

// Add this new route
router.get("/analytics", authenticate, getAnalytics);

export default router;
