import { defineConfig } from "drizzle-kit";

// Build Supabase pooler connection string
const password = process.env.R2S_Supabase;
if (!password) {
  throw new Error("R2S_Supabase password is required to run drizzle commands");
}

const connectionString = `postgresql://postgres.yqimcvatzaldidmqmvtr:${encodeURIComponent(password)}@aws-1-us-west-1.pooler.supabase.com:5432/postgres`;

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
