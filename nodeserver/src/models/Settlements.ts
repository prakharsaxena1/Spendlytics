import mongoose, { Schema, Document } from "mongoose";

export interface ISettlements extends Document {
  group: mongoose.Types.ObjectId;
  paidBy: mongoose.Types.ObjectId;
  paidTo: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  note: string;
}

const SettlementsSchema = new Schema<ISettlements>(
  {
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paidTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "completed", "rejected"], default: 'pending' },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export const Settlements = mongoose.model<ISettlements>(
  "Settlements",
  SettlementsSchema
);
