import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Settlements } from "../models/Settlements";
import { param, body, validationResult } from "express-validator";
import { Group } from "../models/Group";
import {
  GroupTransaction,
  GroupTransactionType,
} from "../models/GroupTransaction";

export const calculateSettlement = async (
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
    const transactions: GroupTransactionType[] = await GroupTransaction.find({
      group: groupId,
      transactionDate: {
        ...(group.lastSettledAt === null
          ? { $gte: group.createdAt }
          : { $gt: group.lastSettledAt }),
      },
    }).lean();

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
    next(error);
  }
};

export const getSettlements = async (
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
    const settlements = await Settlements.find({ group: groupId }).lean();
    res.status(200).json({
      success: true,
      message: "Settlements fetched successfully",
      settlements,
    });
  } catch (error) {
    console.error("Error in calculateSettlement:", error);
    next(error);
  }
};

export const createSettlement = async (
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
      group: groupId,
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
    next(error);
  }
};

export const settlementAction = async (
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
      res.status(404).json({
        success: false,
        message: "Settlement not found in this group",
      });
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
  } catch (error) {
    console.error("Error in settlement action:", error);
    next(error);
  }
};
