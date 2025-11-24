# Ready2Spray TODO

## Completed: Full Database Migration & OAuth Fix
- [x] Converted schema.ts from PostgreSQL to MySQL syntax (pgTable → mysqlTable, pgEnum → mysqlEnum)
- [x] Fixed all 58 `.returning()` calls across server files to use MySQL-compatible patterns
- [x] Fixed enum usage patterns (removed function call syntax)
- [x] Fixed drizzle initialization to use mysql2 connection pool instead of single connection
- [x] Generated fresh migrations for all 33 tables
- [x] Created all 34 database tables (33 application tables + migrations table)
- [x] Added missing columns to users table (user_role, phone, license_number, commission)
- [x] Fixed ECONNREFUSED error by using mysql.createPool() instead of mysql.createConnection()
- [x] Verified OAuth flow works end-to-end without errors

## Known Issues
- [ ] TypeScript errors in SharedJob.tsx (missing 'notes' property)
- [ ] TypeScript errors in server/routers.ts (statusId vs status)
- [ ] 45 total TypeScript errors need to be addressed

## Next Steps
- [ ] Fix TypeScript errors
- [ ] Test complete user registration and login flow
- [ ] Verify all dashboard pages load correctly
- [ ] Test job creation and management features

## Current Issues
- [x] Post-login redirect fails - dashboard queries return 500 errors
- [x] User automatically redirected to signup page after 12 seconds on dashboard
- [x] Database query errors for dashboard_v2, organizations, and other tables
- [x] Fixed DashboardLayout to show loading skeleton during subscription check
