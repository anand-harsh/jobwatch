import { User, UserDocument } from "./models/User";

export interface IStorage {
  getUser(id: string): Promise<UserDocument | null>;
  getUserByUsername(username: string): Promise<UserDocument | null>;
  createUser(username: string, password: string): Promise<UserDocument>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<UserDocument | null> {
    return User.findById(id);
  }

  async getUserByUsername(username: string): Promise<UserDocument | null> {
    return User.findOne({ username });
  }

  async createUser(username: string, password: string): Promise<UserDocument> {
    const user = new User({ username, password });
    await user.save();
    return user;
  }
}

export const storage = new MongoStorage();
