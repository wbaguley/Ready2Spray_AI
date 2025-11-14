-- ============================================================================
-- Ready2Spray AI - Complete Database Setup Script
-- ============================================================================
-- Run this script in your Supabase SQL Editor to set up all required tables
-- This script is idempotent - it can be run multiple times safely
-- ============================================================================

-- Create users table (extends Manus OAuth users)
CREATE TABLE IF NOT EXISTS users (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "openId" varchar(64) NOT NULL UNIQUE,
  name text,
  email varchar(320),
  "loginMethod" varchar(64),
  role varchar(20) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin', 'manager', 'technician', 'pilot', 'sales')),
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "lastSignedIn" timestamp DEFAULT now() NOT NULL
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  owner_id integer NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(320),
  phone varchar(20),
  address text,
  city varchar(100),
  state varchar(50),
  zip_code varchar(20),
  subscription_plan varchar(20) DEFAULT 'FREE' CHECK (subscription_plan IN ('FREE', 'BASIC', 'PRO', 'ENTERPRISE')),
  subscription_status varchar(20) DEFAULT 'active',
  trial_ends_at timestamp,
  subscription_starts_at timestamp,
  subscription_ends_at timestamp,
  stripe_customer_id varchar(255),
  stripe_subscription_id varchar(255),
  logo_url text,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  name text NOT NULL,
  email varchar(320),
  phone varchar(20),
  address text,
  city varchar(100),
  state varchar(50),
  zip_code varchar(20),
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create personnel table
CREATE TABLE IF NOT EXISTS personnel (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(320),
  phone varchar(20),
  role varchar(50),
  license_number varchar(100),
  license_expiry timestamp,
  status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'inactive')),
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  name varchar(255) NOT NULL,
  equipment_type varchar(100),
  registration_number varchar(100),
  capacity numeric(10, 2),
  capacity_unit varchar(20),
  manufacturer varchar(255),
  model varchar(255),
  year integer,
  serial_number varchar(100),
  purchase_date timestamp,
  last_service_date timestamp,
  next_service_due timestamp,
  status varchar(20) DEFAULT 'active',
  hours_operated numeric(10, 2),
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create job_statuses table
CREATE TABLE IF NOT EXISTS job_statuses (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  name varchar(100) NOT NULL,
  color varchar(20) NOT NULL,
  display_order integer DEFAULT 0,
  category varchar(50),
  is_default boolean DEFAULT false,
  is_system boolean DEFAULT false,
  description text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create sites table
CREATE TABLE IF NOT EXISTS sites (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  customer_id integer,
  name varchar(255) NOT NULL,
  site_type varchar(50) NOT NULL,
  address text,
  city varchar(100),
  state varchar(50),
  zip_code varchar(20),
  polygon json,
  center_lat numeric(10, 8),
  center_lng numeric(11, 8),
  acres numeric(10, 2),
  crop varchar(100),
  variety varchar(100),
  growth_stage varchar(50),
  sensitive_areas json,
  property_type varchar(50),
  units integer DEFAULT 1,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create zones table
CREATE TABLE IF NOT EXISTS zones (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  site_id integer NOT NULL,
  name varchar(255) NOT NULL,
  zone_type varchar(50),
  polygon json,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  customer_id integer,
  assigned_personnel_id integer,
  equipment_id integer,
  product_id integer,
  site_id integer,
  status_id integer,
  title text NOT NULL,
  description text,
  job_type varchar(50) NOT NULL DEFAULT 'crop_dusting',
  priority varchar(20) NOT NULL DEFAULT 'medium',
  location_address text,
  location_lat varchar(50),
  location_lng varchar(50),
  scheduled_start timestamp,
  scheduled_end timestamp,
  actual_start timestamp,
  actual_end timestamp,
  notes text,
  state varchar(100),
  acres numeric(10, 2),
  commodity_crop varchar(200),
  target_pest varchar(200),
  epa_number varchar(100),
  application_rate varchar(100),
  application_method varchar(100),
  chemical_product varchar(200),
  re_entry_interval varchar(100),
  preharvest_interval varchar(100),
  max_applications_per_season varchar(50),
  max_rate_per_season varchar(100),
  methods_allowed varchar(200),
  rate varchar(100),
  diluent_aerial varchar(100),
  diluent_ground varchar(100),
  diluent_chemigation varchar(100),
  generic_conditions text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create job_status_history table
CREATE TABLE IF NOT EXISTS job_status_history (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  job_id integer NOT NULL,
  from_status_id integer,
  to_status_id integer NOT NULL,
  changed_by_user_id integer NOT NULL,
  changed_at timestamp DEFAULT now() NOT NULL,
  notes text
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  name varchar(255) NOT NULL,
  epa_number varchar(50),
  manufacturer varchar(255),
  product_type varchar(50),
  unit_cost numeric(10, 2),
  unit varchar(20),
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create products_complete table (for AI-extracted product data)
CREATE TABLE IF NOT EXISTS products_complete (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  nickname varchar(255) NOT NULL,
  description text,
  epa_number varchar(50),
  manufacturer varchar(255),
  product_type varchar(50),
  chemical_type varchar(50),
  category varchar(100),
  status varchar(20) DEFAULT 'active',
  default_applied_input numeric(10, 4),
  default_unit_applied varchar(20),
  base_unit varchar(20),
  application_rate_per_acre numeric(10, 4),
  field_application_price numeric(10, 2),
  minimum_charge numeric(10, 2),
  commission varchar(50),
  commission_paid numeric(10, 4),
  extra_commission_percent numeric(5, 2),
  unit_cost numeric(10, 2),
  reorder_qty numeric(10, 4),
  vendors text,
  otc_chemical_sale_price numeric(10, 2),
  density_conversion_rate numeric(10, 6),
  density_unit_from varchar(20),
  density_unit_to varchar(20),
  is_restricted boolean DEFAULT false,
  dont_split_billing boolean DEFAULT false,
  is_inventory_item boolean DEFAULT false,
  is_discountable boolean DEFAULT false,
  show_on_job_schedule boolean DEFAULT false,
  is_diluent boolean DEFAULT false,
  apply_as_liquid boolean DEFAULT false,
  label_signal_word varchar(20),
  hours_reentry numeric(10, 2),
  days_preharvest numeric(10, 2),
  crop_overrides json,
  sensitive_crops json,
  reentry_ppe text,
  additional_restrictions text,
  active_ingredients text,
  extracted_from_screenshot boolean DEFAULT false,
  screenshot_url text,
  extraction_confidence numeric(3, 2),
  last_verified_at timestamp,
  last_verified_by integer,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  created_by integer
);

-- Create products_new table (simplified product structure)
CREATE TABLE IF NOT EXISTS products_new (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  name varchar(255) NOT NULL,
  epa_number varchar(50),
  manufacturer varchar(255),
  product_type varchar(50),
  active_ingredients text,
  signal_word varchar(20),
  reentry_interval_hours numeric(10, 2),
  preharvest_interval_days integer,
  application_rate varchar(100),
  target_pests text,
  approved_crops text,
  restricted_use boolean DEFAULT false,
  ppe_requirements text,
  storage_requirements text,
  disposal_requirements text,
  unit_cost numeric(10, 2),
  unit varchar(20),
  supplier varchar(255),
  notes text,
  label_url text,
  sds_url text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create product_use table
CREATE TABLE IF NOT EXISTS product_use (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  job_id integer,
  product_id integer,
  quantity_used numeric(10, 4),
  unit varchar(20),
  dilution_rate varchar(50),
  application_method varchar(100),
  acres_treated numeric(10, 2),
  weather_conditions text,
  wind_speed varchar(20),
  wind_direction varchar(20),
  temperature varchar(20),
  humidity varchar(20),
  applicator_id integer,
  equipment_id integer,
  start_time timestamp,
  end_time timestamp,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create service_plans table
CREATE TABLE IF NOT EXISTS service_plans (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  customer_id integer NOT NULL,
  site_id integer,
  name varchar(255) NOT NULL,
  description text,
  service_type varchar(50) NOT NULL,
  frequency varchar(50) NOT NULL,
  start_date timestamp NOT NULL,
  end_date timestamp,
  next_service_date timestamp,
  status varchar(20) DEFAULT 'active',
  price numeric(10, 2),
  billing_frequency varchar(50),
  auto_schedule boolean DEFAULT false,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  last_processed_at timestamp,
  processing_status varchar(50),
  processing_error text
);

-- Create applications table (spray application records)
CREATE TABLE IF NOT EXISTS applications (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  job_id integer,
  site_id integer,
  applicator_id integer,
  equipment_id integer,
  product_id integer,
  application_date timestamp NOT NULL,
  start_time timestamp,
  end_time timestamp,
  acres_treated numeric(10, 2),
  product_rate varchar(100),
  total_product_used numeric(10, 4),
  product_unit varchar(20),
  diluent_type varchar(100),
  diluent_amount numeric(10, 4),
  diluent_unit varchar(20),
  application_method varchar(100),
  target_pest varchar(200),
  crop varchar(100),
  growth_stage varchar(50),
  weather_temp varchar(20),
  weather_wind_speed varchar(20),
  weather_wind_direction varchar(20),
  weather_humidity varchar(20),
  weather_conditions text,
  reentry_date timestamp,
  preharvest_date timestamp,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create maintenance_tasks table
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  equipment_id integer NOT NULL,
  task_type varchar(100) NOT NULL,
  description text,
  scheduled_date timestamp,
  completed_date timestamp,
  status varchar(20) DEFAULT 'pending',
  cost numeric(10, 2),
  performed_by integer,
  vendor varchar(255),
  parts_replaced text,
  hours_at_service numeric(10, 2),
  next_service_hours numeric(10, 2),
  next_service_date timestamp,
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create maps table
CREATE TABLE IF NOT EXISTS maps (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  name varchar(255) NOT NULL,
  file_url text NOT NULL,
  file_key varchar(500) NOT NULL,
  file_type varchar(20) NOT NULL,
  description text,
  uploaded_by integer,
  metadata json,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer NOT NULL,
  organization_id integer NOT NULL,
  action varchar(50) NOT NULL,
  entity_type varchar(50) NOT NULL,
  entity_id integer NOT NULL,
  changes text,
  ip_address varchar(45),
  user_agent text,
  created_at timestamp DEFAULT now() NOT NULL,
  session_id varchar(255),
  metadata json
);

-- Create AI conversation tables
CREATE TABLE IF NOT EXISTS ai_conversations (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  user_id integer NOT NULL,
  title text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id integer NOT NULL,
  role varchar(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_usage (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  user_id integer NOT NULL,
  conversation_id integer,
  model varchar(100) NOT NULL,
  input_tokens integer NOT NULL,
  output_tokens integer NOT NULL,
  total_tokens integer NOT NULL,
  cost varchar(20),
  feature varchar(50),
  created_at timestamp DEFAULT now() NOT NULL
);

-- Create integration tables
CREATE TABLE IF NOT EXISTS integration_connections (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  provider varchar(50) NOT NULL,
  account_name varchar(255),
  api_key_encrypted text,
  api_secret_encrypted text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamp,
  status varchar(20) DEFAULT 'active',
  last_sync_at timestamp,
  sync_frequency varchar(50),
  auto_sync boolean DEFAULT false,
  config json,
  error_message text,
  error_count integer DEFAULT 0,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  created_by integer
);

CREATE TABLE IF NOT EXISTS integration_entity_mappings (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  connection_id integer NOT NULL,
  entity_type varchar(50) NOT NULL,
  local_id integer NOT NULL,
  remote_id varchar(255) NOT NULL,
  sync_direction varchar(20) DEFAULT 'bidirectional',
  last_synced_at timestamp,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS integration_field_mappings (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  connection_id integer NOT NULL,
  entity_type varchar(50) NOT NULL,
  local_field varchar(100) NOT NULL,
  remote_field varchar(100) NOT NULL,
  transform_function text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS integration_sync_logs (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  connection_id integer NOT NULL,
  sync_type varchar(50) NOT NULL,
  entity_type varchar(50),
  records_processed integer DEFAULT 0,
  records_succeeded integer DEFAULT 0,
  records_failed integer DEFAULT 0,
  started_at timestamp DEFAULT now() NOT NULL,
  completed_at timestamp,
  status varchar(20) DEFAULT 'running',
  error_message text,
  details json,
  triggered_by integer
);

-- ============================================================================
-- Insert default system data
-- ============================================================================

-- Insert default job statuses (only if they don't exist)
INSERT INTO job_statuses (org_id, name, color, display_order, category, is_default, is_system)
SELECT 0, 'Pending', '#FFA500', 1, 'pending', true, true
WHERE NOT EXISTS (SELECT 1 FROM job_statuses WHERE name = 'Pending' AND is_system = true);

INSERT INTO job_statuses (org_id, name, color, display_order, category, is_default, is_system)
SELECT 0, 'In Progress', '#0000FF', 2, 'in_progress', false, true
WHERE NOT EXISTS (SELECT 1 FROM job_statuses WHERE name = 'In Progress' AND is_system = true);

INSERT INTO job_statuses (org_id, name, color, display_order, category, is_default, is_system)
SELECT 0, 'Completed', '#008000', 3, 'completed', false, true
WHERE NOT EXISTS (SELECT 1 FROM job_statuses WHERE name = 'Completed' AND is_system = true);

-- ============================================================================
-- Create indexes for better query performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_customers_org_id ON customers(org_id);
CREATE INDEX IF NOT EXISTS idx_personnel_org_id ON personnel(org_id);
CREATE INDEX IF NOT EXISTS idx_equipment_org_id ON equipment(org_id);
CREATE INDEX IF NOT EXISTS idx_jobs_org_id ON jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status_id ON jobs(status_id);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_start ON jobs(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_job_statuses_org_id ON job_statuses(org_id);
CREATE INDEX IF NOT EXISTS idx_sites_org_id ON sites(org_id);
CREATE INDEX IF NOT EXISTS idx_sites_customer_id ON sites(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_plans_org_id ON service_plans(org_id);
CREATE INDEX IF NOT EXISTS idx_service_plans_customer_id ON service_plans(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- Setup complete!
-- ============================================================================
-- You can now use the Ready2Spray AI application
-- ============================================================================
