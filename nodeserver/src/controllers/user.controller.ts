import { Request, Response } from "express";
import { User } from "../models/User";

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
