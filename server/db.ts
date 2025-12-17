import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// Use SUPABASE_DATABASE_URL if available, otherwise fall back to DATABASE_URL
const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL environment variable is not set");
}

const pool = new pg.Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool);

export async function connectDB() {
  try {
    const client = await pool.connect();
    const dbType = process.env.SUPABASE_DATABASE_URL ? "Supabase" : "Replit";
    console.log(`Connected to PostgreSQL (${dbType})`);
    client.release();
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    process.exit(1);
  }
}
