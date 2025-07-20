import mongoose, { Schema, Document } from "mongoose";

export interface IInvitations extends Document {
  inviteBy: mongoose.Types.ObjectId;
  inviteTo: mongoose.Types.ObjectId;
  sharedGroupId: mongoose.Types.ObjectId;
}

const InvitationSchema = new Schema<IInvitations>(
  {
    inviteBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    inviteTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sharedGroupId: { type: Schema.Types.ObjectId, ref: "SharedGroup", required: true },
  },
  { timestamps: true }
);

export const Invitations = mongoose.model<IInvitations>(
  "Invitations",
  InvitationSchema
);
