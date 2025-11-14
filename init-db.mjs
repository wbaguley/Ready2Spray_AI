import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle/schema.js';

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

// Import the schema
const { 
  users, organizations, customers, personnel, equipment,
  jobStatuses, jobs, jobStatusHistory, sites, zones,
  servicePlans, products, productsNew, productsComplete, productUse,
  applications, maintenanceTasks, maps,
  aiConversations, aiMessages, aiUsage,
  auditLogs,
  integrationConnections, integrationEntityMappings, integrationFieldMappings, integrationSyncLogs
} = schema;

console.log('Database schema imported successfully');
console.log('Tables defined:', Object.keys(schema).filter(k => k.endsWith('s') || k === 'users').length);

await client.end();
process.exit(0);
