import express from 'express';
import authRoutes from "./auth";
import transactionRoutes from "./transaction";
import userRoutes from './users';
import sharedGroupRoutes from './sharedGroup';
const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/transaction', transactionRoutes);
router.use("/api/users", userRoutes);
router.use("/api/sharedgroup", sharedGroupRoutes);

export default router;
