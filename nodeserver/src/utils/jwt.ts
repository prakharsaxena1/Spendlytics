import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import env from "../config/env";

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

export const generateToken = (user: IUser) =>
  jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);
