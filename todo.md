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


## Quick Action Shortcuts in Chat
- [x] Add quick action buttons to chat widget
- [x] Implement "Today's Schedule" shortcut
- [x] Implement "Weather Check" shortcut
- [x] Implement "Create New Job" shortcut
- [x] Add visual styling for quick action buttons
- [x] Test shortcuts populate chat input correctly

## Automatic Audit Logging
- [x] Add audit logging to job creation
- [x] Add audit logging to job updates
- [x] Add audit logging to job deletion
- [x] Add audit logging to customer CRUD operations
- [ ] Add audit logging to personnel CRUD operations
- [ ] Add audit logging to equipment CRUD operations
- [ ] Add audit logging to site CRUD operations
- [x] Capture IP address and user agent for audit logs
- [ ] Test audit logs are created automatically

## CSV Export for Bulk Import
- [x] Add "Export to CSV" button to Jobs page
- [x] Implement CSV export functionality with all job fields
- [x] Include related data (customer names, personnel names, etc.)
- [x] Format CSV to match bulk import template
- [x] Add download functionality
- [ ] Test exported CSV can be re-imported


## User Invitation and Manual User Creation
- [x] Add "Invite User" button to User Management page
- [x] Create manual user creation form with name, email, and role selection
- [x] Implement backend endpoint for creating users manually
- [x] Test user creation workflow


## Product Screenshot + AI Extraction Feature
- [x] Create products_complete database table schema with all required fields
- [x] Add screenshot upload button to Product Lookup dialog
- [x] Implement AI vision extraction backend (LLM with image input)
- [x] Create product review/edit form with extracted data
- [x] Add save functionality to store products in database
- [x] Integrate saved products with job form
- [x] Test complete workflow (screenshot → extract → save → use)


## Multi-Screenshot Capture Enhancement
- [x] Add "Capture Screenshot" button to Product Lookup window
- [x] Implement browser screenshot capture API using getDisplayMedia
- [x] Add screenshot preview gallery showing captured images (up to 3)
- [x] Support capturing 2-3 screenshots (for different tabs: General, Safety, Crop Specific)
- [x] Add "Extract from Screenshots" button to process multiple screenshots
- [x] Implement batch AI extraction that merges data from multiple screenshots
- [x] Test complete multi-capture workflow


## Multi-File Upload & Embedded Agrian Capture
- [x] Update file upload to accept multiple files (images + PDFs)
- [x] Support PNG, JPG, WebP, and PDF file formats
- [x] Show preview gallery for uploaded files with remove option
- [x] Embed Agrian Label Center in iframe on Product Lookup page
- [x] Add floating "Capture This Page" button overlay on iframe
- [x] Implement iframe screenshot capture using html2canvas
- [x] Support capturing multiple screenshots from iframe (different tabs)
- [x] Test both upload and iframe capture workflows


## Product Lookup Bug Fixes
- [x] Fix missing "Extract from Files" button after file upload
- [x] Remove Agrian iframe embedding (blocked by CORS)
- [x] Keep "Open Agrian" button to open in new window
- [x] Test complete upload → extract workflow

## Complete Product Workflow Integration
- [x] Implement backend API to save products to products_complete table
- [x] Update ProductLookup to save product and navigate back to job form
- [x] Pass product data from ProductLookup back to job form
- [x] Update job form to receive and display product data
- [x] Link saved product to job in database
- [x] Display product details on job view page
- [x] Test complete workflow: extract → save → return to job → view job

## Bug Fixes - Product Creation
- [x] Fix product creation error - missing org_id in INSERT query
- [x] Fix SQL parameter count mismatch (18 columns but 17 values)

## Bug Fixes - Product Data Flow
- [x] Fix product fields not being saved to database (created products_complete table)
- [x] Increase PPE textarea size for long text (8 rows, resizable)
- [x] Add EPA fields display to job creation form (green badge shows linked product)
- [x] Ensure extracted data flows through save → job form → job detail

## Bug - Database Type Mismatch
- [x] Fix Drizzle using Postgres syntax on MySQL database (created table in correct Postgres/Supabase database)

## Restructure Product Workflow
- [x] Remove Product Lookup button from job creation form
- [x] Add "Link Product" button to job detail view
- [x] Update ProductLookup to accept job_id parameter
- [x] After product save, update job with product_id
- [x] Test: Create job → View job → Link product → See EPA info
