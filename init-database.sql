-- Create all necessary tables for Ready2Spray AI

-- Organizations table
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
  subscription_plan varchar(20) DEFAULT 'FREE',
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

-- Customers table
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

-- Personnel table
CREATE TABLE IF NOT EXISTS personnel (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(320),
  phone varchar(20),
  role varchar(50),
  license_number varchar(100),
  license_expiry timestamp,
  status varchar(20) DEFAULT 'active',
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Equipment table
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
  notes text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Job Statuses table
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

-- Sites table
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

-- Jobs table
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

-- Job Status History table
CREATE TABLE IF NOT EXISTS job_status_history (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  job_id integer NOT NULL,
  from_status_id integer,
  to_status_id integer NOT NULL,
  changed_by_user_id integer NOT NULL,
  changed_at timestamp DEFAULT now() NOT NULL,
  notes text
);

-- Audit Logs table
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

-- AI Conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  user_id integer NOT NULL,
  title text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- AI Messages table
CREATE TABLE IF NOT EXISTS ai_messages (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id integer NOT NULL,
  role varchar(20) NOT NULL,
  content text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

-- AI Usage table
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

-- Products table
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

-- Service Plans table  
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

-- Insert default job statuses if they don't exist
INSERT INTO job_statuses (org_id, name, color, display_order, category, is_default, is_system)
SELECT 0, 'Pending', '#FFA500', 1, 'pending', true, true
WHERE NOT EXISTS (SELECT 1 FROM job_statuses WHERE name = 'Pending' AND is_system = true);

INSERT INTO job_statuses (org_id, name, color, display_order, category, is_default, is_system)
SELECT 0, 'In Progress', '#0000FF', 2, 'in_progress', false, true
WHERE NOT EXISTS (SELECT 1 FROM job_statuses WHERE name = 'In Progress' AND is_system = true);

INSERT INTO job_statuses (org_id, name, color, display_order, category, is_default, is_system)
SELECT 0, 'Completed', '#008000', 3, 'completed', false, true
WHERE NOT EXISTS (SELECT 1 FROM job_statuses WHERE name = 'Completed' AND is_system = true);
