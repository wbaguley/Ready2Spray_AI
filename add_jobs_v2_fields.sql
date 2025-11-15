-- Add new columns to jobs_v2 table
ALTER TABLE jobs_v2 
ADD COLUMN IF NOT EXISTS job_type job_type,
ADD COLUMN IF NOT EXISTS priority priority DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS status job_status DEFAULT 'pending' NOT NULL,
ADD COLUMN IF NOT EXISTS customer_id integer,
ADD COLUMN IF NOT EXISTS personnel_id integer,
ADD COLUMN IF NOT EXISTS equipment_id integer,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS scheduled_start timestamp,
ADD COLUMN IF NOT EXISTS scheduled_end timestamp;

-- Add indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_jobs_v2_customer_id ON jobs_v2(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_v2_personnel_id ON jobs_v2(personnel_id);
CREATE INDEX IF NOT EXISTS idx_jobs_v2_equipment_id ON jobs_v2(equipment_id);
CREATE INDEX IF NOT EXISTS idx_jobs_v2_status ON jobs_v2(status);
CREATE INDEX IF NOT EXISTS idx_jobs_v2_scheduled_start ON jobs_v2(scheduled_start);
