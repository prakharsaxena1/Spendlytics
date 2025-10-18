import mongoose, { Schema, Document } from "mongoose";

export type GroupTransactionType = {
  amount: number;
  transactionDate: Date;
  note: string;
  paidBy: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  group: mongoose.Types.ObjectId;
  splitType: "percentage" | "value";
  splitDetails: {
    [userId: string]: number;
  };
}

export type IGroupTransaction = GroupTransactionType & Document

const GroupTransactionSchema = new Schema<IGroupTransaction>(
  {
    amount: { type: Number, required: true, min: 0 },
    transactionDate: { type: Date, required: true },
    note: { type: String, default: '' },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    splitType: { type: String, enum: ["percentage", "value"], default: "value" },
    splitDetails: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export const GroupTransaction = mongoose.model<IGroupTransaction>(
  "GroupTransaction",
  GroupTransactionSchema
);
