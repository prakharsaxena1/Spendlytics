// Dependencies
import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
const router = express.Router();

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", authenticate, logoutUser);
router.get("/me", authenticate, getCurrentUser);

// Exports
export default router;
