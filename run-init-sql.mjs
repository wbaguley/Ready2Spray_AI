import postgres from 'postgres';
import fs from 'fs';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

try {
  const initSQL = fs.readFileSync('init-database.sql', 'utf8');
  await sql.unsafe(initSQL);
  console.log('✓ Database initialized successfully!');
} catch (err) {
  console.error('✗ Error:', err.message);
  process.exit(1);
} finally {
  await sql.end();
}
