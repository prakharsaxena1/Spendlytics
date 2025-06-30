// Dependencies
import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller";
import { authenticate } from "../middleware/auth";
const router = express.Router();

// Routes
router
  .route("/")
  .post(authenticate, createTransaction)
  .get(authenticate, getTransactions);
router
  .route("/:transactionId")
  .put(authenticate, updateTransaction)
  .delete(authenticate, deleteTransaction);

// Exports
export default router;
