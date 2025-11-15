import postgres from 'postgres';
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

console.log('🔄 Connecting to database...');
const sql = postgres(DATABASE_URL, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10
});

try {
  console.log('📖 Reading migration file...');
  const migration = readFileSync('/tmp/fresh_migration.sql', 'utf-8');
  
  // Split by statement breakpoint comments
  const statements = migration
    .split('--> statement-breakpoint')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  console.log(`📝 Found ${statements.length} SQL statements`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;
    
    try {
      await sql.unsafe(statement);
      successCount++;
      if (i % 10 === 0) {
        console.log(`✅ Progress: ${i}/${statements.length} statements executed`);
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        skipCount++;
      } else {
        console.error(`❌ Error in statement ${i}:`, error.message);
        console.error('Statement:', statement.substring(0, 100) + '...');
        errorCount++;
      }
    }
  }
  
  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 Migration completed successfully!');
  } else {
    console.log('\n⚠️  Migration completed with errors');
  }
  
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  await sql.end();
}
