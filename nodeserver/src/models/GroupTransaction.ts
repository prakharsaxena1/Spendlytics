import mongoose, { Schema, Document } from "mongoose";

export type GroupTransactionType = {
  amount: number;
  transactionDate: Date;
  note: string;
  userId: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    splitType: { type: String, enum: ["percentage", "value"], default: "value" },
    splitDetails: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export const GroupTransaction = mongoose.model<IGroupTransaction>(
  "GroupTransaction",
  GroupTransactionSchema
);
