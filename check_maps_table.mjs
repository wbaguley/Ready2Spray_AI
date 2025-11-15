import postgres from 'postgres';

const supabasePassword = process.env.R2S_Supabase;
const connectionString = `postgresql://postgres.yqimcvatzaldidmqmvtr:${encodeURIComponent(supabasePassword)}@aws-1-us-west-1.pooler.supabase.com:5432/postgres`;

const sql = postgres(connectionString, { ssl: { rejectUnauthorized: false } });

try {
  const columns = await sql`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'maps' 
    ORDER BY ordinal_position
  `;
  console.log('Maps table columns:');
  console.log(JSON.stringify(columns, null, 2));
} catch (error) {
  console.error('Error:', error);
} finally {
  await sql.end();
}
