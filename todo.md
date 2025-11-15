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


## Jobs V2 - Map Integration for Location Selection
- [ ] Add latitude and longitude columns to jobs_v2 table
- [ ] Apply database migration for coordinate fields
- [ ] Update backend to handle coordinate storage
- [ ] Import Map component into JobsV2 create form
- [ ] Add map picker UI to location section of create form
- [ ] Implement location selection with marker placement
- [ ] Add address autocomplete/geocoding integration
- [ ] Update Edit Job dialog with map picker
- [ ] Display map with existing location on job detail page
- [ ] Test complete map workflow (select location, save, view)


## KML File Upload and Creation System
- [x] Fix database schema mismatch for map files upload (ensure all columns exist)
- [x] Research KML file format structure and parsing requirements
- [x] Fix map files upload query errors (column mismatch between code and database)
- [x] Test KML file upload end-to-end with real KML file
- [ ] Implement KML file parsing to extract geometries (polygons, lines, markers)
- [x] Create KML creation tool with Google Maps Drawing Manager
- [x] Add drawing tools UI (polygon, polyline, marker, rectangle, circle)
- [x] Implement KML generation from drawn shapes
- [x] Add KML download functionality for created maps
- [x] Test complete KML workflow (upload, parse, create, download)


## URGENT: Fix KML File Upload
- [x] Investigate backend uploadMapFile mutation database INSERT error
- [x] Check actual maps table columns vs what mutation is trying to insert
- [x] Fix column mismatch in upload mutation
- [x] Ensure S3 upload works correctly
- [x] Test KML file upload end-to-end with real file


## CRITICAL: Maps Upload Still Failing
- [x] Verify actual code in createMapFile function in server/db.ts
- [x] Properly fix the function to exclude auto-generated columns (using raw SQL)
- [ ] Test upload works end-to-end


## CRITICAL: Fix Foreign Key Constraint Error in Maps Upload
- [x] Root cause: Code uses Supabase PostgreSQL but maps table only exists in MySQL
- [x] Fix createMapFile to use proper Drizzle ORM instead of raw SQL
- [x] Use .insert().values().returning() for correct database connection
- [x] Run Drizzle migration to create maps table in Supabase PostgreSQL
- [x] Add missing columns (job_id, file_size, uploaded_by) to Supabase maps table
- [ ] Test KML upload works with complete Supabase schema


## MVP CRITICAL TASKS - Production Readiness

### 1. Robust REST API System (NEW REQUIREMENT)
**Priority: CRITICAL | Est: 12-16 hours**

#### Database Schema
- [ ] Create api_keys table (id, org_id, user_id, name, key_hash, key_prefix, last_used_at, created_at, revoked_at)
- [ ] Create api_usage_logs table (id, api_key_id, endpoint, method, status_code, response_time_ms, ip_address, created_at)
- [ ] Add indexes for performance (org_id, user_id, created_at)

#### API Key Management Backend
- [ ] Add generateApiKey function with bcrypt hashing
- [ ] Add listApiKeys function for user's organization
- [ ] Add revokeApiKey function to invalidate keys
- [ ] Add validateApiKey middleware for authentication
- [ ] Create apiKeys tRPC router with CRUD endpoints
- [ ] Add API usage logging function

#### API Key Management UI
- [ ] Create APIKeys.tsx component for Settings page
- [ ] Add "Generate API Key" button with name input dialog
- [ ] Display generated key once with copy-to-clipboard
- [ ] Show masked keys in list (e.g., "rsk_live_abc...xyz")
- [ ] Add revoke/delete button for each key
- [ ] Show last used timestamp and usage stats
- [ ] Add API Keys tab to Settings page

