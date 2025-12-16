import { User, JobApplication, type IUser, type IJobApplication, type InsertJob, type UpdateJob } from "@shared/schema";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

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

export class MongoStorage implements IStorage {
  private addUserMethods(user: IUser): UserWithMethods {
    const hashedPassword = user.password;
    return {
      id: user._id.toString(),
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      comparePassword: async (candidatePassword: string) => {
        return bcrypt.compare(candidatePassword, hashedPassword);
      },
    };
  }

  private formatJob(job: IJobApplication): JobApplicationData {
    return {
      id: job._id.toString(),
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
    if (!Types.ObjectId.isValid(id)) return null;
    const user = await User.findById(id);
    return user ? this.addUserMethods(user) : null;
  }

  async getUserByUsername(username: string): Promise<UserWithMethods | null> {
    const user = await User.findOne({ username });
    return user ? this.addUserMethods(user) : null;
  }

  async createUser(username: string, password: string): Promise<UserWithMethods> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return this.addUserMethods(user);
  }

  async getJobsByUserId(userId: string): Promise<JobApplicationData[]> {
    if (!Types.ObjectId.isValid(userId)) return [];
    const jobs = await JobApplication.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
    return jobs.map(job => this.formatJob(job));
  }

  async getJobById(jobId: string, userId: string): Promise<JobApplicationData | null> {
    if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(userId)) return null;
    const job = await JobApplication.findOne({ 
      _id: new Types.ObjectId(jobId), 
      userId: new Types.ObjectId(userId) 
    });
    return job ? this.formatJob(job) : null;
  }

  async createJob(userId: string, jobData: InsertJob): Promise<JobApplicationData> {
    const job = await JobApplication.create({
      userId: new Types.ObjectId(userId),
      ...jobData,
    });
    return this.formatJob(job);
  }

  async updateJob(jobId: string, userId: string, updates: UpdateJob): Promise<JobApplicationData | null> {
    if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(userId)) return null;
    const job = await JobApplication.findOneAndUpdate(
      { _id: new Types.ObjectId(jobId), userId: new Types.ObjectId(userId) },
      { $set: updates },
      { new: true }
    );
    return job ? this.formatJob(job) : null;
  }

  async deleteJobs(jobIds: string[], userId: string): Promise<number> {
    if (!Types.ObjectId.isValid(userId)) return 0;
    const validJobIds = jobIds.filter(id => Types.ObjectId.isValid(id)).map(id => new Types.ObjectId(id));
    if (validJobIds.length === 0) return 0;
    
    const result = await JobApplication.deleteMany({
      _id: { $in: validJobIds },
      userId: new Types.ObjectId(userId)
    });
    return result.deletedCount;
  }
}

export const storage = new MongoStorage();
