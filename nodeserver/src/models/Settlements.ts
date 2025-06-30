import mongoose, { Schema, Document } from "mongoose";

export interface ISettlements extends Document {
  sharedGroupId: mongoose.Types.ObjectId;
  paidBy: mongoose.Types.ObjectId;
  paidTo: mongoose.Types.ObjectId;
  amount: number;
}

const SettlementsSchema = new Schema<ISettlements>(
  {
    sharedGroupId: { type: Schema.Types.ObjectId, ref: "SharedGroup", required: true },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paidTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const Settlements = mongoose.model<ISettlements>(
  "Settlements",
  SettlementsSchema
);