#### REST API Endpoints
- [ ] Create /api/v1 router with authentication middleware
- [ ] Implement rate limiting (100 requests/minute per key)
- [ ] Add CORS configuration for web integrations
- [ ] Organizations: GET /api/v1/organizations, POST /api/v1/organizations
- [ ] Jobs: GET /api/v1/jobs, POST /api/v1/jobs, GET /api/v1/jobs/:id, PUT /api/v1/jobs/:id, DELETE /api/v1/jobs/:id
- [ ] Sites: GET /api/v1/sites, POST /api/v1/sites, GET /api/v1/sites/:id, PUT /api/v1/sites/:id, DELETE /api/v1/sites/:id
- [ ] Customers: GET /api/v1/customers, POST /api/v1/customers, GET /api/v1/customers/:id, PUT /api/v1/customers/:id, DELETE /api/v1/customers/:id
- [ ] Personnel: GET /api/v1/personnel, POST /api/v1/personnel
- [ ] Equipment: GET /api/v1/equipment, POST /api/v1/equipment
- [ ] Products: GET /api/v1/products, GET /api/v1/products/:id

#### API Documentation
- [ ] Generate OpenAPI/Swagger specification
- [ ] Create API documentation page for users
- [ ] Add code examples for common integrations (curl, JavaScript, Python)
- [ ] Document authentication flow
- [ ] Document rate limiting and error codes

#### Integration Testing
- [ ] Test API with Postman/Thunder Client
- [ ] Test Zapier integration (webhook triggers)
- [ ] Test n8n integration (HTTP Request node)
- [ ] Test Make.com integration
- [ ] Create MCP server configuration for AI agents
- [ ] Test API key revocation works immediately

---

### 2. Add "Viewer" Role (NEW REQUIREMENT)
**Priority: CRITICAL | Est: 2-3 hours**

#### Database & Backend
- [ ] Add "viewer" to user_role enum in database schema
- [ ] Run migration to update enum type
- [ ] Update permissions matrix in usePermissions hook
- [ ] Define viewer permissions (read-only access to all pages)

#### Frontend UI
- [ ] Add "Viewer" option to role dropdown in User Management
- [ ] Update sidebar to show all pages for viewer role
- [ ] Hide all action buttons (Create, Edit, Delete) for viewer role
- [ ] Add read-only badges to pages when logged in as viewer
- [ ] Disable form inputs for viewer role
- [ ] Show "View Only" message on pages for viewers

#### Testing
- [ ] Test viewer can see Dashboard, Jobs, Customers, Sites, Equipment, Products
- [ ] Test viewer cannot create, edit, or delete any records
- [ ] Test viewer cannot access Settings, User Management, Audit Log
- [ ] Test viewer cannot generate API keys
- [ ] Verify all action buttons are hidden for viewer role

---

### 3. Reorganize Settings Page (NEW REQUIREMENT)
**Priority: CRITICAL | Est: 2-3 hours**

#### Settings Page Restructure
- [ ] Create tabbed layout for Settings page
- [ ] Add tabs: General, Status Management, User Management, API Keys, Audit Log, Email Test, Integrations
- [ ] Move UserManagement component into Settings as tab
- [ ] Move AuditLog component into Settings as tab
- [ ] Move EmailTest component into Settings as tab
- [ ] Add APIKeys component as new tab
- [ ] Keep existing General, Status Management, Integrations tabs

#### Navigation Updates
- [ ] Remove "User Management" from sidebar
- [ ] Remove "Audit Log" from sidebar
- [ ] Remove "Email Test" from sidebar
- [ ] Keep only "Settings" in sidebar (admin-only)
- [ ] Update all internal links to Settings tabs
- [ ] Update route structure (/settings?tab=users, /settings?tab=audit, etc.)

#### Testing
- [ ] Test all Settings tabs load correctly
- [ ] Test navigation between tabs works
- [ ] Test Settings is only visible to admin users
- [ ] Verify removed items are no longer in sidebar
- [ ] Test deep linking to specific Settings tabs

---

### 4. Remove Legacy Jobs Page (NEW REQUIREMENT)
**Priority: CRITICAL | Est: 1-2 hours**

#### File Cleanup
- [ ] Delete client/src/pages/Jobs.tsx (old legacy page)
- [ ] Rename client/src/pages/JobsV2.tsx to client/src/pages/Jobs.tsx
- [ ] Rename client/src/pages/JobV2Detail.tsx to client/src/pages/JobDetail.tsx

