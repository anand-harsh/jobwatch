import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const insertUserSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Job Application Table
export type JobStatus = 
  | "Applied" 
  | "Shortlisted" 
  | "Interview Scheduled" 
  | "Technical Interview" 
  | "Offer Received" 
  | "Rejected" 
  | "Withdrawn";

export type JobCategory = "Big Tech" | "Startup" | "Mid-Tier" | "Other";

export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull().references(() => users.id),
  company: varchar("company", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  dateApplied: varchar("date_applied", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Applied"),
  notes: text("notes").default("").notNull(),
  category: varchar("category", { length: 50 }).notNull().default("Other"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

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
