import postgres from 'postgres';

const supabasePassword = process.env.R2S_Supabase;
const connectionString = `postgresql://postgres.yqimcvatzaldidmqmvtr:${encodeURIComponent(supabasePassword)}@aws-1-us-west-1.pooler.supabase.com:5432/postgres`;

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
});

try {
  console.log('Adding missing columns to maps table...');
  
  // Add job_id column
  await sql`
    ALTER TABLE maps 
    ADD COLUMN IF NOT EXISTS job_id INTEGER REFERENCES jobs_v2(id) ON DELETE CASCADE
  `;
  console.log('✓ Added job_id column');
  
  // Add file_size column
  await sql`
    ALTER TABLE maps 
    ADD COLUMN IF NOT EXISTS file_size INTEGER
  `;
  console.log('✓ Added file_size column');
  
  // Add uploaded_by column  
  await sql`
    ALTER TABLE maps 
    ADD COLUMN IF NOT EXISTS uploaded_by INTEGER REFERENCES users(id)
  `;
  console.log('✓ Added uploaded_by column');
  
  console.log('\n✅ All columns added successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await sql.end();
}