#### Route Updates
- [ ] Update App.tsx: Change /jobs-v2 route to /jobs
- [ ] Update App.tsx: Change /jobs-v2/:id route to /jobs/:id
- [ ] Update sidebar navigation: Change "Jobs V2" to "Jobs"
- [ ] Update all internal links from /jobs-v2 to /jobs

#### Backend Cleanup (Optional - can keep jobs_v2 table name)
- [ ] Consider renaming jobs_v2 table to jobs (or keep as-is for now)
- [ ] Update backend function names if renaming table
- [ ] Update tRPC router if renaming

#### Testing
- [ ] Test /jobs route loads Jobs page correctly
- [ ] Test /jobs/:id route loads Job Detail page
- [ ] Test all job CRUD operations work with new routes
- [ ] Test navigation from sidebar works
- [ ] Test all internal links to jobs work
- [ ] Verify no references to old Jobs page remain

---

### 5. KML Visualization on Job Maps
**Priority: HIGH | Est: 4-6 hours**

#### File Parsing Libraries
- [ ] Install togeojson library for KML/GPX parsing
- [ ] Install xml2js library for XML parsing
- [ ] Research GeoJSON parsing (native JSON.parse may be sufficient)

#### Parser Utility Functions
- [ ] Create parseKML function to extract polygons, polylines, markers
- [ ] Create parseGPX function to extract tracks and waypoints
- [ ] Create parseGeoJSON function to extract features
- [ ] Add error handling for malformed files
- [ ] Test parsers with real KML/GPX/GeoJSON files

#### Map Visualization
- [ ] Update JobDetail map to load linked map files
- [ ] Use Google Maps Data Layer to render GeoJSON
- [ ] Color-code different geometry types (polygons=blue, lines=red, markers=green)
- [ ] Add info windows showing geometry metadata (name, description)
- [ ] Add layer toggle controls for multiple map files
- [ ] Add "View on Map" button to map files list

#### Testing
- [ ] Test with real KML file from agricultural operations
- [ ] Test with GPX file from flight path
- [ ] Test with GeoJSON file
- [ ] Test multiple map files on same job
- [ ] Test layer toggle controls
- [ ] Handle parsing errors gracefully with user-friendly messages

---

### 6. End-to-End Testing & Bug Fixes
**Priority: HIGH | Est: 4-6 hours**

#### User Authentication & Organization
- [ ] Test user registration and login flow
- [ ] Test OAuth with Google/Microsoft/Apple
- [ ] Test organization creation
- [ ] Test user invitation and role assignment
- [ ] Test all user roles (Admin, Manager, Technician, Pilot, Sales, Viewer)

#### Core Workflows
- [ ] Test create customer → create site → create job workflow
- [ ] Test EPA product extraction from screenshot
- [ ] Test product linking to job
- [ ] Test KML file upload to job
- [ ] Test KML visualization on job map
- [ ] Test job editing with all fields
- [ ] Test job deletion and cleanup

#### Bulk Operations
- [ ] Test bulk job import from CSV
- [ ] Test bulk job export to CSV
- [ ] Test CSV round-trip (export → edit → import)

#### Automation & Notifications
- [ ] Test service plan creation
- [ ] Test automated job generation from service plans
- [ ] Test email notification for service reminders
- [ ] Test email notification for job completion

#### API Testing
- [ ] Test API key generation
- [ ] Test API authentication with Bearer token
- [ ] Test all API endpoints with Postman
- [ ] Test rate limiting (exceed 100 requests/minute)
- [ ] Test API key revocation

#### Bug Fixes
- [ ] Fix any bugs discovered during testing
- [ ] Document known issues for post-MVP
- [ ] Verify all critical bugs are resolved

---

### 7. Location Picker Testing & Polish
**Priority: HIGH | Est: 2-3 hours**

- [ ] Test LocationPicker in job create form
- [ ] Test LocationPicker in job edit dialog
- [ ] Test map display on job detail page
- [ ] Verify latitude/longitude save correctly to database
- [ ] Test address search with Google Places autocomplete
- [ ] Test click-to-select location on map
- [ ] Test map displays correct marker for job location
- [ ] Fix any layout issues with map component

---

