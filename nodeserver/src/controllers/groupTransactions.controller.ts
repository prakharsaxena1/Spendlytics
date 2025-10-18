import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Group } from "../models/Group";
import { param, body, validationResult } from "express-validator";
import { GroupTransaction } from "../models/GroupTransaction";

export const addGroupTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all([
      param("groupId")
        .notEmpty()
        .withMessage("Group ID is required")
        .isMongoId()
        .withMessage("Group ID must be a valid MongoDB ID")
        .run(req),
      body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a positive number")
        .toFloat()
        .run(req),
      body("paidBy")
        .notEmpty()
        .withMessage("Paid By is required")
        .isMongoId()
        .withMessage("Paid By must be a valid MongoDB ID")
        .run(req),
      body("transactionDate")
        .isISO8601()
        .withMessage("Invalid transaction date")
        .toDate()
        .run(req),
      body("note")
        .optional()
        .isString()
        .withMessage("Note must be a string")
        .run(req),
      body("splitType")
        .notEmpty()
        .withMessage("splitType is required")
        .isIn(["percentage", "value"])
        .withMessage("Invalid splitType provided")
        .run(req),
      body("splitDetails")
        .exists()
        .withMessage("splitDetails is required")
        .bail()
        .custom((val) => typeof val === "object" && !Array.isArray(val))
        .withMessage("splitDetails must be an object"),
      body("splitDetails.*")
        .custom((value, { path }) => {
          const key = path.split(".")[1];
          if (!/^[0-9a-fA-F]{24}$/.test(key)) {
            throw new Error(`Invalid MongoDB ObjectId key: "${key}"`);
          }
          return true;
        })
        .bail()
        .isNumeric()
        .withMessage("Each splitDetails value must be a number")
        .toFloat(),
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
    const { groupId } = req.params;
    const { amount, transactionDate, note, splitType, splitDetails, paidBy } =
      req.body;
    const transaction = await GroupTransaction.create({
      amount,
      transactionDate,
      note,
      group: groupId,
      splitType,
      splitDetails,
      paidBy,
      createdBy: req.user._id,
    });

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $inc: {
          totalExpense: amount,
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Transaction added and group totals updated.",
      transaction,
      updatedGroup,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    next(error);
  }
};

export const getGroupTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Promise.all([
      param("groupId")
        .notEmpty()
        .withMessage("Group ID is required")
        .isMongoId()
        .withMessage("Group ID must be a valid MongoDB ID")
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
    const { groupId } = req.params;
    const transactions = await GroupTransaction.find({ group: groupId }).sort({
      transactionDate: -1,
    });
    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    next(error);
  }
};

export const editGroupTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  await Promise.all([
    param("groupId")
      .notEmpty()
      .withMessage("Group ID is required")
      .isMongoId()
      .withMessage("Group ID must be a valid MongoDB ID")
      .run(req),
    param("transactionId")
      .notEmpty()
      .withMessage("Transaction ID is required")
      .isMongoId()
      .withMessage("Transaction ID must be a valid MongoDB ID")
      .run(req),
    body("paidBy")
      .notEmpty()
      .withMessage("Paid By is required")
      .isMongoId()
      .withMessage("Paid By must be a valid MongoDB ID")
      .run(req),
    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a positive number")
      .toFloat()
      .run(req),
    body("transactionDate")
      .notEmpty()
      .withMessage("Transaction date is required")
      .isISO8601()
      .withMessage("Invalid transaction date")
      .toDate()
      .run(req),
    body("note")
      .optional()
      .isString()
      .withMessage("Note must be a string")
      .run(req),
    body("splitType")
      .notEmpty()
      .withMessage("splitType is required")
      .isIn(["percentage", "value"])
      .withMessage("Invalid splitType")
      .run(req),
    body("splitDetails")
      .exists()
      .withMessage("splitDetails is required")
      .bail()
      .custom((val) => typeof val === "object" && !Array.isArray(val))
      .withMessage("splitDetails must be an object")
      .run(req),
    body("splitDetails.*")
      .custom((value, { path }) => {
        const key = path.split(".")[1];
        if (!/^[0-9a-fA-F]{24}$/.test(key)) {
          throw new Error(`Invalid ObjectId key: ${key}`);
        }
        return true;
      })
      .bail()
      .isNumeric()
      .withMessage("Each splitDetails value must be a number")
      .toFloat()
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
  const { groupId, transactionId } = req.params;
  const {
    amount: newAmount,
    transactionDate,
    note,
    splitType,
    splitDetails,
    paidBy,
  } = req.body;
  const user = req.user._id.toString();

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
      return;
    }
    const existing = await GroupTransaction.findOne({
      _id: transactionId,
      group: groupId,
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Transaction not found in this group.",
      });
      return;
    }
    if (
      existing.createdBy.toString() !== user &&
      group.createdBy.toString() !== user
    ) {
      res.status(401).json({
        success: false,
        message: "You are unauthorized to edit this transaction",
      });
      return;
    }
    const delta = newAmount - existing.amount;
    existing.amount = newAmount;
    existing.transactionDate = transactionDate;
    existing.note = note ?? existing.note;
    existing.splitType = splitType;
    existing.splitDetails = splitDetails;
    existing.paidBy = paidBy;
    await existing.save();
    await Group.findByIdAndUpdate(groupId, {
      $inc: {
        totalExpense: delta,
      },
    });
    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: existing,
    });
  } catch (err) {
    console.error("Error editing transaction:", err);
    next(err);
  }
};

export const deleteGroupTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all([
      param("groupId")
        .notEmpty()
        .withMessage("Group ID is required")
        .isMongoId()
        .withMessage("Group ID must be a valid MongoDB ID")
        .run(req),
      param("transactionId")
        .notEmpty()
        .withMessage("Transaction ID is required")
        .isMongoId()
        .withMessage("Transaction ID must be a valid MongoDB ID")
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
    const { groupId, transactionId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
      return;
    }

    const isGroupOwner = group.createdBy.toString() === req.user._id.toString();
    const deletedTransaction = await GroupTransaction.findOneAndDelete({
      _id: transactionId,
      group: groupId,
      ...(isGroupOwner ? {} : { userId: req.user._id }),
    });

    if (!deletedTransaction) {
      res
        .status(404)
        .json({ success: false, message: "Transaction not found." });
      return;
    }
    await group.updateOne(
      {
        $inc: {
          totalExpense: -deletedTransaction.amount,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transactions:", error);
    next(error);
  }
};
