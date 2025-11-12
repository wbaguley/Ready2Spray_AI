CREATE TABLE `ai_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`user_id` int NOT NULL,
	`title` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversation_id` int NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`user_id` int NOT NULL,
	`conversation_id` int,
	`model` varchar(100) NOT NULL,
	`input_tokens` int NOT NULL,
	`output_tokens` int NOT NULL,
	`total_tokens` int NOT NULL,
	`cost` varchar(20),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zip_code` varchar(20),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`customer_id` int,
	`assigned_personnel_id` int,
	`title` text NOT NULL,
	`description` text,
	`job_type` enum('crop_dusting','pest_control','fertilization','herbicide') NOT NULL,
	`status` enum('pending','ready','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`location_address` text,
	`location_lat` varchar(50),
	`location_lng` varchar(50),
	`scheduled_start` timestamp,
	`scheduled_end` timestamp,
	`actual_start` timestamp,
	`actual_end` timestamp,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`owner_id` int NOT NULL,
	`stripe_customer_id` varchar(255),
	`subscription_id` varchar(255),
	`subscription_plan` enum('FREE','BASIC','PRO','ENTERPRISE') NOT NULL DEFAULT 'FREE',
	`subscription_status` varchar(50) DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personnel` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`role` enum('applicator','technician','driver','pilot') NOT NULL,
	`status` enum('active','on_leave','inactive') NOT NULL DEFAULT 'active',
	`certifications` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personnel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`name` text NOT NULL,
	`epa_number` varchar(100),
	`manufacturer` text,
	`active_ingredients` text,
	`product_type` varchar(100),
	`application_rate` text,
	`safety_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ai_conversations` ADD CONSTRAINT `ai_conversations_org_id_organizations_id_fk` FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_conversations` ADD CONSTRAINT `ai_conversations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_messages` ADD CONSTRAINT `ai_messages_conversation_id_ai_conversations_id_fk` FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_usage` ADD CONSTRAINT `ai_usage_org_id_organizations_id_fk` FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_usage` ADD CONSTRAINT `ai_usage_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_usage` ADD CONSTRAINT `ai_usage_conversation_id_ai_conversations_id_fk` FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_org_id_organizations_id_fk` FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_org_id_organizations_id_fk` FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_assigned_personnel_id_personnel_id_fk` FOREIGN KEY (`assigned_personnel_id`) REFERENCES `personnel`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personnel` ADD CONSTRAINT `personnel_org_id_organizations_id_fk` FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_org_id_organizations_id_fk` FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;