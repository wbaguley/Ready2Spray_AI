-- Create enums
DO $$ BEGIN
  CREATE TYPE audit_action AS ENUM('create', 'update', 'delete', 'login', 'logout', 'role_change', 'status_change', 'export', 'import', 'view');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE audit_entity_type AS ENUM('user', 'customer', 'personnel', 'job', 'site', 'equipment', 'product', 'service_plan', 'maintenance_task', 'organization', 'integration', 'job_status');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create table
CREATE TABLE IF NOT EXISTS audit_logs (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  organization_id integer NOT NULL REFERENCES organizations(id),
  user_id integer NOT NULL REFERENCES users(id),
  action audit_action NOT NULL,
  entity_type audit_entity_type NOT NULL,
  entity_id integer,
  entity_name varchar(255),
  changes json,
  ip_address varchar(45),
  user_agent text,
  metadata json,
  created_at timestamp DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
