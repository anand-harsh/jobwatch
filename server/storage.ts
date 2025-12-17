import { users, jobApplications, type User, type JobApplication, type InsertJob, type UpdateJob } from "@shared/schema";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface UserWithMethods {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface JobApplicationData {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: string;
  notes: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  getUser(id: string): Promise<UserWithMethods | null>;
  getUserByUsername(username: string): Promise<UserWithMethods | null>;
  createUser(username: string, password: string): Promise<UserWithMethods>;
  
  getJobsByUserId(userId: string): Promise<JobApplicationData[]>;
  getJobById(jobId: string, userId: string): Promise<JobApplicationData | null>;
  createJob(userId: string, job: InsertJob): Promise<JobApplicationData>;
  updateJob(jobId: string, userId: string, updates: UpdateJob): Promise<JobApplicationData | null>;
  deleteJobs(jobIds: string[], userId: string): Promise<number>;
}

export class PostgresStorage implements IStorage {
  private addUserMethods(user: User): UserWithMethods {
    const hashedPassword = user.password;
    return {
      id: user.id.toString(),
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      comparePassword: async (candidatePassword: string) => {
        return bcrypt.compare(candidatePassword, hashedPassword);
      },
    };
  }

  private formatJob(job: JobApplication): JobApplicationData {
    return {
      id: job.id.toString(),
      company: job.company,
      role: job.role,
      dateApplied: job.dateApplied,
      status: job.status,
      notes: job.notes,
      category: job.category,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  async getUser(id: string): Promise<UserWithMethods | null> {
    const userId = parseInt(id);
    if (isNaN(userId)) return null;
    
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = result[0];
    return user ? this.addUserMethods(user) : null;
  }

  async getUserByUsername(username: string): Promise<UserWithMethods | null> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const user = result[0];
    return user ? this.addUserMethods(user) : null;
  }

  async createUser(username: string, password: string): Promise<UserWithMethods> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.insert(users).values({
      username,
      password: hashedPassword,
    }).returning();

    return this.addUserMethods(result[0]);
  }

  async getJobsByUserId(userId: string): Promise<JobApplicationData[]> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return [];
    
    const jobs = await db.select()
      .from(jobApplications)
      .where(eq(jobApplications.userId, userIdNum))
      .orderBy(desc(jobApplications.createdAt));
    
    return jobs.map(job => this.formatJob(job));
  }

  async getJobById(jobId: string, userId: string): Promise<JobApplicationData | null> {
    const jobIdNum = parseInt(jobId);
    const userIdNum = parseInt(userId);
    if (isNaN(jobIdNum) || isNaN(userIdNum)) return null;
    
    const result = await db.select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.id, jobIdNum),
          eq(jobApplications.userId, userIdNum)
        )
      )
      .limit(1);
    
    const job = result[0];
    return job ? this.formatJob(job) : null;
  }

  async createJob(userId: string, jobData: InsertJob): Promise<JobApplicationData> {
    const userIdNum = parseInt(userId);
    
    const result = await db.insert(jobApplications).values({
      userId: userIdNum,
      ...jobData,
    }).returning();
    
    return this.formatJob(result[0]);
  }

  async updateJob(jobId: string, userId: string, updates: UpdateJob): Promise<JobApplicationData | null> {
    const jobIdNum = parseInt(jobId);
    const userIdNum = parseInt(userId);
    if (isNaN(jobIdNum) || isNaN(userIdNum)) return null;
    
    const result = await db.update(jobApplications)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(jobApplications.id, jobIdNum),
          eq(jobApplications.userId, userIdNum)
        )
      )
      .returning();
    
    const job = result[0];
    return job ? this.formatJob(job) : null;
  }

  async deleteJobs(jobIds: string[], userId: string): Promise<number> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return 0;
    
    const validJobIds = jobIds
      .map(id => parseInt(id))
      .filter(id => !isNaN(id));
    
    if (validJobIds.length === 0) return 0;
    
    const result = await db.delete(jobApplications)
      .where(
        and(
          inArray(jobApplications.id, validJobIds),
          eq(jobApplications.userId, userIdNum)
        )
      );
    
    return result.rowCount ?? 0;
  }
}

export const storage = new PostgresStorage();
