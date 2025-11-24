CREATE TABLE IF NOT EXISTS `ai_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`user_id` int NOT NULL,
	`title` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ai_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversation_id` int NOT NULL,
	`message_role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ai_usage` (
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
CREATE TABLE IF NOT EXISTS `api_keys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`key_hash` varchar(255) NOT NULL,
	`key_prefix` varchar(20) NOT NULL,
	`permissions` json NOT NULL,
	`scopes` json,
	`rate_limit` int DEFAULT 1000,
	`last_used_at` timestamp,
	`usage_count` int DEFAULT 0,
	`expires_at` timestamp,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` int NOT NULL,
	CONSTRAINT `api_keys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `api_usage_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`api_key_id` int NOT NULL,
	`endpoint` varchar(255) NOT NULL,
	`method` varchar(10) NOT NULL,
	`status_code` int,
	`response_time` int,
	`ip_address` varchar(45),
	`user_agent` text,
	`request_body` json,
	`response_body` json,
	`error_message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_usage_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`job_id` int NOT NULL,
	`site_id` int,
	`customer_id` int,
	`applicator_id` int,
	`supervisor_id` int,
	`equipment_id` int,
	`application_date` date NOT NULL,
	`start_time` time,
	`end_time` time,
	`products_applied` json,
	`acres_treated` decimal(10,2),
	`area_unit` varchar(20) DEFAULT 'acres',
	`application_method` enum('aerial','ground_boom','backpack','hand_wand','ulv','chemigation','other') NOT NULL,
	`temperature_f` decimal(5,2),
	`wind_speed_mph` decimal(5,2),
	`wind_direction` varchar(10),
	`humidity_percent` decimal(5,2),
	`weather_conditions` varchar(255),
	`target_pest` varchar(255),
	`crop` varchar(100),
	`phi_date` date,
	`rei_datetime` timestamp,
	`completed_by_id` int,
	`verified_by_id` int,
	`verification_date` date,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`user_id` int NOT NULL,
	`audit_action` enum('create','update','delete','login','logout','role_change','status_change','export','import','view') NOT NULL,
	`audit_entity_type` enum('user','customer','personnel','job','site','equipment','product','service_plan','maintenance_task','organization','integration','job_status') NOT NULL,
	`entity_id` int,
	`entity_name` varchar(255),
	`changes` json,
	`ip_address` varchar(45),
	`user_agent` text,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `customers` (
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
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `equipment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`equipment_type` enum('plane','helicopter','ground_rig','truck','backpack','hand_sprayer','ulv','other') NOT NULL,
	`tail_number` varchar(50),
	`license_plate` varchar(50),
	`serial_number` varchar(100),
	`tank_capacity` decimal(10,2),
	`swath_width` decimal(10,2),
	`max_speed` decimal(10,2),
	`equipment_status` enum('active','maintenance','inactive') DEFAULT 'active',
	`last_maintenance_date` date,
	`next_maintenance_date` date,
	`maintenance_notes` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `equipment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `integration_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`integration_type` enum('zoho_crm','fieldpulse') NOT NULL,
	`is_enabled` boolean NOT NULL DEFAULT true,
	`zoho_client_id` varchar(255),
	`zoho_client_secret` varchar(255),
	`zoho_access_token` text,
	`zoho_refresh_token` text,
	`zoho_token_expires_at` timestamp,
	`zoho_data_center` varchar(50),
	`fieldpulse_api_key` varchar(255),
	`sync_customers` boolean DEFAULT true,
	`sync_jobs` boolean DEFAULT true,
	`sync_personnel` boolean DEFAULT false,
	`sync_interval_minutes` int DEFAULT 15,
	`last_sync_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `integration_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `integration_entity_mappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`connection_id` int NOT NULL,
	`entity_type` enum('customer','job','personnel','site') NOT NULL,
	`ready2spray_id` int NOT NULL,
	`external_id` varchar(255) NOT NULL,
	`last_synced_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `integration_entity_mappings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `integration_field_mappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`connection_id` int NOT NULL,
	`entity_type` enum('customer','job','personnel','site') NOT NULL,
	`ready2spray_field` varchar(100) NOT NULL,
	`external_field` varchar(100) NOT NULL,
	`is_enabled` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `integration_field_mappings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `integration_sync_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`connection_id` int NOT NULL,
	`sync_direction` enum('to_external','from_external') NOT NULL,
	`entity_type` enum('customer','job','personnel','site') NOT NULL,
	`entity_id` int NOT NULL,
	`external_id` varchar(255),
	`sync_operation` enum('create','update','delete') NOT NULL,
	`sync_status` enum('success','error','skipped') NOT NULL,
	`error_message` text,
	`request_data` json,
	`response_data` json,
	`synced_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `integration_sync_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `job_shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_id` int NOT NULL,
	`share_token` varchar(64) NOT NULL,
	`title` varchar(255),
	`expires_at` timestamp,
	`view_count` int DEFAULT 0,
	`allow_downloads` boolean NOT NULL DEFAULT true,
	`password` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` int NOT NULL,
	`last_accessed_at` timestamp,
	CONSTRAINT `job_shares_id` PRIMARY KEY(`id`),
	CONSTRAINT `job_shares_share_token_unique` UNIQUE(`share_token`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `job_status_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_id` int NOT NULL,
	`from_status_id` int,
	`to_status_id` int NOT NULL,
	`changed_by_user_id` int NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `job_status_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `job_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`color` varchar(7) NOT NULL,
	`display_order` int NOT NULL,
	`category` varchar(20) NOT NULL,
	`is_default` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `job_statuses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`customer_id` int,
	`site_id` int,
	`assigned_personnel_id` int,
	`equipment_id` int,
	`service_plan_id` int,
	`product_id` int,
	`title` text NOT NULL,
	`description` text,
	`job_type` enum('crop_dusting','pest_control','fertilization','herbicide') NOT NULL,
	`status_id` int,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`location_address` text,
	`location_lat` varchar(50),
	`location_lng` varchar(50),
	`scheduled_start` timestamp,
	`scheduled_end` timestamp,
	`actual_start` timestamp,
	`actual_end` timestamp,
	`notes` text,
	`state` varchar(100),
	`commodity_crop` varchar(200),
	`target_pest` varchar(200),
	`epa_number` varchar(100),
	`application_rate` varchar(100),
	`application_method` varchar(100),
	`chemical_product` varchar(200),
	`re_entry_interval` varchar(100),
	`preharvest_interval` varchar(100),
	`max_applications_per_season` varchar(50),
	`max_rate_per_season` varchar(100),
	`methods_allowed` varchar(200),
	`rate` varchar(100),
	`diluent_aerial` varchar(100),
	`diluent_ground` varchar(100),
	`diluent_chemigation` varchar(100),
	`generic_conditions` text,
	`acres` decimal(10,2),
	`carrier_volume` decimal(10,2),
	`carrier_unit` varchar(50) DEFAULT 'GPA',
	`num_loads` int,
	`zones_to_treat` json,
	`weather_conditions` varchar(255),
	`temperature_f` decimal(5,2),
	`wind_speed_mph` decimal(5,2),
	`wind_direction` varchar(10),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `jobs_v2` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`job_type` enum('crop_dusting','pest_control','fertilization','herbicide'),
	`priority` enum('low','medium','high','urgent') DEFAULT 'medium',
	`job_status` enum('pending','ready','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`customer_id` int,
	`personnel_id` int,
	`equipment_id` int,
	`location` text,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`scheduled_start` timestamp,
	`scheduled_end` timestamp,
	`product_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jobs_v2_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `maintenance_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`equipment_id` int NOT NULL,
	`task_name` varchar(255) NOT NULL,
	`description` text,
	`maintenance_task_type` enum('inspection','oil_change','filter_replacement','tire_rotation','annual_certification','engine_overhaul','custom') NOT NULL,
	`maintenance_frequency_type` enum('hours','days','months','one_time') NOT NULL,
	`frequency_value` int NOT NULL,
	`last_completed_date` timestamp,
	`next_due_date` timestamp,
	`is_recurring` boolean DEFAULT true,
	`estimated_cost` decimal(10,2),
	`actual_cost` decimal(10,2),
	`maintenance_status` enum('pending','in_progress','completed','overdue') NOT NULL DEFAULT 'pending',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `maintenance_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `maps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`job_id` int,
	`name` varchar(255) NOT NULL,
	`file_url` text NOT NULL,
	`file_key` varchar(500) NOT NULL,
	`file_type` enum('kml','gpx','geojson') NOT NULL,
	`file_size` int,
	`uploaded_by` int,
	`public_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `maps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `organization_invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`org_member_role` enum('owner','admin','member','viewer') NOT NULL DEFAULT 'member',
	`invited_by` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`invitation_status` enum('pending','accepted','declined','expired') NOT NULL DEFAULT 'pending',
	`expires_at` timestamp NOT NULL,
	`accepted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_invitations_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `organization_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`user_id` int NOT NULL,
	`org_member_role` enum('owner','admin','member','viewer') NOT NULL DEFAULT 'member',
	`invited_by` int,
	`invited_at` timestamp NOT NULL DEFAULT (now()),
	`joined_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`owner_id` int NOT NULL,
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`zip_code` varchar(10),
	`phone` varchar(20),
	`email` varchar(320),
	`website` varchar(255),
	`notes` text,
	`stripe_customer_id` varchar(255),
	`stripe_subscription_id` varchar(255),
	`subscription_plan` varchar(50) DEFAULT 'starter',
	`subscription_status` varchar(50) DEFAULT 'trialing',
	`ai_credits_total` int NOT NULL DEFAULT 0,
	`ai_credits_used` int NOT NULL DEFAULT 0,
	`ai_credits_rollover` int NOT NULL DEFAULT 0,
	`billing_period_start` timestamp,
	`billing_period_end` timestamp,
	`org_mode` enum('ag_aerial','residential_pest','both') NOT NULL DEFAULT 'ag_aerial',
	`features_enabled` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_stripe_customer_id_unique` UNIQUE(`stripe_customer_id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `personnel` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`personnel_role` enum('applicator','technician','driver','pilot','ground_crew','manager','dispatcher') NOT NULL,
	`status` enum('active','on_leave','inactive') NOT NULL DEFAULT 'active',
	`certifications` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `personnel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `product_use` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`crop` varchar(100),
	`pest` varchar(100),
	`site_category` varchar(100),
	`min_rate` decimal(10,4),
	`max_rate` decimal(10,4),
	`rate_unit` varchar(50),
	`max_applications_per_season` int,
	`max_total_per_season` decimal(10,4),
	`max_total_unit` varchar(50),
	`min_carrier_volume` decimal(10,2),
	`max_carrier_volume` decimal(10,2),
	`carrier_unit` varchar(50),
	`phi_days` int,
	`rei_hours` int,
	`reentry_conditions` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_use_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `products` (
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
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `products_complete` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`nickname` varchar(255) NOT NULL,
	`description` text,
	`epa_number` varchar(50),
	`manufacturer` varchar(255),
	`product_type` varchar(50),
	`chemical_type` varchar(50),
	`category` varchar(100),
	`status` varchar(20) DEFAULT 'active',
	`default_applied_input` decimal(10,4),
	`default_unit_applied` varchar(20),
	`base_unit` varchar(20),
	`application_rate_per_acre` decimal(10,4),
	`field_application_price` decimal(10,2),
	`minimum_charge` decimal(10,2),
	`commission` varchar(50),
	`commission_paid` decimal(10,4),
	`extra_commission_percent` decimal(5,2),
	`unit_cost` decimal(10,2),
	`reorder_qty` decimal(10,4),
	`vendors` text,
	`otc_chemical_sale_price` decimal(10,2),
	`density_conversion_rate` decimal(10,6),
	`density_unit_from` varchar(20),
	`density_unit_to` varchar(20),
	`is_restricted` boolean DEFAULT false,
	`dont_split_billing` boolean DEFAULT false,
	`is_inventory_item` boolean DEFAULT false,
	`is_discountable` boolean DEFAULT false,
	`show_on_job_schedule` boolean DEFAULT false,
	`is_diluent` boolean DEFAULT false,
	`apply_as_liquid` boolean DEFAULT false,
	`label_signal_word` varchar(20),
	`hours_reentry` decimal(10,2),
	`days_preharvest` decimal(10,2),
	`crop_overrides` json,
	`sensitive_crops` json,
	`reentry_ppe` text,
	`additional_restrictions` text,
	`active_ingredients` text,
	`extracted_from_screenshot` boolean DEFAULT false,
	`screenshot_url` text,
	`extraction_confidence` decimal(3,2),
	`last_verified_at` timestamp,
	`last_verified_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` int,
	CONSTRAINT `products_complete_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `products_new` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`epa_reg_number` varchar(50) NOT NULL,
	`brand_name` varchar(255) NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`manufacturer` varchar(255),
	`active_ingredients` json,
	`product_type` enum('herbicide','insecticide','fungicide','rodenticide','adjuvant','other') NOT NULL,
	`signal_word` enum('caution','warning','danger') NOT NULL,
	`is_rup` boolean DEFAULT false,
	`indoor_allowed` boolean DEFAULT false,
	`outdoor_allowed` boolean DEFAULT true,
	`aerial_allowed` boolean DEFAULT false,
	`ground_boom_allowed` boolean DEFAULT true,
	`backpack_allowed` boolean DEFAULT false,
	`hand_wand_allowed` boolean DEFAULT false,
	`ulv_allowed` boolean DEFAULT false,
	`chemigation_allowed` boolean DEFAULT false,
	`use_sites` json,
	`label_pdf_url` text,
	`sds_url` text,
	`manufacturer_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_new_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `service_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`site_id` int,
	`plan_name` varchar(255) NOT NULL,
	`service_plan_type` enum('monthly','quarterly','bi_monthly','annual','one_off') NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date,
	`next_service_date` date,
	`default_zones` json,
	`default_products` json,
	`default_target_pests` json,
	`price_per_service` decimal(10,2),
	`currency` varchar(10) DEFAULT 'USD',
	`service_plan_status` enum('active','paused','cancelled','completed') DEFAULT 'active',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `sites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`customer_id` int,
	`name` varchar(255) NOT NULL,
	`site_type` enum('field','orchard','vineyard','pivot','property','commercial_building') NOT NULL,
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zip_code` varchar(20),
	`polygon` json,
	`center_lat` decimal(10,8),
	`center_lng` decimal(11,8),
	`acres` decimal(10,2),
	`crop` varchar(100),
	`variety` varchar(100),
	`growth_stage` varchar(50),
	`sensitive_areas` json,
	`property_type` enum('residential','commercial','multi_family','industrial'),
	`units` int DEFAULT 1,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`user_role` varchar(20),
	`phone` varchar(20),
	`license_number` varchar(50),
	`commission` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(255),
	`phone` varchar(50),
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `waitlist_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`site_id` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`zone_type` enum('interior','exterior','yard','garage','attic','basement','crawl_space','perimeter','custom') NOT NULL,
	`description` text,
	`special_instructions` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
