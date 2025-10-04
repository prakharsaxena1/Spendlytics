import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { param, validationResult } from "express-validator";
import { Group } from "../models/Group";
import {
  GroupTransaction,
  GroupTransactionType,
} from "../models/GroupTransaction";

export const calculateBalanceBoard = async (
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
    const userId = req.user._id.toString();
    const transactions: GroupTransactionType[] = await GroupTransaction.find({
      group: groupId,
      transactionDate: {
        $gte: group.createdAt,
      },
    }).lean();

    const payments = {};

    const members = group.members.map((member) => member._id.toString());
    transactions.forEach(({ paidBy, amount, splitDetails, splitType }) => {
      if (paidBy.toString() === userId) {
        members.forEach((member) => {
          if (member !== userId) {
            const memberSplit =
              splitType === "percentage"
                ? amount * (splitDetails[member] / 100)
                : splitDetails[member];
            if (payments[member] === undefined) {
              payments[member] = 0;
            }
            payments[member] += memberSplit;
          }
        });
      } else {
        const myShare =
          splitType === "percentage"
            ? amount * (splitDetails[userId] / 100)
            : splitDetails[userId];
        payments[paidBy.toString()] -= myShare;
      }
    });

    res.status(200).json({
      success: true,
      message: "Balance board calculated successfully",
      payments,
    });
  } catch (error) {
    console.error("Error calculating balance board:", error);
    next(error);
  }
};
