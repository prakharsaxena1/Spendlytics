import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  groupName: string;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  totalExpense: number;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    groupName: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalExpense: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Group = mongoose.model<IGroup>(
  "Group",
  GroupSchema
);
