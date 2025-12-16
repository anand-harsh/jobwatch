import mongoose, { Schema, Document, Types } from "mongoose";
import { z } from "zod";

// User Schema
export interface IUser extends Document {
  _id: Types.ObjectId;
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

// Job Application Schema
export type JobStatus = 
  | "Applied" 
  | "Shortlisted" 
  | "Interview Scheduled" 
  | "Technical Interview" 
  | "Offer Received" 
  | "Rejected" 
  | "Withdrawn";

export type JobCategory = "Big Tech" | "Startup" | "Mid-Tier" | "Other";

export interface IJobApplication extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  company: string;
  role: string;
  dateApplied: string;
  status: JobStatus;
  notes: string;
  category: JobCategory;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    dateApplied: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Applied", "Shortlisted", "Interview Scheduled", "Technical Interview", "Offer Received", "Rejected", "Withdrawn"],
      default: "Applied"
    },
    notes: { type: String, default: "" },
    category: { 
      type: String, 
      enum: ["Big Tech", "Startup", "Mid-Tier", "Other"],
      default: "Other"
    },
  },
  { timestamps: true }
);

export const JobApplication = mongoose.models.JobApplication || mongoose.model<IJobApplication>("JobApplication", jobApplicationSchema);

export const insertJobSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  dateApplied: z.string(),
  status: z.enum(["Applied", "Shortlisted", "Interview Scheduled", "Technical Interview", "Offer Received", "Rejected", "Withdrawn"]).default("Applied"),
  notes: z.string().default(""),
  category: z.enum(["Big Tech", "Startup", "Mid-Tier", "Other"]).default("Other"),
});

export const updateJobSchema = z.object({
  company: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  dateApplied: z.string().optional(),
  status: z.enum(["Applied", "Shortlisted", "Interview Scheduled", "Technical Interview", "Offer Received", "Rejected", "Withdrawn"]).optional(),
  notes: z.string().optional(),
  category: z.enum(["Big Tech", "Startup", "Mid-Tier", "Other"]).optional(),
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
