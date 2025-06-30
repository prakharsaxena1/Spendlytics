import mongoose, { Schema, Document } from "mongoose";

export interface ISharedGroup extends Document {
  groupName: string;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  totalExpense: number;
  isSettled: boolean;
  lastSettledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SharedGroupSchema = new Schema<ISharedGroup>(
  {
    groupName: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalExpense: { type: Number, default: 0 },
    isSettled: { type: Boolean, default: false },
    lastSettledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const SharedGroup = mongoose.model<ISharedGroup>(
  "SharedGroup",
  SharedGroupSchema
);