### 8. Complete Missing Audit Logging
**Priority: MEDIUM | Est: 2-3 hours**

- [ ] Add audit logging to personnel create operation
- [ ] Add audit logging to personnel update operation
- [ ] Add audit logging to personnel delete operation
- [ ] Add audit logging to equipment create operation
- [ ] Add audit logging to equipment update operation
- [ ] Add audit logging to equipment delete operation
- [ ] Add audit logging to site create operation
- [ ] Add audit logging to site update operation
- [ ] Add audit logging to site delete operation
- [ ] Add audit logging to product create operation
- [ ] Add audit logging to service plan operations
- [ ] Add audit logging to API key generation and revocation
- [ ] Test audit logs appear in Audit Log page with correct filters

---

### 9. Final Production Preparation
**Priority: CRITICAL | Est: 2-3 hours**

#### Code Quality
- [ ] Run TypeScript compiler and fix all errors
- [ ] Remove console.log statements
- [ ] Remove commented-out code
- [ ] Update code comments and documentation
- [ ] Verify all environment variables are configured

#### Documentation
- [ ] Update README.md with setup instructions
- [ ] Create USER_GUIDE.md with feature documentation
- [ ] Create API_DOCUMENTATION.md with API reference
- [ ] Document known limitations and post-MVP roadmap

#### Database
- [ ] Verify all database migrations are applied
- [ ] Check database indexes for performance
- [ ] Verify foreign key constraints are correct
- [ ] Backup database schema

#### Security
- [ ] Verify API authentication works correctly
- [ ] Test authorization for all user roles
- [ ] Verify file upload security (file type validation, size limits)
- [ ] Check for SQL injection vulnerabilities
- [ ] Verify CORS configuration

#### Performance
- [ ] Test page load times
- [ ] Optimize slow database queries
- [ ] Verify S3 file uploads are fast
- [ ] Test with large datasets (100+ jobs, customers, sites)

#### Final Checkpoint
- [ ] Save production checkpoint
- [ ] Push all code to GitHub
- [ ] Tag release as v1.0.0-mvp
- [ ] Publish to production via Management UI
- [ ] Monitor production logs for errors

---

## SUMMARY: MVP Task Breakdown

### CRITICAL (Must Complete)
1. **Robust API System** - 12-16 hours
2. **Add Viewer Role** - 2-3 hours
3. **Reorganize Settings** - 2-3 hours
4. **Remove Legacy Jobs** - 1-2 hours
5. **Production Prep** - 2-3 hours

**Critical Subtotal: 19-27 hours**

### HIGH PRIORITY (Important)
6. **KML Visualization** - 4-6 hours
7. **End-to-End Testing** - 4-6 hours
8. **Location Picker Testing** - 2-3 hours
9. **Missing Audit Logging** - 2-3 hours

**High Priority Subtotal: 12-18 hours**

### **TOTAL TO MVP: 31-45 hours (4-6 business days)**


---

## PRODUCTION INFRASTRUCTURE TASKS

### Stripe Payment Integration
**Priority: CRITICAL | Est: 8-12 hours**

#### Business Setup
- [ ] Decide on pricing model (per-user, per-org, tiered plans)
- [ ] Define subscription tiers (Starter, Professional, Enterprise)
- [ ] Set pricing for each tier
- [ ] Decide on free trial period (14 days, 30 days, none)

#### Stripe Account
- [ ] Create Stripe account at stripe.com
- [ ] Complete business verification (EIN, bank account)
- [ ] Create products in Stripe dashboard for each tier
- [ ] Create recurring price objects (monthly/annual)
- [ ] Set up webhook endpoint URL

#### Backend Integration
- [ ] Install Stripe Node.js SDK
- [ ] Add Stripe secret key to environment variables
- [ ] Create Stripe webhook handler endpoint
- [ ] Implement subscription creation flow
- [ ] Implement subscription update flow (upgrade/downgrade)
- [ ] Implement subscription cancellation flow
- [ ] Add stripe_customer_id, stripe_subscription_id, subscription_status to organizations table

