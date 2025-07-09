import express from 'express';
import authRoutes from "./auth";
import transactionRoutes from "./transaction";
import userRoutes from './users';
const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/transaction', transactionRoutes);
router.use("/api/users", userRoutes);

export default router;
