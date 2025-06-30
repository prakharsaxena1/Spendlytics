import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/User";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = verifyToken(token) as jwt.JwtPayload;
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ error: "Unauthorized - User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Unauthorized - Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
    next(error);
  }
};
