import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";
import { Invitations } from "../models/Invitations";
import { Group } from "../models/Group";
import { body, validationResult } from "express-validator";
import { Settlements } from "../models/Settlements";

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.query;
    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length < 3
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid username (at least 3 characters).",
      });
      return;
    }

    const users = await User.find({
      username: { $regex: new RegExp(username, "i") },
    })
      .select("username firstname lastname email level")
      .limit(10);

    res.status(200).json({
      success: true,
      users,
    });
    return;
  } catch (error) {
    console.error("User search error:", error);
    next(error);
  }
};

export const userNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id;
    const invitations = await Invitations.find({ inviteTo: userId })
      .populate("groupId", "groupName")
      .populate("inviteBy", "username firstname lastname");
    const settlements = await Settlements.find({
      paidTo: userId,
      status: "pending",
    })
      .populate("groupId", "groupName")
      .populate("paidBy", "username firstname lastname")
      .populate("paidTo", "username firstname lastname");

    res.status(200).json({
      success: true,
      invitations,
      settlements,
    });
  } catch (error) {
    console.error("User search error:", error);
    next(error);
  }
};

export const inviteAction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all([
      body("invitationId")
        .isMongoId()
        .notEmpty()
        .withMessage("Invitation Id is required")
        .run(req),
      body("status")
        .isIn(["accept", "reject"])
        .withMessage("Status is required")
        .run(req),
      body("groupId")
        .isMongoId()
        .notEmpty()
        .withMessage("Group Id is required")
        .run(req),
    ]);

    // Check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: errors.array(),
      });
      return;
    }
    const userId = req.user._id;
    const { invitationId, groupId, status } = req.body;
    if (status === "accept") {
      const group = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true }
      );
      if (!group) {
        res.status(404).json({
          success: false,
          message: "Group not found.",
        });
        return;
      }
    }
    await Invitations.findByIdAndDelete(invitationId);
    res.status(200).json({
      success: true,
      message:
        status === "accept" ? "User added to group" : "Invitation rejected",
    });
  } catch (error) {
    console.error("User search error:", error);
    next(error);
  }
};
