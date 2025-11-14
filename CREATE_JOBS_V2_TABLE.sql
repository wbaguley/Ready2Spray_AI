-- ============================================================================
-- Jobs V2 Table Creation Script
-- ============================================================================
-- Run this in your Supabase SQL Editor to create the jobs_v2 table
-- This is a simplified job management table with just title and description
-- ============================================================================

CREATE TABLE IF NOT EXISTS jobs_v2 (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  org_id integer NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_v2_org_id ON jobs_v2(org_id);
CREATE INDEX IF NOT EXISTS idx_jobs_v2_created_at ON jobs_v2(created_at);

-- ============================================================================
-- Table created successfully!
-- ============================================================================
-- You can now use the Jobs V2 page in the application
-- Navigate to Jobs V2 in the sidebar to start creating jobs
-- ============================================================================
