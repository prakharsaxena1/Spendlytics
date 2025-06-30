import express from 'express';
import authRoutes from "./auth";
import transactionRoutes from "./transaction";
const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/transaction', transactionRoutes);

export default router;