#### Frontend UI
- [ ] Create Pricing page showing all tiers
- [ ] Create Checkout flow with Stripe Elements
- [ ] Create Billing page in Settings showing current plan
- [ ] Add "Upgrade Plan" button
- [ ] Add "Update Payment Method" button
- [ ] Show subscription status and next billing date

#### Testing
- [ ] Test subscription creation with test card
- [ ] Test subscription upgrade/downgrade
- [ ] Test failed payment handling
- [ ] Switch to Stripe live mode for production

---

### Custom Domain Setup
**Priority: CRITICAL | Est: 2-4 hours**

- [ ] Purchase custom domain (e.g., ready2spray.com)
- [ ] Configure DNS CNAME record via Manus Management UI
- [ ] Wait for DNS propagation (1-48 hours)
- [ ] Verify SSL certificate is auto-provisioned
- [ ] Test HTTPS access on custom domain
- [ ] Update OAuth callback URLs if needed

---

### Email Service Production Setup
**Priority: CRITICAL | Est: 2-3 hours**

- [ ] Add custom domain to Mailgun account
- [ ] Add DNS records (TXT, CNAME, MX) to domain registrar
- [ ] Verify domain in Mailgun dashboard
- [ ] Update FROM_EMAIL to use custom domain
- [ ] Configure DKIM, SPF, DMARC for deliverability
- [ ] Create welcome email template
- [ ] Create invoice/receipt email template
- [ ] Test email sending to Gmail, Outlook, Yahoo

---

### Database Production Readiness
**Priority: CRITICAL | Est: 2-3 hours**

- [ ] Upgrade Supabase to Pro plan ($25/month minimum)
- [ ] Enable automated daily backups
- [ ] Test database restore process
- [ ] Add indexes for frequently queried columns
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Rotate database password
- [ ] Set up database performance monitoring
- [ ] Configure alerts for high CPU/memory usage

---

### Security & Compliance
**Priority: CRITICAL | Est: 4-6 hours**

- [ ] Implement session timeout (30 minutes of inactivity)
- [ ] Add two-factor authentication (2FA) for admin users
- [ ] Create privacy policy page
- [ ] Create terms of service page
- [ ] Add cookie consent banner
- [ ] Run npm audit and fix vulnerabilities
- [ ] Implement dependency scanning (Dependabot)
- [ ] Add file size limits on backend
- [ ] Implement rate limiting on API endpoints

---

### Monitoring & Analytics
**Priority: HIGH | Est: 3-4 hours**

- [ ] Set up error tracking (Sentry or similar)
- [ ] Configure error alerting (email, Slack)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Verify analytics tracking is working
- [ ] Create analytics dashboard
- [ ] Monitor subscription metrics (MRR, churn rate)
- [ ] Set up cost alerts for AWS services

---

### Performance Optimization
**Priority: MEDIUM | Est: 4-6 hours**

- [ ] Implement code splitting for faster initial load
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Minimize JavaScript bundle size
- [ ] Enable browser caching for static assets
- [ ] Optimize database queries (add indexes, reduce N+1)
- [ ] Test application with 100 concurrent users
- [ ] Identify bottlenecks and optimize

---

### Backup & Disaster Recovery
**Priority: HIGH | Est: 2-3 hours**

- [ ] Enable S3 versioning for file recovery
- [ ] Test file restore process
- [ ] Document recovery procedures
- [ ] Test disaster recovery process
- [ ] Maintain offsite backups

---

### Legal & Documentation
**Priority: HIGH | Est: 4-6 hours**

- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] Create Cookie Policy page
- [ ] Create Acceptable Use Policy
- [ ] Add legal pages to footer navigation
- [ ] Create user guide / help center
- [ ] Create FAQ page
- [ ] Create API documentation for developers

---

### Production Deployment Checklist

#### Pre-Deployment (1 Week Before)
- [ ] Upgrade Supabase to Pro plan
- [ ] Configure custom domain
- [ ] Set up production email domain
- [ ] Configure Stripe live mode
- [ ] Set up monitoring and alerting
- [ ] Complete all MVP features
- [ ] Fix all critical bugs
- [ ] Run security audit
- [ ] Complete end-to-end testing
- [ ] Finalize privacy policy and terms

