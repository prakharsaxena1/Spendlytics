import express from "express";
import { authenticate } from "../middleware/auth";
import {
  inviteAction,
  searchUsers,
  getDashboardDetails,
  userNotifications,
  updateSettings,
  updateStartingBalance,
} from "../controllers/user.controller";

const router = express.Router();

// Add this new route
router.get("/search", authenticate, searchUsers);
router.get("/notifications", authenticate, userNotifications);
router.get("/dashboard", authenticate, getDashboardDetails);
router.post("/invite", authenticate, inviteAction);
router.put("/settings", authenticate, updateSettings);
router.put("/details", authenticate, updateStartingBalance);

export default router;
