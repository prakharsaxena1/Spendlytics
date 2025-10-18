import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";

export const getAnalytics = (req: AuthenticatedRequest, res: Response) => {
  res.send("Analytics");
};
