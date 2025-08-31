import { NextFunction, Response } from "express";
import { ITransaction, Transaction } from "../models/Transaction"; // Adjust the path as needed
import { body, param, query, validationResult } from "express-validator";
import { AuthenticatedRequest } from "../middleware/auth";

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body fields using express-validator
    await Promise.all([
      body("transactionType")
        .notEmpty()
        .withMessage("Transaction type is required")
        .isIn(["inflow", "outflow"])
        .withMessage("Invalid transaction type")
        .run(req),
      body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isFloat({ min: 0 })
        .withMessage("Amount must be a positive number")
        .run(req),
      body("transactionDate")
        .notEmpty()
        .withMessage("Transaction date is required")
        .isISO8601()
        .toDate()
        .withMessage("Invalid transaction date")
        .run(req),
      body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn(["needs", "wants", "savings", "investments", "debt"])
        .withMessage("Invalid category provided")
        .run(req),
      body("note").optional().isString().run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }
    const { transactionType, amount, transactionDate, category, note } =
      req.body;
    const newTransaction = new Transaction({
      userId: req.user._id,
      transactionType,
      amount,
      transactionDate,
      category,
      note,
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json({
      message: "Transaction created successfully",
      transaction: savedTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    next(error);
  }
};

export const getTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all([
      query("page")
        .notEmpty()
        .withMessage("Transaction type is required")
        .isFloat({ min: 0 })
        .withMessage("Page must be a positive number")
        .run(req),
      query("limit")
        .notEmpty()
        .withMessage("Limit is required")
        .isFloat({ min: 1 })
        .withMessage("Limit must be greater than or equal to 25")
        .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }
    const page = Math.max(parseInt(req.query.page as string) || 0, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 25, 1);
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find({ userId: req.user._id })
        .sort({ transactionDate: -1, createdBy: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    next(error);
  }
};

export const updateTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the URL param and body fields.
    await Promise.all([
      param("transactionId")
        .notEmpty()
        .withMessage("Transaction ID is required")
        .isMongoId()
        .withMessage("Invalid transaction ID")
        .run(req),
      body("amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Amount must be a positive number")
        .run(req),
      body("transactionDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid transaction date")
        .toDate()
        .run(req),
      body("note")
        .optional()
        .isString()
        .withMessage("Note must be a string")
        .run(req),
      body("category")
        .optional()
        .isIn(["needs", "wants", "savings", "investments", "debt"])
        .withMessage("Invalid category provided")
        .run(req),
    ]);

    // Check for any validation errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: errors.array(),
      });
      return;
    }

    // Extract the transactionId from URL parameters and userId from the body.
    const { transactionId } = req.params;
    const { amount, transactionDate, note, category } = req.body;

    // Ensure at least one allowed field is provided for update.
    if (
      amount === undefined &&
      transactionDate === undefined &&
      note === undefined &&
      category === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "No update fields provided. Please provide at least one field to update.",
      });
      return;
    }

    // Build an update object with only the allowed fields.
    const updateFields: Partial<{
      amount: number;
      transactionDate: Date;
      note: string;
      category: ITransaction["category"];
    }> = {};

    if (amount !== undefined) {
      updateFields.amount = amount;
    }
    if (transactionDate !== undefined) {
      updateFields.transactionDate = transactionDate;
    }
    if (note !== undefined) {
      updateFields.note = note;
    }
    if (category !== undefined) {
      updateFields.category = category;
    }
    // Update the transaction ensuring it belongs to the specified user.
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId: req.user._id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedTransaction) {
      res.status(404).json({
        success: false,
        message:
          "Transaction not found for the provided user and transaction ID",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    next(error);
  }
};

export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all([
      param("transactionId")
        .notEmpty()
        .withMessage("Transaction ID is required")
        .isMongoId()
        .withMessage("Invalid transaction ID")
        .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: errors.array(),
      });
      return;
    }
    const { transactionId } = req.params;
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: req.user._id,
    });
    if (!deletedTransaction) {
      res.status(404).json({
        success: false,
        message:
          "Transaction not found for the provided user and transaction ID",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      transaction: deletedTransaction,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    next(error);
  }
};
