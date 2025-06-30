import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  transactionType: "inflow" | "outflow";
  amount: number;
  transactionDate: Date;
  isShared: boolean;
  category: "needs" | "wants" | "savings" | "investments" | "debt";
  note: string;
  sharedGroupId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionType: { type: String, enum: ['inflow', 'outflow'], required: true },
    amount: { type: Number, required: true, min: 0 },
    transactionDate: { type: Date, required: true },
    isShared: { type: Boolean, default: false },
    category: { type: String, enum: ["needs", "wants", "savings", "investments", "debt"], required: true },
    note: { type: String, default: '' },
    sharedGroupId: { type: Schema.Types.ObjectId, ref: "SharedGroup", default: null },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
