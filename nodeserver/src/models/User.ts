import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export type UserType = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  totalBalance: number;
  password: string;
  avatar: string;
  level: number;
  hasProvidedStartingBalance: boolean;
};

export interface IUser extends UserType, Document {
  matchPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    totalBalance: { type: Number, default: 0 },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    level: { type: Number, default: 1 },
    hasProvidedStartingBalance: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Password hashing middleware
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
UserSchema.methods.matchPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
