import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { IUser, User } from "../models/User";
import { generateToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../middleware/auth";

const sanitizeUser = (user: IUser) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Promise.all([
      body("firstname")
        .notEmpty()
        .withMessage("Firstname is required")
        .run(req),
      body("lastname").notEmpty().withMessage("Lastname is required").run(req),
      body("username").notEmpty().withMessage("Username is required").run(req),
      body("email").isEmail().withMessage("Invalid email").run(req),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: "Invalid request", user: null });
      return;
    }
    const { firstname, lastname, username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({ message: "Email already registered", user: null });
      return;
    }
    // Create user
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password,
      username,
      avatar: "avatar1",
      totalBalance: 0,
      level: 1,
      role: "user",
    });
    // Generate token
    const token = generateToken(newUser);

    // Set HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(201).json({
      message: "User registered successfully",
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Promise.all([
      body("email").isEmail().withMessage("Invalid email").run(req),
      body("password").isLength({ min: 8 }).run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: "Invalid request", user: null });
      return;
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      res.status(401).json({
        message: "Invalid credentials",
        user: null,
      });
      return;
    }

    // Verify password
    const isMatch = await existingUser.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({
        message: "Invalid credentials",
        user: null,
      });
      return;
    }

    // Generate token
    const token = generateToken(existingUser);

    // Set HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({
      message: "User logged in successfully",
      user: sanitizeUser(existingUser),
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

export const getCurrentUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated", user: null });
      return;
    }
    res.status(200).json({ user: sanitizeUser(req.user) });
    return;
  } catch (error) {
    console.error("error getting user details:", error);
    next(error);
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful" });
};
