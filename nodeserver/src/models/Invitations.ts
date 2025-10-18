import mongoose, { Schema, Document } from "mongoose";

export interface IInvitations extends Document {
  inviteBy: mongoose.Types.ObjectId;
  inviteTo: mongoose.Types.ObjectId;
  group: mongoose.Types.ObjectId;
}

const InvitationSchema = new Schema<IInvitations>(
  {
    inviteBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    inviteTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  },
  { timestamps: true }
);

export const Invitations = mongoose.model<IInvitations>(
  "Invitations",
  InvitationSchema
);
