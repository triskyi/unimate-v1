import { Pool } from 'pg';

// Create a new Pool instance with environment variables
const pool = new Pool({
  user: process.env.PG_USER,          // Your PostgreSQL user
  host: process.env.PG_HOST,          // The host (localhost or remote)
  database: process.env.PG_DATABASE,  // The database name
  password: process.env.PG_PASSWORD,  // The user's password
  port: Number(process.env.PG_PORT) || 5432, // Default PostgreSQL port (5432)
});

// Export the pool instance for database queries
export default pool;
