import { db } from "./db";
import { users, type User } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface UserWithMethods extends User {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IStorage {
  getUser(id: string): Promise<UserWithMethods | null>;
  getUserByUsername(username: string): Promise<UserWithMethods | null>;
  createUser(username: string, password: string): Promise<UserWithMethods>;
}

export class PostgresStorage implements IStorage {
  private addMethods(user: User): UserWithMethods {
    return {
      ...user,
      comparePassword: async (candidatePassword: string) => {
        return bcrypt.compare(candidatePassword, user.password);
      },
    };
  }

  async getUser(id: string): Promise<UserWithMethods | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? this.addMethods(result[0]) : null;
  }

  async getUserByUsername(username: string): Promise<UserWithMethods | null> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? this.addMethods(result[0]) : null;
  }

  async createUser(username: string, password: string): Promise<UserWithMethods> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();

    return this.addMethods(result[0]);
  }
}

export const storage = new PostgresStorage();
