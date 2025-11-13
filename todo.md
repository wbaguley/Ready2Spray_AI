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
- [x] Save checkpoint with RBAC implementation
- [x] Update GitHub repository
- [x] Document role permissions in code and system


## Admin Role & Dashboard Access Fix
- [x] Update Wyatt Baguley's user role to 'admin' in database
- [x] Remove Dashboard permission requirement (should be accessible to all roles)
- [x] Test admin can access all features including Settings and User Management
- [x] Verify Dashboard loads for all roles

## Simplify Permissions for Non-Admin Users
- [x] Update permissions matrix so all non-admin roles can access all features
- [x] Keep Settings and User Management restricted to admin only
- [x] Test that non-admin users can see all menu items except Settings and User Management


## Activity Audit Log System

### Phase 1: Database Schema
- [x] Create audit_logs table with fields: id, user_id, action, entity_type, entity_id, changes, ip_address, user_agent, timestamp
- [x] Add indexes for efficient querying (user_id, entity_type, timestamp)
- [x] Test database schema creation

### Phase 2: Backend Implementation
- [x] Create audit log database procedures (createAuditLog, getAuditLogs, getAuditLogsByEntity)
- [x] Add Zod validation schemas for audit log operations
- [x] Create auditLogs tRPC router with list and detail endpoints
- [ ] Add audit logging to all CRUD operations (jobs, customers, personnel, equipment, etc.)
- [ ] Test backend endpoints work correctly

### Phase 3: Frontend UI
- [x] Create AuditLog.tsx page component with filterable table
- [x] Add filters for user, action type, entity type, date range
- [x] Display changes in readable format (before/after comparison)
- [x] Add Audit Log to sidebar navigation
- [ ] Test UI displays audit logs correctly

## Bulk Job Import System

### Phase 1: Backend Implementation
- [x] Create CSV parsing utility function
- [x] Add bulkImportJobs tRPC mutation with validation
- [x] Handle customer/personnel/equipment lookup by name or ID
- [x] Generate detailed import report (success/failure counts, error messages)
- [x] Test backend import logic with sample CSV

### Phase 2: Frontend UI
- [x] Create BulkImportJobs component with file upload
- [x] Add CSV template download button
- [x] Display import preview before confirmation
- [x] Show import results with success/error details
- [x] Add Bulk Import button to Jobs page
- [ ] Test complete import workflow

## Floating AI Chat Widget

### Phase 1: Component Implementation
- [x] Create FloatingChatWidget component as quick-access button
- [x] Add tooltip for user guidance
- [x] Integrate with existing AI chat page
- [x] Add to DashboardLayout so it appears on all pages
- [x] Test widget works across all pages
- [x] Verify it doesn't show on chat page itself

### Phase 2: Context Awareness
- [ ] Pass current page context to AI chat
- [ ] Add user role context to chat
- [ ] Test AI responses are contextually relevant

## Final Testing & Delivery
- [ ] Test all three features work together
- [ ] Verify authentication remains stable
- [ ] Test on different screen sizes
- [ ] Save checkpoint
- [ ] Push to GitHub repository


## Bug Fixes and Improvements

### AI Chat Widget Enhancement
- [x] Convert floating chat button to popup modal dialog
- [x] Embed full chat functionality in the modal
- [x] Allow users to chat while viewing current page
- [x] Add close/minimize functionality to modal

### Navigation Fixes
- [x] Fix userRole assignment for owner in upsertUser
- [x] Ensure Settings menu item appears for admin users
- [x] Verify all menu items are visible and accessible


### AI Chat Modal Positioning
- [x] Position AI Chat modal in lower-right corner for desktop
- [x] Ensure modal stays anchored to bottom-right
- [x] Test responsive behavior on mobile


## AI Chat Widget Enhancements

### Minimize/Maximize Functionality
- [x] Add minimize button to collapse chat to header bar only
- [x] Add maximize button to expand chat back to full size
- [x] Maintain chat position in corner when minimized
- [x] Smooth transition animation between states

### Persistent Chat State
- [x] Save open/closed state to localStorage
- [x] Save minimized/maximized state to localStorage
- [x] Restore chat state on page load
- [x] Clear state on logout

### Unread Message Indicator
- [x] Track last read message timestamp
- [x] Count new AI responses since last read
- [x] Display badge with count on chat button
- [x] Clear badge when chat is opened
- [x] Persist unread count across page refreshes
