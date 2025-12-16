import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { z } from "zod";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
  }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not set");
}

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI!);
  isConnected = true;
}

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

interface UserWithMethods {
  id: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

function addMethods(user: any): UserWithMethods {
  return {
    id: user._id.toString(),
    username: user.username,
    password: user.password,
    comparePassword: async (candidatePassword: string) => {
      return bcrypt.compare(candidatePassword, user.password);
    },
  };
}

async function getUserByUsername(username: string): Promise<UserWithMethods | null> {
  await connectDB();
  const user = await User.findOne({ username });
  return user ? addMethods(user) : null;
}

async function createUser(username: string, password: string): Promise<UserWithMethods> {
  await connectDB();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashedPassword,
  });

  return addMethods(user);
}

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
    }

    const { username, password } = result.data;

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await createUser(username, password);

    req.session.userId = user.id;
    req.session.username = user.username;

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { username, password } = result.data;

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

app.get("/api/auth/me", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({
    user: { id: req.session.userId, username: req.session.username },
  });
});

app.get("/api/protected", requireAuth, (req: Request, res: Response) => {
  res.json({ message: "This is protected data", userId: req.session.userId });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
