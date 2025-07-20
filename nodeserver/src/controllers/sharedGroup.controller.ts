import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { SharedGroup } from "../models/SharedGroup";
import { param, body, validationResult } from "express-validator";
import { Transaction } from "../models/Transaction";
import { Settlements } from "../models/Settlements";
import { Invitations } from "../models/Invitations";

export const createSharedGroup = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await Promise.all([
      body("groupName")
        .notEmpty()
        .withMessage("Group name is required")
        .run(req),
      body("members")
        .isArray({ min: 1 })
        .withMessage("Members must be an array with at least one element")
        .run(req),
      body("members.*")
        .isMongoId()
        .withMessage("Each member must be a valid MongoDB ObjectId")
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

    const { groupName, members } = req.body;
    const createdBy = req.user._id as string;

    const newSharedGroup = new SharedGroup({
      groupName,
      members: [createdBy],
      createdBy,
    });

    await newSharedGroup.save();

    await Promise.all(
      (members as string[]).map((member) =>
        Invitations.create({
          inviteBy: createdBy,
          inviteTo: member,
          sharedGroupId: newSharedGroup._id,
        })
      )
    );

    res.status(201).json({
      success: true,
      message: "Shared group created successfully.",
      sharedGroup: newSharedGroup,
    });
  } catch (error) {
    console.error("Error creating shared group:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSharedGroup = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await Promise.all([
      param("groupId")
        .notEmpty()
        .withMessage("Shared group ID is required")
        .isMongoId()
        .withMessage("Shared group ID must be a valid MongoDB ID")
        .run(req),
    ]);

    const { groupId } = req.params;

    if (!groupId) {
      res.status(400).json({
        success: false,
        message: "Shared group ID is required.",
      });
      return;
    }

    const sharedGroup = await SharedGroup.findById(groupId).populate(
      "members",
      "username firstname lastname level"
    );

    const sharedGroupTransactions = await Transaction.find({
      isShared: true,
      sharedGroup: groupId,
    });

    const invitedMembers = await Invitations.find({
      sharedGroupId: groupId,
    })
      .select("_id inviteBy inviteTo sharedGroupId")
      .populate("inviteTo", "username firstname lastname");

    if (!sharedGroup) {
      res.status(404).json({
        success: false,
        message: "Shared group not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      sharedGroup,
      invitedMembers,
      transactions: sharedGroupTransactions,
    });
  } catch (error) {
    console.error("Error fetching shared group:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllSharedGroup = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const sharedGroups = await SharedGroup.aggregate([
      {
        $match: {
          $or: [{ createdBy: req.user._id }, { members: req.user._id }],
        },
      },
      {
        $project: {
          groupName: 1,
          totalExpense: 1,
          isSettled: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      sharedGroups,
    });
  } catch (error) {
    console.error("Error fetching all shared groups:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteSharedGroup = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await Promise.all([
      param("groupId")
        .notEmpty()
        .withMessage("Shared group ID is required")
        .isMongoId()
        .withMessage("Shared group ID must be a valid MongoDB ID")
        .run(req),
    ]);
    const { groupId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }

    const deletedSharedGroup = await SharedGroup.findByIdAndDelete(groupId);

    if (!deletedSharedGroup) {
      res.status(404).json({
        success: false,
        message: "Shared group not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Shared group deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting shared group:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addSettlementToSharedGroup = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await Promise.all([
      param("groupId")
        .notEmpty()
        .withMessage("Shared group ID is required")
        .isMongoId()
        .withMessage("Shared group ID must be a valid MongoDB ID")
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
    const { groupId } = req.params;
    const { paidTo, amount, note } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }

    const settlement = new Settlements({
      paidBy: req.user._id,
      sharedGroupId: groupId,
      paidTo,
      amount,
      note,
    });

    await settlement.save();

    res.status(200).json({
      success: true,
      message: "Settlement added successfully.",
    });
  } catch (error) {
    console.error("Error adding settlement to shared group:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addMember = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await Promise.all([
      body("members")
        .isArray({ min: 1 })
        .withMessage("Members must be an array with at least one element")
        .run(req),
      body("members.*")
        .isMongoId()
        .withMessage("Each member must be a valid MongoDB ObjectId")
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

    const { members } = req.body;
    const { groupId } = req.params;
    const createdBy = req.user._id as string;

    await Promise.all(
      (members as string[]).map((member) =>
        Invitations.create({
          inviteBy: createdBy,
          inviteTo: member,
          sharedGroupId: groupId,
        })
      )
    );
    res.status(201).json({
      success: true,
      message: "An invitation has been sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const removeMember = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await Promise.all([
      param("groupId").isMongoId().withMessage("Invalid groupId").run(req),
      body("member").isMongoId().withMessage("Invalid member ID").run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
      return;
    }

    const { groupId } = req.params;
    const { member } = req.body;
    const userId = req.user._id as string;

    await Invitations.deleteMany({
      inviteTo: member,
      inviteBy: userId,
      sharedGroupId: groupId,
    });

    const updatedGroup = await SharedGroup.findByIdAndUpdate(
      groupId,
      { $pull: { members: member } },
      { new: true }
    )
      .populate("members", "username firstname lastname email level")
      .lean();

    const memberCount = Array.isArray(updatedGroup.members)
      ? updatedGroup.members.length
      : 0;

    res.status(200).json({
      success: true,
      message: `Member ${member} removed`,
      sharedGroup: {
        ...updatedGroup,
        memberCount,
      },
    });
  } catch (error) {
    console.error("Error in removeMember:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