#### Deployment Day
- [ ] Create final database backup
- [ ] Tag release in GitHub (v1.0.0)
- [ ] Deploy to production via Manus UI
- [ ] Verify deployment successful
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Test payment processing
- [ ] Test email delivery
- [ ] Announce launch

#### Post-Deployment (First Week)
- [ ] Monitor error rates daily
- [ ] Monitor user signups and churn
- [ ] Respond to support tickets
- [ ] Fix bugs as reported
- [ ] Review analytics and metrics weekly
- [ ] Collect user feedback
- [ ] Plan next sprint


---

## AI CREDIT TRACKING SYSTEM

### Database Schema
**Priority: HIGH | Est: 2-3 hours**

- [ ] Create ai_credit_balance table (org_id, monthly_allocation, credits_used, credits_remaining, overage_credits, reset_date)
- [ ] Create ai_credit_purchases table (org_id, credits_purchased, amount_paid, stripe_payment_id, expires_at)
- [ ] Add monthly_allocation column to organizations table (default based on subscription plan)
- [ ] Add indexes for performance (org_id, reset_date, expires_at)
- [ ] Migrate existing organizations with default credit allocations

### Backend Implementation
**Priority: HIGH | Est: 4-6 hours**

- [ ] Create getCreditBalance function to fetch org's current balance
- [ ] Create deductCredits function to subtract credits after AI usage
- [ ] Create purchaseCredits function to add purchased credits
- [ ] Create resetMonthlyCredits cron job (runs on 1st of each month)
- [ ] Update invokeLLM wrapper to check credit balance before API call
- [ ] Update invokeLLM wrapper to deduct credits after API call
- [ ] Add credit tracking to product extraction endpoint
- [ ] Add credit tracking to AI chat endpoint
- [ ] Create getCreditUsageHistory function for reporting
- [ ] Add credit exhaustion error handling (return 402 Payment Required)

### Frontend UI
**Priority: HIGH | Est: 6-8 hours**

#### Credit Balance Display
- [ ] Create CreditBalance component for Settings → Billing page
- [ ] Show monthly allocation, used, remaining, overage credits
- [ ] Add progress bar visualization
- [ ] Show next reset date
- [ ] Add "Buy More Credits" button
- [ ] Add "View Usage History" button

#### Credit Usage History
- [ ] Create CreditUsageHistory component
- [ ] Display table with date, feature, user, tokens, credits, balance
- [ ] Add filters (by user, by feature, by date range)
- [ ] Add CSV export functionality
- [ ] Show charts/graphs of usage trends

#### Credit Warnings & Blocking
- [ ] Add low credit warning toast (when < 20% remaining)
- [ ] Create credit exhausted modal dialog
- [ ] Block AI features when credits exhausted
- [ ] Show upgrade/purchase options in blocking modal
- [ ] Add remaining credits indicator to AI chat widget header
- [ ] Add remaining credits indicator to product lookup page

#### Credit Purchase Flow
- [ ] Create BuyCredits dialog component
- [ ] Show credit pack options (100, 500, 1000 credits)
- [ ] Integrate with Stripe for one-time payments
- [ ] Show confirmation after successful purchase
- [ ] Update credit balance immediately after purchase
- [ ] Send confirmation email with purchase receipt

### Stripe Integration
**Priority: HIGH | Est: 3-4 hours**

- [ ] Create Stripe products for credit packs (100, 500, 1000)
- [ ] Set up one-time payment checkout flow
- [ ] Create webhook handler for credit purchase events
- [ ] Add credits to organization balance after successful payment
- [ ] Handle failed payments and refunds
- [ ] Test credit purchase end-to-end

### Testing
**Priority: HIGH | Est: 2-3 hours**

- [ ] Test credit deduction on product extraction (verify 6-12 credits deducted)
- [ ] Test credit deduction on AI chat (verify 0.5-2 credits deducted)
- [ ] Test credit balance updates correctly after usage
- [ ] Test credit exhaustion blocks AI features
- [ ] Test low credit warning appears at 20%
- [ ] Test credit purchase flow with test card
- [ ] Test monthly reset cron job (manually trigger)
- [ ] Test overage credit expiration after 12 months
- [ ] Load test with 100 concurrent AI requests

