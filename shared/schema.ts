import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export const insertUserSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
