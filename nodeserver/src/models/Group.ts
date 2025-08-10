import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  unsettledAmount: number;
  groupName: string;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  totalExpense: number;
  isSettled: boolean;
  lastSettledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    unsettledAmount: { type: Number, required: true, default: 0 },
    groupName: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalExpense: { type: Number, required: true, default: 0 },
    isSettled: { type: Boolean, default: false },
    lastSettledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Group = mongoose.model<IGroup>(
  "Group",
  GroupSchema
);