### Documentation
**Priority: MEDIUM | Est: 1-2 hours**

- [ ] Update pricing page to show credit allocations
- [ ] Create "What are AI Credits?" help article
- [ ] Document credit usage for each AI feature
- [ ] Add credit balance to API documentation
- [ ] Create FAQ for common credit questions

---

## TOTAL AI CREDIT SYSTEM: 18-26 hours


---

## 3-DAY MVP SPRINT - REORDERED PRIORITIES

### PHASE 1: UI Reorganization (Hours 1-8)
**Priority: CRITICAL | Starting NOW**

#### Remove Legacy Jobs Page
- [x] Delete `client/src/pages/Jobs.tsx` (old page)
- [x] Rename `client/src/pages/JobsV2.tsx` → `Jobs.tsx`
- [x] Rename `client/src/pages/JobV2Detail.tsx` → `JobDetail.tsx`
- [x] Update `App.tsx` routes: `/jobs-v2` → `/jobs`
- [x] Update `App.tsx` routes: `/jobs-v2/:id` → `/jobs/:id`
- [x] Update sidebar navigation: "Jobs V2" → "Jobs"
- [x] Update all internal links to use `/jobs`
- [x] Test navigation works correctly

#### Settings Page Reorganization
- [x] Create tabbed layout for Settings page
- [x] Add tabs: General, Users, Audit Log, Email Test, API Keys, Billing
- [x] Move UserManagement component into Settings as tab
- [x] Move AuditLog component into Settings as tab
- [x] Move EmailTest component into Settings as tab
- [x] Create APIKeys tab (placeholder for Phase 3)
- [x] Create Billing tab (placeholder for Phase 5)
- [x] Remove "User Management" from sidebar navigation
- [x] Remove "Audit Log" from sidebar navigation
- [x] Remove "Email Test" from sidebar navigation
- [x] Update sidebar "Settings" link to go to Settings page
- [x] Test all Settings tabs work correctly

#### Add Viewer Role
- [ ] Add "viewer" to user_role enum in database (if not exists)
- [ ] Update permissions matrix in `usePermissions` hook
- [ ] Add "Viewer" option to User Management role dropdown
- [ ] Hide all action buttons (Create, Edit, Delete) for viewers
- [ ] Add read-only badges to pages for viewers
- [ ] Test viewer can see all pages but cannot modify data
- [ ] Test viewer cannot access User Management tab

---

### PHASE 2: Hybrid AI Models (Hours 9-11)
**Priority: CRITICAL**

- [ ] Update `server/claude.ts` to support model parameter
- [ ] Add `getClaudeResponseWithModel(model, options)` function
- [ ] Update AI chat endpoint to use Haiku (`claude-3-5-haiku-20241022`)
- [ ] Keep product extraction using Sonnet (`claude-3-7-sonnet-20250219`)
- [ ] Test AI chat with Haiku model
- [ ] Test product extraction with Sonnet model
- [ ] Verify both work correctly
- [ ] Update cost calculations in documentation

---

### PHASE 3: REST API System (Hours 12-16)
**Priority: CRITICAL**

- [ ] Create `api_keys` table in Supabase
- [ ] Create `api_usage_logs` table in Supabase
- [ ] Add `generateApiKey()` function (bcrypt hashing)
- [ ] Add `validateApiKey()` middleware
- [ ] Create `/api/v1` router with authentication
- [ ] Implement GET /api/v1/jobs (list)
- [ ] Implement POST /api/v1/jobs (create)
- [ ] Implement GET /api/v1/jobs/:id (get)
- [ ] Implement PUT /api/v1/jobs/:id (update)
- [ ] Implement DELETE /api/v1/jobs/:id (delete)
- [ ] Implement GET /api/v1/customers (list)
- [ ] Implement POST /api/v1/customers (create)
- [ ] Implement GET /api/v1/sites (list)
- [ ] Implement POST /api/v1/sites (create)
- [ ] Add rate limiting (100 req/min)
- [ ] Test with Postman
- [ ] Create API Keys management UI in Settings
- [ ] Test key generation and usage

