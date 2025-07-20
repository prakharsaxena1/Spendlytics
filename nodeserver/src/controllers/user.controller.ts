import { Request, Response } from "express";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";
import { Invitations } from "../models/Invitations";
import { SharedGroup } from "../models/SharedGroup";
import { body, validationResult } from "express-validator";

export const searchUsers = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};

export const userNotifications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user._id;
    const invitations = await Invitations.find({
      inviteTo: userId,
    })
      .populate("sharedGroupId", "groupName")
      .populate("inviteBy", "username firstname lastname");
    res.status(200).json({
      success: true,
      invitations,
    });
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const inviteAction = async (
  req: AuthenticatedRequest,
  res: Response
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
      body("sharedGroupId")
        .isMongoId()
        .notEmpty()
        .withMessage("SharedGroup Id is required")
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
    const userId = req.user._id;
    const { invitationId, sharedGroupId, status } = req.body;
    if (status === "accept") {
      const sharedGroup = await SharedGroup.findByIdAndUpdate(
        sharedGroupId,
        { $addToSet: { members: userId } },
        { new: true }
      );
      if (!sharedGroup) {
        res.status(404).json({
          success: false,
          message: "Shared group not found.",
        });
        return;
      }
    }
    await Invitations.findByIdAndDelete(invitationId);
    res.status(200).json({
      success: true,
      message:
        status === "accept"
          ? "User added to shared group"
          : "Invitation rejected",
    });
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
