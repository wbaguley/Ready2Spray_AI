import postgres from 'postgres';

const supabasePassword = process.env.R2S_Supabase;
const connectionString = `postgresql://postgres.yqimcvatzaldidmqmvtr:${encodeURIComponent(supabasePassword)}@aws-1-us-west-1.pooler.supabase.com:5432/postgres`;

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
});

try {
  const result = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'maps' AND table_schema = 'public'
    ORDER BY ordinal_position
  `;
  console.log('Maps table columns:', result);
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await sql.end();
}