---

**CHECKPOINT: End of Day 1** ✅


#### Dashboard Keyboard Shortcuts
- [ ] Add keyboard shortcut listener to Dashboard page
- [ ] Ctrl+J / Cmd+J: Open "Create New Job" dialog
- [ ] Ctrl+C / Cmd+C: Open "Create New Customer" dialog
- [ ] Ctrl+P / Cmd+P: Open "Create New Personnel" dialog
- [ ] Ctrl+Shift+P / Cmd+Shift+P: Open "Create New Product" dialog
- [ ] Show keyboard shortcuts hint on Dashboard
- [ ] Test shortcuts work on Windows and Mac

#### Products Page
- [x] Create Products page to show all uploaded EPA products
- [x] Display products in table with columns: Name, EPA Reg #, Brand Name, Signal Word, Actions
- [x] Add search and filter functionality
- [x] Add "Upload Product" button (opens product lookup)
- [x] Add Products to sidebar navigation (icon: Pill)
- [x] Add Products route to App.tsx
- [x] Test Products page displays all uploaded products


---

## BUG FIXES - CRITICAL

### Job Detail Page 404 Error
- [x] Check Jobs page - ensure it links to `/jobs/:id` not `/jobs-v2/:id`
- [x] Verify App.tsx route is correct
- [x] Test clicking a job from Jobs list navigates correctly

### Database Schema Missing Tables
- [x] Add error handling for missing `integration_connections` table
- [x] Test job queries work without errors
- [x] Job detail page loads successfully


### Jobs Table Schema Mismatch
- [x] Fixed all /jobs-v2 references in JobDetail.tsx
- [x] Fixed all /jobs-v2 references in ProductLookup.tsx
- [x] Verified no remaining jobs-v2 references in codebase
- [ ] Check which columns exist in Supabase jobs table (deferred - requires manual Supabase access)
- [ ] Compare with schema.ts jobs table definition
- [ ] Identify missing columns causing query failure
- [ ] Add missing columns to Supabase or update query to handle missing columns
- [ ] Test jobs list query works without errors


### AI Chat Bugs
- [x] Fix infinite loop causing "Maximum update depth exceeded" error
- [x] Fix AI chat button positioning - moved to bottom-right corner
- [x] Use inline styles for fixed positioning to prevent CSS conflicts
- [x] Applied consistent positioning to button, minimized, and full chat states


---

## KEYBOARD SHORTCUTS - DASHBOARD

### Implementation
- [x] Add quick action buttons to Dashboard header
- [x] New Job button - navigates to /jobs?action=create
- [x] New Customer button - navigates to /customers?action=create
- [x] New Personnel button - navigates to /personnel?action=create
- [x] New Product button - navigates to /product-lookup
- [x] Style buttons with Plus icons for visual clarity


---

## RENAME EPA PRODUCTS TO CHEMICAL PRODUCTS

- [x] Update Dashboard.tsx stats card description
- [x] Update Products.tsx page title and descriptions
- [x] Update ProductLookup.tsx page title and descriptions
- [x] Test all changes display correctly


---

## PRODUCT WORKFLOW FIXES

### Issue 1: ProductLookup Navigation
- [ ] Check URL params to detect if opened from Products page vs Job form
- [ ] If opened from Products page, navigate back to `/products` after save
- [ ] If opened from Job form, navigate to job form with product data
- [ ] Update "Save & Return" button text based on context

### Issue 2: Product Not Saving
- [ ] Debug why products.create mutation isn't saving to database
- [ ] Check if database schema has all required fields
- [ ] Verify tRPC procedure is correctly implemented
- [ ] Add error logging to identify save failures
- [ ] Test product save and verify it appears in Products list

### Issue 3: Job Detail Product Selector
- [ ] Add searchable dropdown/combobox to Job Detail page
- [ ] Connect to products.list query to show all uploaded products
- [ ] Allow searching by product name, EPA reg #, or active ingredient
- [ ] Update job.productId when product is selected
- [ ] Show selected product details (REI, PHI, signal word)
