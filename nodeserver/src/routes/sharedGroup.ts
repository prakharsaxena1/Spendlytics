import express from "express";
import { authenticate } from "../middleware/auth";
import { getAllSharedGroup, getSharedGroup, createSharedGroup, editSharedGroup, deleteSharedGroup } from "../controllers/sharedGroup.controller";

const router = express.Router();

// Add this new route
router.get("/", authenticate, getAllSharedGroup);
router.post("/", authenticate, createSharedGroup);
router.put("/:groupId", authenticate, editSharedGroup);
router.delete("/:groupId", authenticate, deleteSharedGroup);
router.get("/:groupId", authenticate, getSharedGroup);

export default router;
