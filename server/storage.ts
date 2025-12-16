import { User, type IUser } from "@shared/schema";
import bcrypt from "bcryptjs";

export interface UserWithMethods {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IStorage {
  getUser(id: string): Promise<UserWithMethods | null>;
  getUserByUsername(username: string): Promise<UserWithMethods | null>;
  createUser(username: string, password: string): Promise<UserWithMethods>;
}

export class MongoStorage implements IStorage {
  private addMethods(user: IUser): UserWithMethods {
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

  async getUser(id: string): Promise<UserWithMethods | null> {
    const user = await User.findById(id);
    return user ? this.addMethods(user) : null;
  }

  async getUserByUsername(username: string): Promise<UserWithMethods | null> {
    const user = await User.findOne({ username });
    return user ? this.addMethods(user) : null;
  }

  async createUser(username: string, password: string): Promise<UserWithMethods> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return this.addMethods(user);
  }
}

export const storage = new MongoStorage();
