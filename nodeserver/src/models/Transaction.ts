import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  transactionType: "inflow" | "outflow";
  amount: number;
  transactionDate: Date;
  category: "needs" | "wants" | "savings" | "investments" | "debt";
  note: string;
  userId: mongoose.Types.ObjectId;
  isShared: boolean;
  sharedGroupId: mongoose.Types.ObjectId;
  splitType: "percentage" | "value";
  splitDetails: {
    [userId: string]: number;
  };
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionType: { type: String, enum: ['inflow', 'outflow'], required: true },
    amount: { type: Number, required: true, min: 0 },
    transactionDate: { type: Date, required: true },
    category: { type: String, enum: ["needs", "wants", "savings", "investments", "debt"], required: true },
    note: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isShared: { type: Boolean, default: false },
    sharedGroupId: { type: Schema.Types.ObjectId, ref: "SharedGroup", default: null },
    splitType: { type: String, enum: ["percentage", "value"], default: "value" },
    splitDetails: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
