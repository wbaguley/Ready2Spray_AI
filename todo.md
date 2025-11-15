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

## Database Schema Migration
- [x] Check existing tables in Supabase
- [x] Run Drizzle migrations to create all missing tables (personnel, sites, equipment, job_statuses, jobs)
- [x] Verify all tables exist and queries work

## Remove Crop Specifics from Job Form
- [x] Remove entire "Crop Specifics" section from job creation form
- [x] Keep only Agricultural Details (state, crop, target pest, application rate/method, chemical product)
- [x] EPA compliance fields (REI, PHI, max applications, etc.) come only from linked products

## Remove Agricultural Details from Job Form
- [x] Remove "Agricultural Details" section (State, Commodity/Crop, Target Pest, Application Rate, Application Method, Chemical Product, EPA Number)
- [x] Job form only has: Basic Info (title, description, customer, site, personnel, equipment, dates, location)
- [x] All agricultural/EPA data comes from linked products

## Fix Jobs Table Schema Mismatch
- [x] Add missing agricultural/EPA columns to jobs table (state, commodity_crop, target_pest, epa_number, application_rate, application_method, chemical_product, re_entry_interval, preharvest_interval, max_applications_per_season, max_rate_per_season, methods_allowed, rate, diluent_aerial, diluent_ground, diluent_chemigation, generic_conditions)
- [x] Test job creation works after adding columns

## URGENT: Fix Job Creation - Remove Agricultural Fields from INSERT
- [x] Update backend job creation to NOT insert agricultural/EPA fields (those come from linked products)
- [x] Update frontend to not send agricultural/EPA fields during job creation
- [x] Only insert: title, description, job_type, priority, customer_id, site_id, assigned_personnel_id, equipment_id, location_address, scheduled_start, scheduled_end, notes
- [x] Test job creation works

## CRITICAL: Job Creation Still Failing
- [ ] Check actual jobs table columns in Supabase database
- [ ] Identify mismatch between Drizzle schema and actual database
- [ ] Either update schema file to match database OR add missing columns to database
- [ ] Test job creation works with minimal data (title, job_type, priority only)

## Create New Job Mutation with Raw SQL
- [ ] Replace createJob function with raw SQL INSERT
- [ ] Only insert fields from the form: org_id, title, description, job_type, priority, status_id, customer_id, assigned_personnel_id, equipment_id, location_address, scheduled_start, scheduled_end
- [ ] Test job creation works with minimal fields


## Jobs V2 - Simplified Job Management System
- [x] Create jobs_v2 database table (id, org_id, title, description, created_at, updated_at)
- [x] Add database helper functions (createJobV2, getJobsV2ByOrgId)
- [x] Create jobsV2 tRPC router with create and list endpoints
- [x] Create JobsV2.tsx page with simple form (title + description)
- [x] Add job list view to JobsV2 page
- [x] Add "Jobs V2" to sidebar navigation
- [x] Test creating and viewing jobs in Jobs V2
- [x] Verify Jobs V2 works independently from legacy Jobs page


## Jobs V2 - Job Detail View with Product Linking
- [x] Add product_id column to jobs_v2 table
- [x] Add getJobV2ById backend function
- [x] Add updateJobV2Product backend function to link products
- [x] Add jobsV2.getById and jobsV2.linkProduct tRPC endpoints
- [x] Create JobV2Detail.tsx page component
- [x] Add "Link Product" button on detail page
- [x] Display linked product EPA and agricultural details
- [x] Add /jobs-v2/:id route to App.tsx
- [x] Make job cards clickable to navigate to detail page
- [ ] Integrate ProductLookup component with Jobs V2
- [ ] Test complete workflow: create job → view → link product → see details


## Jobs V2 - ProductLookup Integration
- [x] Examine existing ProductLookup component interface and props
- [x] Update ProductLookup to accept jobV2Id parameter
- [x] Modify ProductLookup to call jobsV2.linkProduct when used with Jobs V2
- [x] Update JobV2Detail to navigate to ProductLookup page
- [x] Test: Click "Link Product" → Opens ProductLookup page
- [x] Test: Save product → Links to Jobs V2 job
- [x] Test: Product details display on job detail page after linking


## Bug Fix - AI Extraction Not Working
- [x] Investigate server error causing HTML response instead of JSON
- [x] Fix malformed import in server/db.ts causing esbuild errors
- [x] Restore correct PostgreSQL imports for Supabase connection
- [x] Restart server to apply fixes
- [ ] Test AI extraction with screenshot upload
- [ ] Verify extraction returns valid JSON data


## Jobs V2 - Add Comprehensive Form Fields
- [x] Add job_type, priority, status columns to jobs_v2 table
- [x] Add customer_id, personnel_id, equipment_id foreign keys to jobs_v2
- [x] Add location, scheduled_start, scheduled_end columns to jobs_v2
- [x] Update createJobV2 backend function to handle all new fields
- [x] Add backend functions to fetch customers, personnel, equipment for dropdowns
- [x] Update jobsV2.create tRPC endpoint with new field validation
- [x] Update JobsV2 create form with Job Type, Priority, Status dropdowns
- [x] Add Customer dropdown with existing customers
- [x] Add Assigned Personnel and Equipment dropdowns
- [x] Add Job Location text input
- [x] Add Scheduled Start and End datetime pickers
- [x] Update JobV2Detail page to display all new fields
- [ ] Test creating job with all fields populated


## Jobs V2 - Missing Features & Improvements
- [x] Add PPE Requirements display to job detail page (from linked product)
- [x] Add Safety & PPE Information section showing Label Signal Word and PPE text
- [x] Add Assignment & Scheduling section to job detail page
- [x] Display assigned personnel, equipment, location, scheduled dates on detail page
- [x] Implement Edit Job functionality with dialog form
- [x] Add "Edit Job" button to job detail page
- [x] Create edit job mutation in backend
- [ ] Test editing job updates all fields correctly


## Jobs V2 - Delete Functionality
- [x] Add deleteJobV2 function to backend (server/db.ts)
- [x] Add delete endpoint to jobsV2 tRPC router
- [x] Add Delete button to job detail page header
- [x] Create confirmation dialog for delete action
- [x] Navigate back to Jobs V2 list after successful deletion
- [ ] Test delete functionality end-to-end
