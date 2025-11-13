import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { auditLogs } from './drizzle/schema.ts';

const connectionString = process.env.R2S_Supabase;
const client = postgres(connectionString, { ssl: { rejectUnauthorized: false } });
const db = drizzle(client);

try {
  const result = await client`SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'audit_logs'
  )`;
  console.log('Audit logs table exists:', result[0].exists);
} catch (error) {
  console.error('Error:', error.message);
}

await client.end();
