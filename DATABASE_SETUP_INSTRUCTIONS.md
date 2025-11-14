# Database Setup Instructions for Ready2Spray AI

## Overview
The application's database tables need to be created manually due to migration conflicts. This is a one-time setup process.

## Steps to Set Up the Database

### 1. Access Your Database Management Interface

You need to access the Supabase SQL Editor or your database management tool:

**Option A: Using Manus Management UI**
1. Click on the "Database" tab in the right panel of the Manus interface
2. Look for the database connection settings (usually in the bottom-left corner)
3. Click on "Open in Supabase" or similar link to access the SQL editor

**Option B: Direct Supabase Access**
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor (usually in the left sidebar)
3. Click "New Query" to create a new SQL query

### 2. Run the Setup Script

1. Open the file `SETUP_DATABASE.sql` (located in the project root directory)
2. Copy the entire contents of the file
3. Paste it into the SQL Editor
4. Click "Run" or "Execute" to run the script

**Important Notes:**
- The script is idempotent (safe to run multiple times)
- It uses `CREATE TABLE IF NOT EXISTS` so it won't fail if tables already exist
- It will create all necessary tables and insert default job statuses
- The script should complete in 5-10 seconds

### 3. Verify the Setup

After running the script, verify that the tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- users
- organizations
- customers
- personnel
- equipment
- job_statuses
- jobs
- job_status_history
- sites
- zones
- products
- products_complete
- products_new
- product_use
- service_plans
- applications
- maintenance_tasks
- maps
- audit_logs
- ai_conversations
- ai_messages
- ai_usage
- integration_connections
- integration_entity_mappings
- integration_field_mappings
- integration_sync_logs

### 4. Verify Job Statuses

Check that the default job statuses were created:

```sql
SELECT * FROM job_statuses WHERE is_system = true;
```

You should see three default statuses:
- Pending (orange)
- In Progress (blue)
- Completed (green)

### 5. Test the Application

1. Refresh your Ready2Spray AI application
2. Navigate to the Dashboard - you should see the metrics loading correctly
3. Try creating a test job to verify everything works

## Troubleshooting

### Issue: "permission denied for table" error
**Solution:** Make sure you're logged in with admin/owner credentials in Supabase

### Issue: Tables already exist but application still shows errors
**Solution:** 
1. Check if the tables have the correct structure
2. Try running this query to see if jobs table exists:
   ```sql
   SELECT COUNT(*) FROM jobs;
   ```
3. If it returns an error, the table structure might be incorrect

### Issue: Cannot access Supabase SQL Editor
**Solution:**
1. Check the database connection info in the Manus Management UI
2. Contact support if you need help accessing your database

## Alternative: Using Database Management UI in Manus

If you have access to the Manus database management interface:

1. Go to the "Database" tab in the Management UI
2. Look for an "Execute SQL" or "Run Query" option
3. Paste the contents of `SETUP_DATABASE.sql`
4. Execute the query

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your database connection string is correct
3. Ensure you have the necessary permissions to create tables
4. Contact support with the specific error message you're seeing

## After Setup

Once the database is set up:
- The application should work normally
- You can create jobs, customers, personnel, and equipment
- All features should be functional
- Future updates will use proper migrations (this is a one-time manual setup)
