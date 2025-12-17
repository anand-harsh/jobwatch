import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// Use SUPABASE_DATABASE_URL if available, otherwise fall back to DATABASE_URL
const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
const replitUrl = process.env.DATABASE_URL;

// Determine which connection string to use
let connectionString: string;
let dbSource: string;

if (supabaseUrl) {
  connectionString = supabaseUrl;
  dbSource = "Supabase";
} else if (replitUrl) {
  connectionString = replitUrl;
  dbSource = "Replit";
} else {
  throw new Error("No database URL configured. Set SUPABASE_DATABASE_URL or DATABASE_URL.");
}

const pool = new pg.Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool);

export async function connectDB() {
  try {
    const client = await pool.connect();
    console.log(`Connected to PostgreSQL (${dbSource})`);
    client.release();
  } catch (error: any) {
    if (error.code === 'ENOTFOUND') {
      console.error(`Database connection failed: Cannot resolve hostname.`);
      console.error(`Please verify your ${dbSource === 'Supabase' ? 'SUPABASE_DATABASE_URL' : 'DATABASE_URL'} is correct.`);
      if (dbSource === 'Supabase') {
        console.error(`Tip: Check Supabase Dashboard > Settings > Database > Connection string`);
      }
    } else {
      console.error("PostgreSQL connection error:", error);
    }
    process.exit(1);
  }
}
