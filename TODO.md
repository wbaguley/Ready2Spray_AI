# Ready2Spray TODO

## Completed: PostgreSQL to MySQL Migration
- [x] Converted schema.ts from PostgreSQL to MySQL syntax (pgTable → mysqlTable, pgEnum → mysqlEnum)
- [x] Fixed all 58 `.returning()` calls across server files to use MySQL-compatible patterns
- [x] Fixed enum usage patterns (removed function call syntax)
- [x] Fixed drizzle initialization to use mysql2 connection object instead of connection string
- [x] Generated fresh migrations for all 33 tables
- [x] Created all 34 database tables (33 schema tables + 1 migrations table)
- [x] Verified OAuth flow works without errors
- [x] Resolved "onDuplicateKeyUpdate is not a function" error

## Known Issues
- [ ] TypeScript errors in SharedJob.tsx (missing 'notes' property)
- [ ] TypeScript errors in server/routers.ts (statusId vs status)
- [ ] 45 total TypeScript errors need to be addressed

## Next Steps
- [ ] Fix TypeScript errors
- [ ] Test complete user registration and login flow
- [ ] Verify all dashboard pages load correctly
- [ ] Test job creation and management features
