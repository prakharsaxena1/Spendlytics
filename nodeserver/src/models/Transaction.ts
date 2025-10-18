import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  transactionType: "inflow" | "outflow";
  amount: number;
  transactionDate: Date;
  category: "needs" | "wants" | "savings" | "investments";
  note: string;
  userId: mongoose.Types.ObjectId;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionType: { type: String, enum: ['inflow', 'outflow'], required: true },
    amount: { type: Number, required: true, min: 0 },
    transactionDate: { type: Date, required: true },
    category: { type: String, enum: ["needs", "wants", "savings", "investments"], required: true },
    note: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
