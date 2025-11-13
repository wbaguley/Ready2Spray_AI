# Ready2Spray AI - TODO

## User Management System (Incremental Implementation)

### Phase 1: Database Schema
- [x] Add user_role column to users table (admin, manager, technician, pilot, sales)
- [x] Test authentication after database change
- [x] Verify user can still log in and access dashboard

### Phase 2: Backend API
- [x] Add getUsersByOrg function to db.ts
- [x] Add updateUserRole function to db.ts
- [x] Create users router in routers.ts with list and updateRole endpoints
- [x] Test authentication after backend changes
- [x] Verify user can still log in and access dashboard

### Phase 3: Frontend UI
- [x] Create UserManagement.tsx page component
- [x] Add User Management route to App.tsx
- [x] Add User Management to sidebar navigation
- [x] Test User Management page loads correctly
- [x] Test authentication after UI changes
- [x] Verify user can still log in and access dash### Phase 4: Personnel Integration
- [x] Remove Personnel from main sidebar
- [x] Keep Personnel accessible via /personnel route
- [x] Test authentication after navigation changesFinal Testing & Delivery
- [ ] Test complete user management workflow
- [ ] Verify all roles can be assigned
- [ ] Confirm authentication works throughout
- [ ] Save checkpoint
- [ ] Update GitHub repository
