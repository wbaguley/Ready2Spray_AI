import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

const columns = await sql`
  SELECT column_name, data_type, is_nullable, column_default 
  FROM information_schema.columns 
  WHERE table_name = 'maps' 
  ORDER BY ordinal_position
`;

console.log('Maps table schema:');
console.log(JSON.stringify(columns, null, 2));

await sql.end();
