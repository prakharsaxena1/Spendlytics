import express from "express";
import { authenticate } from "../middleware/auth";
import {
  inviteAction,
  searchUsers,
  userNotifications,
  updateSettings,
} from "../controllers/user.controller";

const router = express.Router();

// Add this new route
router.get("/search", authenticate, searchUsers);
router.get("/notifications", authenticate, userNotifications);
router.post("/invite", authenticate, inviteAction);
router.put("/settings", authenticate, updateSettings);

export default router;
