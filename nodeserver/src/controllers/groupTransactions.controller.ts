import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Group } from "../models/Group";
import { param, body, validationResult } from "express-validator";
import { Settlements } from "../models/Settlements";
import {
  GroupTransaction,
  GroupTransactionType,
} from "../models/GroupTransaction";
import mongoose from "mongoose";

export const addGroupTransaction = async (
  req: AuthenticatedRequest,
  res: Response
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
        .withMessage("Group ID is required")
        .isMongoId()
        .withMessage("Group ID must be a valid MongoDB ID")
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
    const { amount, transactionDate, note, splitType, splitDetails } = req.body;
    const transaction = await GroupTransaction.create({
      amount,
      transactionDate,
      note,
      userId: req.user._id,
      groupId,
      splitType,
      splitDetails,
    });

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $inc: {
          unsettledAmount: amount,
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
    res
      .status(500)
      .json({ success: false, message: "Server error", transactions: [] });
  }
};

export const getGroupTransactions = async (
  req: AuthenticatedRequest,
  res: Response
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
    const transactions = await GroupTransaction.find({ groupId }).sort({
      transactionDate: -1,
    });
    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", transactions: [] });
    return;
  }
};

export const editGroupTransaction = async (
  req: AuthenticatedRequest,
  res: Response
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
        // path = 'splitDetails.<key>'
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
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existing = await GroupTransaction.findOne({
      _id: transactionId,
      group: groupId,
    }).session(session);

    if (!existing) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({
        success: false,
        message: "Transaction not found in this group.",
      });
      return;
    }
    const delta = newAmount - existing.amount;
    existing.amount = newAmount;
    existing.transactionDate = transactionDate;
    existing.note = note ?? existing.note;
    existing.splitType = splitType;
    existing.splitDetails = splitDetails;
    await existing.save({ session });
    await Group.findByIdAndUpdate(
      groupId,
      {
        $inc: {
          unsettledAmount: delta,
          totalExpense: delta,
        },
      },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Transaction updated and unsettledAmount adjusted.",
      transaction: existing,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error editing transaction:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteGroupTransaction = async (
  req: AuthenticatedRequest,
  res: Response
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

    const deletedTransaction = await GroupTransaction.findOneAndDelete({
      _id: transactionId,
      groupId,
    });

    if (!deletedTransaction) {
      res
        .status(404)
        .json({ success: false, message: "Transaction not found." });
      return;
    }

    await Group.findByIdAndUpdate(
      groupId,
      {
        $inc: {
          unsettledAmount: -deletedTransaction.amount,
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createSettlement = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await Promise.all([
      param("groupId")
        .notEmpty()
        .withMessage("Group ID is required")
        .isMongoId()
        .withMessage("Group ID must be a valid MongoDB ID")
        .run(req),
      body("paidTo")
        .isMongoId()
        .withMessage("Paid to must be a valid user ID")
        .run(req),
      body("amount")
        .isNumeric()
        .withMessage("Settlement amount must be a number")
        .run(req),
      body("note")
        .optional()
        .trim()
        .isString()
        .withMessage("Note must be a string")
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
    const { paidTo, amount, note } = req.body;

    const settlement = new Settlements({
      amount,
      paidBy: req.user._id,
      paidTo,
      groupId,
      note,
      status: "pending",
    });

    await settlement.save();

    res.status(200).json({
      success: true,
      message: "Settlement added successfully.",
    });
  } catch (error) {
    console.error("Error adding settlement to group:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const settlementAction = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  await Promise.all([
    param("groupId")
      .notEmpty()
      .withMessage("Group ID is required")
      .isMongoId()
      .withMessage("Group ID must be a valid MongoDB ID")
      .run(req),
    param("settlementId")
      .notEmpty()
      .withMessage("Settlement ID is required")
      .isMongoId()
      .withMessage("Settlement ID must be a valid MongoDB ID")
      .run(req),
    body("action")
      .notEmpty()
      .withMessage("Action is required")
      .isIn(["completed", "rejected"])
      .withMessage('Action must be either "completed" or "rejected"')
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
  const { groupId, settlementId } = req.params;
  const { action } = req.body;
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404).json({ success: false, message: "Group not found" });
    return;
  }
  const updatedSettlement = await Settlements.findOneAndUpdate(
    { _id: settlementId, group: groupId },
    { status: action },
    { new: true }
  );
  if (!updatedSettlement) {
    res
      .status(404)
      .json({ success: false, message: "Settlement not found in this group" });
    return;
  }
  if (action === "completed") {
    await Group.updateOne(
      { _id: groupId },
      { $inc: { unsettledAmount: -updatedSettlement.amount } }
    );
  }
  res.status(200).json({
    success: true,
    message: `Settlement marked as ${action}`,
  });
};

export const calculateSettlement = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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
    const group = await Group.findById(groupId).lean();
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
      return;
    }
    let transactions: GroupTransactionType[] = [];
    if (group.lastSettledAt === null) {
      transactions = await GroupTransaction.find({ groupId }).lean();
    } else {
      transactions = await GroupTransaction.find({
        groupId,
        transactionDate: { $gt: group.lastSettledAt },
      }).lean();
    }

    const members = group.members.map((member) => member._id.toString());

    const userPayments: Record<string, number> = {};
    members.forEach((member) => {
      userPayments[member] = 0;
    });
    const totalEqualPay = group.totalExpense / members.length;
    transactions.forEach(({ amount, splitType, splitDetails }) => {
      members.forEach((member) => {
        const amtPaid =
          splitType === "percentage"
            ? (amount * splitDetails[member]) / 100
            : splitDetails[member];
        userPayments[member] += amtPaid;
      });
    });
    members.forEach((member) => {
      userPayments[member] -= totalEqualPay;
    });
    res.status(200).json({
      success: true,
      message: "Settlement calculated successfully",
      userPayments,
    });
  } catch (error) {
    console.error("Error in calculateSettlement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSettlements = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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
      res
        .status(400)
        .json({
          success: false,
          message: "Invalid request",
          errors: errors.array(),
        });
      return;
    }
    const { groupId } = req.params;
    const settlements = await Settlements.find({ group: groupId }).lean();
    res.status(200).json({
      success: true,
      message: "Settlements fetched successfully",
      settlements,
    });
  } catch (error) {
    console.error("Error in calculateSettlement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
