import express from "express";
import { authenticate } from "../middleware/auth";
import { searchUsers } from "../controllers/user.controller";

const router = express.Router();

// Add this new route
router.get("/search", authenticate, searchUsers);

export default router;
