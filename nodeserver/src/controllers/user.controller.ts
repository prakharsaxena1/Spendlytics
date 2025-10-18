import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middleware/auth";
import { Invitations } from "../models/Invitations";
import { Group } from "../models/Group";
import { body, query, validationResult } from "express-validator";
import { Transaction } from "../models/Transaction";

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

    res.status(200).json({
      success: true,
      invitations,
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

export const updateStartingBalance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await Promise.all([
      body("balance")
        .isFloat({ min: 0 })
        .withMessage("Balance is required")
        .run(req),
      body("firstname")
        .isString()
        .notEmpty()
        .withMessage("First name is required")
        .run(req),
      body("lastname")
        .isString()
        .notEmpty()
        .withMessage("Fastn ame is required")
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
    const { balance, firstname, lastname } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        totalBalance: balance,
        firstname,
        lastname,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user,
    });
  } catch (error) {
    console.error("User update error:", error);
    next(error);
  }
};

export const getDashboardDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id as string;
    const allTransactions = await Transaction.find({ userId });

    // Initialize totals
    const totalByCategory: Record<string, number> = {
      savings: 0,
      wants: 0,
      investments: 0,
      needs: 0,
    };

    // Prepare month details map
    const monthMap: Record<
      string,
      Record<keyof typeof totalByCategory, number>
    > = {};

    // Month names for display
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    allTransactions.forEach((tx) => {
      const category = tx.category as keyof typeof totalByCategory;
      const amount = tx.amount || 0;

      if (totalByCategory[category] !== undefined) {
        totalByCategory[category] += amount;
      }

      const txDate = new Date(tx.transactionDate);
      const monthName = monthNames[txDate.getMonth()];

      if (!monthMap[monthName]) {
        monthMap[monthName] = {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
        };
      }

      if (monthMap[monthName][category] !== undefined) {
        monthMap[monthName][category] += amount;
      }
    });

    // Fix totals to 2 decimal places
    Object.keys(totalByCategory).forEach((key) => {
      totalByCategory[key] = parseFloat(totalByCategory[key].toFixed(2));
    });

    // Calculate total percentage
    const grandTotal = Object.values(totalByCategory).reduce(
      (sum, val) => sum + val,
      0
    );
    const totalPercentage = Object.fromEntries(
      Object.entries(totalByCategory).map(([cat, val]) => [
        cat,
        grandTotal > 0 ? parseFloat(((val / grandTotal) * 100).toFixed(2)) : 0,
      ])
    );

    // Convert monthMap to sorted array till current month
    const currentMonthIndex = new Date().getMonth();
    const monthDetails = monthNames
      .slice(0, currentMonthIndex + 1)
      .map((month) => {
        const detail = monthMap[month] || {
          savings: 0,
          wants: 0,
          investments: 0,
          needs: 0,
        };
        // Fix each category in month detail to 2 decimal places
        const fixedDetail = Object.fromEntries(
          Object.entries(detail).map(([cat, val]) => [
            cat,
            parseFloat(val.toFixed(2)),
          ])
        ) as typeof detail;

        return {
          ...fixedDetail,
          month: month.toLowerCase(),
        };
      });

    res.status(200).json({
      success: true,
      message: "Dashboard details fetched successfully",
      totalPercentage,
      monthDetails,
      totalByCategory,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    next(error);
  }
};
