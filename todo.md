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


## Role-Based Access Control (RBAC) Implementation

### Phase 1: Permissions Matrix & Helper Functions
- [x] Define permissions matrix for all 5 roles
- [x] Create usePermissions hook for checking user permissions
- [x] Create permission helper functions (canView, canEdit, canDelete, canCreate)
- [ ] Test permission helpers work correctly

### Phase 2: Sidebar Navigation Restrictions
- [x] Filter sidebar menu items based on user role
- [x] Hide User Management from non-admin users
- [x] Hide Equipment Analytics from non-managers
- [x] Test sidebar displays correctly for each role

### Phase 3: Page-Level Access Control
- [x] Add role checks to protected pages
- [x] Create ProtectedRoute component for access control
- [x] Show permission denied messages where appropriate
- [ ] Disable action buttons for users without permissions (future enhancement)

### Phase 4: Testing & Validation
- [x] Test each role can access only their permitted features
- [x] Verify authentication still works after changes
- [ ] Test role changes update permissions immediately (requires admin access)
- [x] Confirm no unauthorized access is possible

### Phase 5: Delivery
- [ ] Save checkpoint with RBAC implementation
- [ ] Update GitHub repository
- [ ] Document role permissions for user reference
