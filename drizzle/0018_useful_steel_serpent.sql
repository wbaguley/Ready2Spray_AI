ALTER TABLE "jobs_v2" ADD COLUMN "job_type" "job_type";--> statement-breakpoint
ALTER TABLE "jobs_v2" ADD COLUMN "priority" "priority" DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE "jobs_v2" ADD COLUMN "status" "job_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs_v2" ADD COLUMN "customer_id" integer;--> statement-breakpoint
ALTER TABLE "jobs_v2" ADD COLUMN "personnel_id" integer;--> statement-breakpoint
ALTER TABLE "jobs_v2" ADD COLUMN "equipment_id" integer;--> statement-breakpoint
ALTER TABLE "jobs_v2" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "jobs_v2" ADD COLUMN "scheduled_start" timestamp;--> statement-breakpoint
ALTER TABLE "jobs_v2" ADD COLUMN "scheduled_end" timestamp;