import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";
import { Invitations } from "../models/Invitations";
import { Group } from "../models/Group";
import { body, query, validationResult } from "express-validator";
import { Settlements } from "../models/Settlements";

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all([
      query("username")
        .notEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("username of at least 3 characters is required")
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
    const username = req.query.username as string;
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
      .populate("group", "groupName")
      .populate("inviteBy", "username firstname lastname");
    const settlements = await Settlements.find({
      paidTo: userId,
      status: "pending",
    })
      .populate("group", "groupName")
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
        .withMessage("Invitation Id is required")
        .run(req),
      body("status")
        .isIn(["accept", "reject"])
        .withMessage("Appropriate status is required")
        .run(req),
      body("groupId").isMongoId().withMessage("Group Id is required").run(req),
    ]);
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: errors.array(),
      });
      return;
    }
    const userId = req.user._id as string;
    const { invitationId, groupId, status } = req.body;
    // Verify that the invitation exists and belongs to this user
    const invitation = await Invitations.findById(invitationId);
    if (!invitation) {
      res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
      return;
    }
    if (!invitation.inviteTo.equals(userId)) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to act on this invitation",
      });
      return;
    }
    // Process accept/reject
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
    console.error("Invite action error:", error);
    next(error);
  }
};

export const updateSettings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all([
      body("theme")
        .notEmpty()
        .isString()
        .withMessage("theme is required")
        .run(req),
      body("accentColor")
        .notEmpty()
        .isString()
        .withMessage("Accent color is required")
        .run(req),
      body("fontFamily")
        .notEmpty()
        .isString()
        .withMessage("Font family is required")
        .run(req),
      body("animationsEnabled")
        .isBoolean()
        .withMessage("Propery value is invalid")
        .run(req),
      body("iconPack")
        .isIn(["rounded", "square"])
        .withMessage("Appropriate status is required")
        .run(req),
    ]);
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: errors.array(),
      });
      return;
    }

    const userId = req.user._id as string;
    const { theme, accentColor, fontFamily, animationsEnabled, iconPack } =
      req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        appearanceSettings: {
          theme,
          accentColor,
          fontFamily,
          animationsEnabled,
          iconPack,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      user,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    next(error);
  }
};
