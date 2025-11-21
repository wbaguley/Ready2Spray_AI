import postgres from 'postgres';
import fs from 'fs';

const connectionString = process.env.R2S_Supabase;
if (!connectionString) {
  console.error('R2S_Supabase environment variable not set');
  process.exit(1);
}

const sql = postgres(connectionString);

const migrationSQL = fs.readFileSync('./drizzle/0002_soft_prowler.sql', 'utf8');

try {
  await sql.unsafe(migrationSQL);
  console.log('Migration applied successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} finally {
  await sql.end();
}
