import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Group } from "../models/Group";
import { param, body, validationResult } from "express-validator";
import { Settlements } from "../models/Settlements";
import { Invitations } from "../models/Invitations";
import { GroupTransaction } from "../models/GroupTransaction";

export const createGroup = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
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

    const newGroup = new Group({
      groupName,
      members: [createdBy],
      createdBy,
    });

    await newGroup.save();

    await Promise.all(
      (members as string[]).map((member) =>
        Invitations.create({
          inviteBy: createdBy,
          inviteTo: member,
          group: newGroup._id,
        })
      )
    );

    res.status(201).json({
      success: true,
      message: "Group created successfully.",
      group: newGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    next(error);
  }
};

export const getGroups = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id as string;
    const groups = await Group.aggregate([
      {
        $match: {
          $or: [{ createdBy: userId }, { members: userId }],
        },
      },
      {
        $project: {
          groupName: 1,
          totalExpense: 1,
          unsettledAmount: 1,
          isSettled: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    console.error("Error fetching all groups:", error);
    next(error);
  }
};

export const deleteGroup = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await param("groupId")
      .notEmpty()
      .withMessage("Group ID is required")
      .isMongoId()
      .withMessage("Group ID must be a valid MongoDB ID")
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }

    const { groupId } = req.params;
    const userId = req.user._id;
    const deletedGroup = await Group.findOneAndDelete({
      _id: groupId,
      createdBy: userId,
    });
    if (!deletedGroup) {
      res.status(404).json({
        success: false,
        message: "Group not found or you are not authorized to delete it.",
      });
      return;
    }
    await Promise.all([
      GroupTransaction.deleteMany({ group: groupId }),
      Invitations.deleteMany({ group: groupId }),
      Settlements.deleteMany({ group: groupId }),
    ]);
    res.status(200).json({
      success: true,
      message: "Group and all related data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    next(error);
  }
};

export const getGroup = async (
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
      res
        .status(400)
        .json({ message: "Invalid request", errors: errors.array() });
      return;
    }
    const { groupId } = req.params;
    const group = await Group.findOne({
      _id: groupId,
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    }).populate("members", "username firstname lastname level");

    if (!group) {
      res.status(404).json({
        success: false,
        message: "Group not found.",
      });
      return;
    }
    // const transactions = await GroupTransaction.find({ group: groupId });
    const invitedMembers = await Invitations.find({ group: groupId })
      .select("_id inviteBy inviteTo group")
      .populate("inviteTo", "username firstname lastname");
    // const settlements = await Settlements.find({ group: groupId });
    res.status(200).json({
      success: true,
      group,
      invitedMembers,
      // transactions,
      // settlements,
    });
  } catch (error) {
    console.error("Error fetching Group:", error);
    next(error);
  }
};

export const addMember = async (
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
      body("members")
        .isArray({ min: 1 })
        .withMessage("Members must be an array with at least one element")
        .run(req),
      body("members.*")
        .isMongoId()
        .withMessage("Each member must be a valid MongoDB ObjectId")
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

    const { members } = req.body;
    const { groupId } = req.params;
    const createdBy = req.user._id.toString();

    const group = await Group.findById(groupId).lean();
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
      return;
    }

    if (group.createdBy.toString() !== createdBy) {
      res.status(401).json({
        success: false,
        message: "You are not authorized to add members to this group",
      });
      return;
    }

    // Existing group members
    const existingMemberIds = group.members.map((m) => m.toString());

    // Check for existing invitations for this group
    const existingInvites = await Invitations.find({
      group: groupId,
      inviteTo: { $in: members },
    }).lean();

    const alreadyInvitedIds = existingInvites.map((inv) =>
      inv.inviteTo.toString()
    );

    // Filter: not in group & not already invited
    const eligibleMembers = (members as string[]).filter(
      (memberId) =>
        !existingMemberIds.includes(memberId) &&
        !alreadyInvitedIds.includes(memberId)
    );

    if (eligibleMembers.length === 0) {
      res.status(200).json({
        success: true,
        message: "No new members to invite",
      });
      return;
    }

    await Invitations.insertMany(
      eligibleMembers.map((member) => ({
        inviteBy: createdBy,
        inviteTo: member,
        group: groupId,
      }))
    );

    res.status(201).json({
      success: true,
      message: `Invitations sent to ${eligibleMembers.length} new member(s)`,
    });
  } catch (error) {
    console.error("Error adding members:", error);
    next(error);
  }
};

export const removeMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
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
      group: groupId,
    });

    await Group.findByIdAndUpdate(
      groupId,
      { $pull: { members: member } },
      { new: true }
    )
      .populate("members", "username firstname lastname email level")
      .lean();

    res.status(200).json({
      success: true,
      message: "Member removed",
    });
  } catch (error) {
    console.error("Error in removeMember:", error);
    next(error);
  }
};

export const updateGroupName = async (
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
      body("groupName")
        .notEmpty()
        .withMessage("Group name is required")
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
    const { groupName } = req.body;

    const group = await Group.findOneAndUpdate(
      { _id: groupId, createdBy: req.user._id },
      { groupName },
      { new: true, runValidators: true }
    ).populate("members", "username firstname lastname email level");
    if (!group) {
      res.status(401).json({
        success: false,
        message: "Group not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Group name updated",
      group,
    });
  } catch (error) {
    console.error("Error adding settlement to group:", error);
    next(error);
  }
};
