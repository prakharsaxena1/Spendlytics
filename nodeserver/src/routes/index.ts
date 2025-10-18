import express from 'express';
import authRoutes from "./auth";
import transactionRoutes from "./transaction";
import userRoutes from './users';
import groupRoutes from './group';
import dashboardRoutes from './dashboard';
const router = express.Router();

router.use('/api/auth', authRoutes);
router.use("/api/users", userRoutes);
router.use('/api/transaction', transactionRoutes);
router.use("/api/dashboard", dashboardRoutes);
router.use("/api/group", groupRoutes);

export default router;
