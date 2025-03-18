// import { drizzle } from "drizzle-orm/node-postgres";

// export const db = drizzle(process.env.DB_CONNECTION_STRING!);

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Ensure DB connection string is available
if (!process.env.DB_CONNECTION_STRING) {
    throw new Error("Missing DB_CONNECTION_STRING in environment variables");
  }
// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

// Export the Drizzle ORM instance
export const db = drizzle(pool);
