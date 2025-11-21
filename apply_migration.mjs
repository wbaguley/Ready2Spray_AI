import postgres from 'postgres';
import fs from 'fs';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10
});

try {
  const migrationSQL = fs.readFileSync('tables_only_clean.sql', 'utf8');
  
  console.log('Applying migration to Supabase...');
  console.log(`SQL length: ${migrationSQL.length} characters`);
  
  await sql.unsafe(migrationSQL);
  
  console.log('✅ Migration applied successfully!');
  console.log('All tables have been created in your Supabase database.');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error('Full error:', error);
  process.exit(1);
} finally {
  await sql.end();
}
