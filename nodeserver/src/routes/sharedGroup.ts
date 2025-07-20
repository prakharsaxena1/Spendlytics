import express from "express";
import { authenticate } from "../middleware/auth";
import {
  getAllSharedGroup,
  getSharedGroup,
  createSharedGroup,
  deleteSharedGroup,
  addSettlementToSharedGroup,
  addMember,
  removeMember,
} from "../controllers/sharedGroup.controller";

const router = express.Router();

// Add this new route
router.post("/", authenticate, createSharedGroup);
router.get("/", authenticate, getAllSharedGroup);
router.get("/:groupId", authenticate, getSharedGroup);
router.put("/:groupId/add", authenticate, addMember);
router.put("/:groupId/remove", authenticate, removeMember);
router.delete("/:groupId", authenticate, deleteSharedGroup);
router.post("/:groupId/settlement", authenticate, addSettlementToSharedGroup);

export default router;
