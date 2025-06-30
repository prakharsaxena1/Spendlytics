import { Response } from "express";
import { ITransaction, Transaction } from "../models/Transaction"; // Adjust the path as needed
import { body, param, validationResult } from "express-validator";
import { AuthenticatedRequest } from "../middleware/auth";

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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
      body("isShared").optional().isBoolean().run(req),
      body("sharedGroupId")
        .optional()
        .isMongoId()
        .withMessage("Invalid shared group ID")
        .run(req),
    ]);

    // Check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }

    // Destructure validated fields from request body
    const {
      transactionType,
      amount,
      transactionDate,
      category,
      note,
      isShared,
      sharedGroupId,
    } = req.body;

    // Create a new Transaction document.
    const newTransaction = new Transaction({
      userId: req.user._id,
      transactionType,
      amount,
      transactionDate,
      category,
      note,
      isShared,
      sharedGroupId,
    });

    // Save the transaction in the database.
    const savedTransaction = await newTransaction.save();

    // Respond with the created transaction status.
    res.status(201).json({
      message: "Transaction created successfully",
      transaction: savedTransaction,
    });
    return;
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Server error", transaction: null });
    return;
  }
};

export const getTransactions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Check for validation errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }

    // Query the database for transactions belonging to the specified user.
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      transactionDate: -1,
    });

    // Respond with the fetched transactions.
    res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });
    return;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error", transactions: [] });
    return;
  }
};

export const updateTransaction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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
      body("isShared").optional().isBoolean().run(req),
      body("sharedGroupId")
        .optional()
        .isMongoId()
        .withMessage("Invalid shared group ID")
        .run(req),
    ]);

    // Check for any validation errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }

    // Extract the transactionId from URL parameters and userId from the body.
    const { transactionId } = req.params;
    const { amount, transactionDate, note, category, isShared, sharedGroupId } =
      req.body;

    // Ensure at least one allowed field is provided for update.
    if (
      amount === undefined &&
      transactionDate === undefined &&
      note === undefined &&
      category === undefined &&
      isShared === undefined &&
      sharedGroupId === undefined
    ) {
      res.status(400).json({
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
      isShared: boolean;
      sharedGroupId: string;
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
    if (category !== undefined) {
      updateFields.isShared = isShared;
    }
    if (category !== undefined) {
      updateFields.sharedGroupId = sharedGroupId;
    }
    // Update the transaction ensuring it belongs to the specified user.
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId: req.user._id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    // If a transaction isn't found, return a 404 error.
    if (!updatedTransaction) {
      res.status(404).json({
        message:
          "Transaction not found for the provided user and transaction ID",
      });
      return;
    }

    // Respond with the updated transaction.
    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
    return;
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Validate that userId and transactionId are provided in the request body and are valid MongoDB ObjectIds.
    await Promise.all([
      param("transactionId")
        .notEmpty()
        .withMessage("Transaction ID is required")
        .isMongoId()
        .withMessage("Invalid transaction ID")
        .run(req),
    ]);

    // Check for any validation errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }

    // Extract the transactionId from the request body.
    const { transactionId } = req.params;

    // Attempt to find and delete the transaction that matches both userId and transactionId.
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: req.user._id,
    });

    if (!deletedTransaction) {
      res.status(404).json({
        message:
          "Transaction not found for the provided user and transaction ID",
      });
      return;
    }

    // Respond with success and the deleted transaction.
    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: deletedTransaction,
    });
    return;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      message: "Server error",
    });
    return;
  }
};
