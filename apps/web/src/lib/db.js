import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false } // Required for Neon DB
});

export default pool;
