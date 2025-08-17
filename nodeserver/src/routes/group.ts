import express from "express";
import { authenticate } from "../middleware/auth";
import {
  createGroup,
  getGroups,
  deleteGroup,
  getGroup,
  addMember,
  removeMember,
  updateGroupName,
} from "../controllers/groupCRUD.controller";
import {
  addGroupTransaction,
  getGroupTransactions,
  editGroupTransaction,
  deleteGroupTransaction,
} from "../controllers/groupTransactions.controller";
import {
  calculateSettlement,
  createSettlement,
  settlementAction,
  getSettlements,
} from "../controllers/groupSettlements.controller";

const router = express.Router();

// Group CRUD
router.post("/", authenticate, createGroup);
router.get("/", authenticate, getGroups);
router.delete("/:groupId", authenticate, deleteGroup);
router.get("/:groupId", authenticate, getGroup);
router.put("/:groupId/add", authenticate, addMember);
router.put("/:groupId/remove", authenticate, removeMember);
router.put("/:groupId", authenticate, updateGroupName);

// Group Transactions
router.post("/:groupId/transaction", authenticate, addGroupTransaction);
router.get("/:groupId/transaction", authenticate, getGroupTransactions);
router.put("/:groupId/transaction/:transactionId", authenticate, editGroupTransaction);
router.delete("/:groupId/transaction/:transactionId", authenticate, deleteGroupTransaction);
router.get("/:groupId/settlement", authenticate, calculateSettlement);
router.post("/:groupId/settlement", authenticate, createSettlement);
router.put("/:groupId/settlement/:settlementId", authenticate, settlementAction);
router.get("/:groupId/settlement", authenticate, getSettlements);

export default router;
