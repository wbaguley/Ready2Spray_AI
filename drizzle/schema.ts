import { boolean, int, json, decimal, mysqlEnum, mysqlTable, text, timestamp, varchar, date, time, float } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

// Define enums
export const roleEnum = mysqlEnum("role", ["user", "admin"]);
export const subscriptionPlanEnum = mysqlEnum("subscription_plan", ["FREE", "BASIC", "PRO", "ENTERPRISE"]);
export const personnelRoleEnum = mysqlEnum("personnel_role", ["applicator", "technician", "driver", "pilot", "ground_crew", "manager", "dispatcher"]);
export const statusEnum = mysqlEnum("status", ["active", "on_leave", "inactive"]);
export const jobTypeEnum = mysqlEnum("job_type", ["crop_dusting", "pest_control", "fertilization", "herbicide"]);
export const jobStatusEnum = mysqlEnum("job_status", ["pending", "ready", "in_progress", "completed", "cancelled"]);
export const priorityEnum = mysqlEnum("priority", ["low", "medium", "high", "urgent"]);
export const messageRoleEnum = mysqlEnum("message_role", ["user", "assistant", "system"]);
export const fileTypeEnum = mysqlEnum("file_type", ["kml", "gpx", "geojson"]);

// New enums for expanded platform
export const orgModeEnum = mysqlEnum("org_mode", ["ag_aerial", "residential_pest", "both"]);
export const siteTypeEnum = mysqlEnum("site_type", ["field", "orchard", "vineyard", "pivot", "property", "commercial_building"]);
export const propertyTypeEnum = mysqlEnum("property_type", ["residential", "commercial", "multi_family", "industrial"]);
export const zoneTypeEnum = mysqlEnum("zone_type", ["interior", "exterior", "yard", "garage", "attic", "basement", "crawl_space", "perimeter", "custom"]);
export const equipmentTypeEnum = mysqlEnum("equipment_type", ["plane", "helicopter", "ground_rig", "truck", "backpack", "hand_sprayer", "ulv", "other"]);
export const equipmentStatusEnum = mysqlEnum("equipment_status", ["active", "maintenance", "inactive"]);
export const productTypeEnum = mysqlEnum("product_type", ["herbicide", "insecticide", "fungicide", "rodenticide", "adjuvant", "other"]);
export const signalWordEnum = mysqlEnum("signal_word", ["caution", "warning", "danger"]);
export const applicationMethodEnum = mysqlEnum("application_method", ["aerial", "ground_boom", "backpack", "hand_wand", "ulv", "chemigation", "other"]);
export const servicePlanTypeEnum = mysqlEnum("service_plan_type", ["monthly", "quarterly", "bi_monthly", "annual", "one_off"]);
export const servicePlanStatusEnum = mysqlEnum("service_plan_status", ["active", "paused", "cancelled", "completed"]);

export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = typeof waitlist.$inferInsert;

export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum.default("user").notNull(),
  userRole: varchar("user_role", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  licenseNumber: varchar("license_number", { length: 50 }),
  commission: boolean("commission").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Jobs V2 table - Comprehensive job management
export const jobsV2 = mysqlTable("jobs_v2", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  jobType: jobTypeEnum,
  priority: priorityEnum.default("medium"),
  status: jobStatusEnum.default("pending").notNull(),
  customerId: int("customer_id"),
  personnelId: int("personnel_id"),
  equipmentId: int("equipment_id"),
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  scheduledStart: timestamp("scheduled_start"),
  scheduledEnd: timestamp("scheduled_end"),
  productId: int("product_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type JobV2 = typeof jobsV2.$inferSelect;
export type InsertJobV2 = typeof jobsV2.$inferInsert;

// Organizations table with subscription management and mode selection
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  ownerId: int("owner_id").notNull().references(() => users.id),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zip_code", { length: 10 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 255 }),
  notes: text("notes"),
  // Stripe integration - store only IDs, not duplicate data
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  subscriptionPlan: varchar("subscription_plan", { length: 50 }).default("starter"), // starter, professional, enterprise
  subscriptionStatus: varchar("subscription_status", { length: 50 }).default("trialing"), // trialing, active, past_due, canceled, incomplete
  // AI Credit tracking
  aiCreditsTotal: int("ai_credits_total").default(0).notNull(), // Total credits allocated this billing period
  aiCreditsUsed: int("ai_credits_used").default(0).notNull(), // Credits consumed this period
  aiCreditsRollover: int("ai_credits_rollover").default(0).notNull(), // Purchased add-on credits that don't expire
  billingPeriodStart: timestamp("billing_period_start"),
  billingPeriodEnd: timestamp("billing_period_end"),
  // Mode selection
  mode: orgModeEnum.default("ag_aerial").notNull(),
  featuresEnabled: json("features_enabled"), // ['service_plans', 'zones', 'load_sheets', 'flight_board']
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

// Customers table
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zip_code", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// Sites table (fields for ag, properties for pest control)
export const sites = mysqlTable("sites", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  customerId: int("customer_id").references(() => customers.id),
  name: varchar("name", { length: 255 }).notNull(),
  siteType: siteTypeEnum.notNull(),
  // Location
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zip_code", { length: 20 }),
  polygon: json("polygon"), // GeoJSON polygon for boundaries
  centerLat: decimal("center_lat", { precision: 10, scale: 8 }),
  centerLng: decimal("center_lng", { precision: 11, scale: 8 }),
  acres: decimal("acres", { precision: 10, scale: 2 }),
  // Ag-specific fields
  crop: varchar("crop", { length: 100 }),
  variety: varchar("variety", { length: 100 }),
  growthStage: varchar("growth_stage", { length: 50 }),
  // Sensitive areas nearby
  sensitiveAreas: json("sensitive_areas"), // [{type: 'bee_yard', distance: 500, notes: '...'}]
  // Pest control-specific fields
  propertyType: propertyTypeEnum,
  units: int("units").default(1),
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Site = typeof sites.$inferSelect;
export type InsertSite = typeof sites.$inferInsert;

// Zones table (for pest control treatment areas)
export const zones = mysqlTable("zones", {
  id: int("id").autoincrement().primaryKey(),
  siteId: int("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  zoneType: zoneTypeEnum.notNull(),
  description: text("description"),
  specialInstructions: text("special_instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Zone = typeof zones.$inferSelect;
export type InsertZone = typeof zones.$inferInsert;

// Equipment table (planes, trucks, rigs, backpacks)
export const equipment = mysqlTable("equipment", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  name: varchar("name", { length: 255 }).notNull(),
  equipmentType: equipmentTypeEnum.notNull(),
  // Identification
  tailNumber: varchar("tail_number", { length: 50 }),
  licensePlate: varchar("license_plate", { length: 50 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  // Specifications
  tankCapacity: decimal("tank_capacity", { precision: 10, scale: 2 }),
  swathWidth: decimal("swath_width", { precision: 10, scale: 2 }),
  maxSpeed: decimal("max_speed", { precision: 10, scale: 2 }),
  // Status
  status: equipmentStatusEnum.default("active"),
  // Maintenance
  lastMaintenanceDate: date("last_maintenance_date"),
  nextMaintenanceDate: date("next_maintenance_date"),
  maintenanceNotes: text("maintenance_notes"),
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = typeof equipment.$inferInsert;

// Personnel table
export const personnel = mysqlTable("personnel", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  role: personnelRoleEnum.notNull(),
  status: statusEnum.default("active").notNull(),
  certifications: text("certifications"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Personnel = typeof personnel.$inferSelect;
export type InsertPersonnel = typeof personnel.$inferInsert;

// Job Statuses table - customizable per organization
export const jobStatuses = mysqlTable("job_statuses", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  name: varchar("name", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(), // Hex color code
  displayOrder: int("display_order").notNull(), // For sorting
  category: varchar("category", { length: 20 }).notNull(), // 'pending', 'active', 'completed' for dashboard grouping
  isDefault: boolean("is_default").default(false).notNull(), // Default status for new jobs
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type JobStatus = typeof jobStatuses.$inferSelect;
export type InsertJobStatus = typeof jobStatuses.$inferInsert;

// Job Status History table (audit trail for status changes)
export const jobStatusHistory = mysqlTable("job_status_history", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  fromStatusId: int("from_status_id").references(() => jobStatuses.id),
  toStatusId: int("to_status_id").notNull().references(() => jobStatuses.id),
  changedByUserId: int("changed_by_user_id").notNull().references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type JobStatusHistory = typeof jobStatusHistory.$inferSelect;
export type InsertJobStatusHistory = typeof jobStatusHistory.$inferInsert;

// Products table (EPA-registered chemical catalog)
export const productsNew = mysqlTable("products_new", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  epaRegNumber: varchar("epa_reg_number", { length: 50 }).notNull(),
  // Basic info
  brandName: varchar("brand_name", { length: 255 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  // Active ingredients
  activeIngredients: json("active_ingredients"), // [{name: 'Glyphosate', percentage: 41.0}]
  // Classification
  productType: productTypeEnum.notNull(),
  signalWord: signalWordEnum.notNull(),
  isRup: boolean("is_rup").default(false), // Restricted Use Pesticide
  // Use site flags
  indoorAllowed: boolean("indoor_allowed").default(false),
  outdoorAllowed: boolean("outdoor_allowed").default(true),
  aerialAllowed: boolean("aerial_allowed").default(false),
  groundBoomAllowed: boolean("ground_boom_allowed").default(true),
  backpackAllowed: boolean("backpack_allowed").default(false),
  handWandAllowed: boolean("hand_wand_allowed").default(false),
  ulvAllowed: boolean("ulv_allowed").default(false),
  chemigationAllowed: boolean("chemigation_allowed").default(false),
  // Use site categories
  useSites: json("use_sites"), // ['corn', 'soy', 'wheat', 'residential_indoor', 'residential_outdoor']
  // Label references
  labelPdfUrl: text("label_pdf_url"),
  sdsUrl: text("sds_url"),
  manufacturerUrl: text("manufacturer_url"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ProductNew = typeof productsNew.$inferSelect;
export type InsertProductNew = typeof productsNew.$inferInsert;

// ProductUse table (rate ranges by crop/pest)
export const productUse = mysqlTable("product_use", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("product_id").notNull().references(() => productsNew.id, { onDelete: "cascade" }),
  // Use context
  crop: varchar("crop", { length: 100 }),
  pest: varchar("pest", { length: 100 }),
  siteCategory: varchar("site_category", { length: 100 }),
  // Rate limits
  minRate: decimal("min_rate", { precision: 10, scale: 4 }),
  maxRate: decimal("max_rate", { precision: 10, scale: 4 }),
  rateUnit: varchar("rate_unit", { length: 50 }),
  // Application limits
  maxApplicationsPerSeason: int("max_applications_per_season"),
  maxTotalPerSeason: decimal("max_total_per_season", { precision: 10, scale: 4 }),
  maxTotalUnit: varchar("max_total_unit", { length: 50 }),
  // Carrier volume
  minCarrierVolume: decimal("min_carrier_volume", { precision: 10, scale: 2 }),
  maxCarrierVolume: decimal("max_carrier_volume", { precision: 10, scale: 2 }),
  carrierUnit: varchar("carrier_unit", { length: 50 }),
  // Intervals
  phiDays: int("phi_days"),
  reiHours: int("rei_hours"),
  reentryConditions: text("reentry_conditions"),
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ProductUse = typeof productUse.$inferSelect;
export type InsertProductUse = typeof productUse.$inferInsert;

// Service Plans table (for recurring pest control services)
export const servicePlans = mysqlTable("service_plans", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  customerId: int("customer_id").notNull().references(() => customers.id),
  siteId: int("site_id").references(() => sites.id),
  // Plan details
  planName: varchar("plan_name", { length: 255 }).notNull(),
  planType: servicePlanTypeEnum.notNull(),
  // Scheduling
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  nextServiceDate: date("next_service_date"),
  // Service details
  defaultZones: json("default_zones"), // [zone_id1, zone_id2]
  defaultProducts: json("default_products"), // [{product_id, rate}]
  defaultTargetPests: json("default_target_pests"), // ['Ants', 'Spiders', 'Roaches']
  // Pricing
  pricePerService: decimal("price_per_service", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  // Status
  status: servicePlanStatusEnum.default("active"),
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ServicePlan = typeof servicePlans.$inferSelect;
export type InsertServicePlan = typeof servicePlans.$inferInsert;

// Jobs table (updated with new fields)
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  customerId: int("customer_id").references(() => customers.id),
  siteId: int("site_id").references(() => sites.id), // NEW: Link to site
  assignedPersonnelId: int("assigned_personnel_id").references(() => personnel.id),
  equipmentId: int("equipment_id").references(() => equipment.id), // NEW: Link to equipment
  servicePlanId: int("service_plan_id").references(() => servicePlans.id), // NEW: Link to service plan
  productId: int("product_id"), // Link to products_complete table (no FK constraint since it's a raw SQL table)
  title: text("title").notNull(),
  description: text("description"),
  jobType: jobTypeEnum.notNull(),
  statusId: int("status_id").references(() => jobStatuses.id),
  priority: priorityEnum.default("medium").notNull(),
  locationAddress: text("location_address"),
  locationLat: varchar("location_lat", { length: 50 }),
  locationLng: varchar("location_lng", { length: 50 }),
  scheduledStart: timestamp("scheduled_start"),
  scheduledEnd: timestamp("scheduled_end"),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  notes: text("notes"),
  // Agricultural details
  state: varchar("state", { length: 100 }),
  commodityCrop: varchar("commodity_crop", { length: 200 }),
  targetPest: varchar("target_pest", { length: 200 }),
  epaNumber: varchar("epa_number", { length: 100 }),
  applicationRate: varchar("application_rate", { length: 100 }),
  applicationMethod: varchar("application_method", { length: 100 }),
  chemicalProduct: varchar("chemical_product", { length: 200 }),
  // Crop specifics
  reEntryInterval: varchar("re_entry_interval", { length: 100 }),
  preharvestInterval: varchar("preharvest_interval", { length: 100 }),
  maxApplicationsPerSeason: varchar("max_applications_per_season", { length: 50 }),
  maxRatePerSeason: varchar("max_rate_per_season", { length: 100 }),
  methodsAllowed: varchar("methods_allowed", { length: 200 }),
  rate: varchar("rate", { length: 100 }),
  diluentAerial: varchar("diluent_aerial", { length: 100 }),
  diluentGround: varchar("diluent_ground", { length: 100 }),
  diluentChemigation: varchar("diluent_chemigation", { length: 100 }),
  genericConditions: text("generic_conditions"),
  // NEW: Additional fields
  acres: decimal("acres", { precision: 10, scale: 2 }),
  carrierVolume: decimal("carrier_volume", { precision: 10, scale: 2 }),
  carrierUnit: varchar("carrier_unit", { length: 50 }).default("GPA"),
  numLoads: int("num_loads"),
  zonesToTreat: json("zones_to_treat"), // [zone_id1, zone_id2]
  weatherConditions: varchar("weather_conditions", { length: 255 }),
  temperatureF: decimal("temperature_f", { precision: 5, scale: 2 }),
  windSpeedMph: decimal("wind_speed_mph", { precision: 5, scale: 2 }),
  windDirection: varchar("wind_direction", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

// Applications table (historical records)
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  jobId: int("job_id").notNull().references(() => jobs.id),
  siteId: int("site_id").references(() => sites.id),
  customerId: int("customer_id").references(() => customers.id),
  // Personnel
  applicatorId: int("applicator_id").references(() => personnel.id),
  supervisorId: int("supervisor_id").references(() => personnel.id),
  // Equipment
  equipmentId: int("equipment_id").references(() => equipment.id),
  // Application details
  applicationDate: date("application_date").notNull(),
  startTime: time("start_time"),
  endTime: time("end_time"),
  // Products applied
  productsApplied: json("products_applied"), // [{product_id, epa_reg_number, amount, unit, rate, carrier_volume}]
  // Area treated
  acresTreated: decimal("acres_treated", { precision: 10, scale: 2 }),
  areaUnit: varchar("area_unit", { length: 20 }).default("acres"),
  // Method
  applicationMethod: applicationMethodEnum.notNull(),
  // Conditions
  temperatureF: decimal("temperature_f", { precision: 5, scale: 2 }),
  windSpeedMph: decimal("wind_speed_mph", { precision: 5, scale: 2 }),
  windDirection: varchar("wind_direction", { length: 10 }),
  humidityPercent: decimal("humidity_percent", { precision: 5, scale: 2 }),
  weatherConditions: varchar("weather_conditions", { length: 255 }),
  // Target
  targetPest: varchar("target_pest", { length: 255 }),
  crop: varchar("crop", { length: 100 }),
  // Compliance
  phiDate: date("phi_date"),
  reiDatetime: timestamp("rei_datetime"),
  // Record keeping
  completedById: int("completed_by_id").references(() => users.id),
  verifiedById: int("verified_by_id").references(() => users.id),
  verificationDate: date("verification_date"),
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

// Products table (legacy - keep for backward compatibility)
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  epaNumber: varchar("epa_number", { length: 100 }),
  manufacturer: text("manufacturer"),
  activeIngredients: text("active_ingredients"),
  productType: varchar("product_type", { length: 100 }),
  applicationRate: text("application_rate"),
  safetyNotes: text("safety_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// AI Conversations table
export const aiConversations = mysqlTable("ai_conversations", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  userId: int("user_id").notNull().references(() => users.id),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertAiConversation = typeof aiConversations.$inferInsert;

// AI Messages table
export const aiMessages = mysqlTable("ai_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversation_id").notNull().references(() => aiConversations.id),
  role: messageRoleEnum.notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AiMessage = typeof aiMessages.$inferSelect;
export type InsertAiMessage = typeof aiMessages.$inferInsert;

// AI Usage tracking table
export const aiUsage = mysqlTable("ai_usage", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  userId: int("user_id").notNull().references(() => users.id),
  conversationId: int("conversation_id").references(() => aiConversations.id),
  model: varchar("model", { length: 100 }).notNull(),
  inputTokens: int("input_tokens").notNull(),
  outputTokens: int("output_tokens").notNull(),
  totalTokens: int("total_tokens").notNull(),
  cost: varchar("cost", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AiUsage = typeof aiUsage.$inferSelect;
export type InsertAiUsage = typeof aiUsage.$inferInsert;

// Maps table for KML/GPX/GeoJSON file uploads
export const maps = mysqlTable("maps", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  jobId: int("job_id").references(() => jobsV2.id, { onDelete: "cascade" }), // Optional: for job-specific maps
  name: varchar("name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileKey: varchar("file_key", { length: 500 }).notNull(),
  fileType: fileTypeEnum.notNull(),
  fileSize: int("file_size"), // Size in bytes
  uploadedBy: int("uploaded_by").references(() => users.id),
  publicUrl: text("public_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Map = typeof maps.$inferSelect;
export type InsertMap = typeof maps.$inferInsert;

// Integration tables for Zoho CRM and FieldPulse
export const integrationTypeEnum = mysqlEnum("integration_type", ["zoho_crm", "fieldpulse"]);
export const syncDirectionEnum = mysqlEnum("sync_direction", ["to_external", "from_external"]);
export const entityTypeEnum = mysqlEnum("entity_type", ["customer", "job", "personnel", "site"]);
export const syncOperationEnum = mysqlEnum("sync_operation", ["create", "update", "delete"]);
export const syncStatusEnum = mysqlEnum("sync_status", ["success", "error", "skipped"]);

export const integrationConnections = mysqlTable("integration_connections", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull().references(() => organizations.id),
  integrationType: integrationTypeEnum.notNull(),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  
  // Zoho CRM OAuth fields
  zohoClientId: varchar("zoho_client_id", { length: 255 }),
  zohoClientSecret: varchar("zoho_client_secret", { length: 255 }),
  zohoAccessToken: text("zoho_access_token"),
  zohoRefreshToken: text("zoho_refresh_token"),
  zohoTokenExpiresAt: timestamp("zoho_token_expires_at"),
  zohoDataCenter: varchar("zoho_data_center", { length: 50 }),
  
  // FieldPulse API Key
  fieldpulseApiKey: varchar("fieldpulse_api_key", { length: 255 }),
  
  // Sync settings
  syncCustomers: boolean("sync_customers").default(true),
  syncJobs: boolean("sync_jobs").default(true),
  syncPersonnel: boolean("sync_personnel").default(false),
  syncIntervalMinutes: int("sync_interval_minutes").default(15),
  lastSyncAt: timestamp("last_sync_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type IntegrationConnection = typeof integrationConnections.$inferSelect;
export type InsertIntegrationConnection = typeof integrationConnections.$inferInsert;

export const integrationFieldMappings = mysqlTable("integration_field_mappings", {
  id: int("id").autoincrement().primaryKey(),
  connectionId: int("connection_id").notNull().references(() => integrationConnections.id),
  entityType: entityTypeEnum.notNull(),
  ready2sprayField: varchar("ready2spray_field", { length: 100 }).notNull(),
  externalField: varchar("external_field", { length: 100 }).notNull(),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type IntegrationFieldMapping = typeof integrationFieldMappings.$inferSelect;
export type InsertIntegrationFieldMapping = typeof integrationFieldMappings.$inferInsert;

export const integrationSyncLogs = mysqlTable("integration_sync_logs", {
  id: int("id").autoincrement().primaryKey(),
  connectionId: int("connection_id").notNull().references(() => integrationConnections.id),
  syncDirection: syncDirectionEnum.notNull(),
  entityType: entityTypeEnum.notNull(),
  entityId: int("entity_id").notNull(),
  externalId: varchar("external_id", { length: 255 }),
  operation: syncOperationEnum.notNull(),
  status: syncStatusEnum.notNull(),
  errorMessage: text("error_message"),
  requestData: json("request_data"),
  responseData: json("response_data"),
  syncedAt: timestamp("synced_at").defaultNow().notNull(),
});

export type IntegrationSyncLog = typeof integrationSyncLogs.$inferSelect;
export type InsertIntegrationSyncLog = typeof integrationSyncLogs.$inferInsert;

export const integrationEntityMappings = mysqlTable("integration_entity_mappings", {
  id: int("id").autoincrement().primaryKey(),
  connectionId: int("connection_id").notNull().references(() => integrationConnections.id),
  entityType: entityTypeEnum.notNull(),
  ready2sprayId: int("ready2spray_id").notNull(),
  externalId: varchar("external_id", { length: 255 }).notNull(),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type IntegrationEntityMapping = typeof integrationEntityMappings.$inferSelect;
export type InsertIntegrationEntityMapping = typeof integrationEntityMappings.$inferInsert;

// Maintenance task enums
export const maintenanceTaskTypeEnum = mysqlEnum("maintenance_task_type", ["inspection", "oil_change", "filter_replacement", "tire_rotation", "annual_certification", "engine_overhaul", "custom"]);
export const maintenanceFrequencyTypeEnum = mysqlEnum("maintenance_frequency_type", ["hours", "days", "months", "one_time"]);
export const maintenanceStatusEnum = mysqlEnum("maintenance_status", ["pending", "in_progress", "completed", "overdue"]);

export const maintenanceTasks = mysqlTable("maintenance_tasks", {
  id: int("id").autoincrement().primaryKey(),
  equipmentId: int("equipment_id").notNull().references(() => equipment.id, { onDelete: "cascade" }),
  taskName: varchar("task_name", { length: 255 }).notNull(),
  description: text("description"),
  taskType: maintenanceTaskTypeEnum.notNull(),
  frequencyType: maintenanceFrequencyTypeEnum.notNull(),
  frequencyValue: int("frequency_value").notNull(),
  lastCompletedDate: timestamp("last_completed_date"),
  nextDueDate: timestamp("next_due_date"),
  isRecurring: boolean("is_recurring").default(true),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  status: maintenanceStatusEnum.default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MaintenanceTask = typeof maintenanceTasks.$inferSelect;
export type InsertMaintenanceTask = typeof maintenanceTasks.$inferInsert;

// Audit Log table for tracking all user actions
export const auditActionEnum = mysqlEnum("audit_action", ["create", "update", "delete", "login", "logout", "role_change", "status_change", "export", "import", "view"]);
export const auditEntityTypeEnum = mysqlEnum("audit_entity_type", ["user", "customer", "personnel", "job", "site", "equipment", "product", "service_plan", "maintenance_task", "organization", "integration", "job_status"]);

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull().references(() => organizations.id),
  userId: int("user_id").notNull().references(() => users.id),
  action: auditActionEnum.notNull(),
  entityType: auditEntityTypeEnum.notNull(),
  entityId: int("entity_id"),
  entityName: varchar("entity_name", { length: 255 }),
  changes: json("changes"), // { before: {}, after: {} }
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  metadata: json("metadata"), // Additional context data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// Products Complete table - comprehensive product database with AI extraction support
export const productsComplete = mysqlTable("products_complete", {
  id: int("id").autoincrement().primaryKey(),
  orgId: int("org_id").notNull().references(() => organizations.id),
  
  // Basic Information
  nickname: varchar("nickname", { length: 255 }).notNull(), // Searchable product name
  description: text("description"),
  epaNumber: varchar("epa_number", { length: 50 }),
  manufacturer: varchar("manufacturer", { length: 255 }),
  productType: varchar("product_type", { length: 50 }), // Chemical, Fertilizer, etc.
  chemicalType: varchar("chemical_type", { length: 50 }), // Liquid, Granular, etc.
  category: varchar("category", { length: 100 }),
  status: varchar("status", { length: 20 }).default("active"),
  
  // Application Details
  defaultAppliedInput: decimal("default_applied_input", { precision: 10, scale: 4 }),
  defaultUnitApplied: varchar("default_unit_applied", { length: 20 }), // OZ-LIQ, GAL, etc.
  baseUnit: varchar("base_unit", { length: 20 }), // GL, BU, EA, OZ-LIQ, PT, QT, etc.
  applicationRatePerAcre: decimal("application_rate_per_acre", { precision: 10, scale: 4 }),
  fieldApplicationPrice: decimal("field_application_price", { precision: 10, scale: 2 }),
  
  // Pricing & Inventory
  minimumCharge: decimal("minimum_charge", { precision: 10, scale: 2 }),
  commission: varchar("commission", { length: 50 }),
  commissionPaid: decimal("commission_paid", { precision: 10, scale: 4 }),
  extraCommissionPercent: decimal("extra_commission_percent", { precision: 5, scale: 2 }),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  reorderQty: decimal("reorder_qty", { precision: 10, scale: 4 }),
  vendors: text("vendors"),
  otcChemicalSalePrice: decimal("otc_chemical_sale_price", { precision: 10, scale: 2 }),
  densityConversionRate: decimal("density_conversion_rate", { precision: 10, scale: 6 }),
  densityUnitFrom: varchar("density_unit_from", { length: 20 }),
  densityUnitTo: varchar("density_unit_to", { length: 20 }),
  
  // Settings (Boolean flags)
  isRestricted: boolean("is_restricted").default(false),
  dontSplitBilling: boolean("dont_split_billing").default(false),
  isInventoryItem: boolean("is_inventory_item").default(false),
  isDiscountable: boolean("is_discountable").default(false),
  showOnJobSchedule: boolean("show_on_job_schedule").default(false),
  isDiluent: boolean("is_diluent").default(false),
  applyAsLiquid: boolean("apply_as_liquid").default(false),
  
  // Safety & Compliance
  labelSignalWord: varchar("label_signal_word", { length: 20 }), // DANGER, WARNING, CAUTION
  hoursReentry: decimal("hours_reentry", { precision: 10, scale: 2 }),
  daysPreharvest: decimal("days_preharvest", { precision: 10, scale: 2 }),
  cropOverrides: json("crop_overrides"), // [{crop: "Corn", days: 30}, ...]
  sensitiveCrops: json("sensitive_crops"), // ["Tomatoes", "Grapes", ...]
  reentryPpe: text("reentry_ppe"),
  additionalRestrictions: text("additional_restrictions"),
  activeIngredients: text("active_ingredients"),
  
  // AI Extraction metadata
  extractedFromScreenshot: boolean("extracted_from_screenshot").default(false),
  screenshotUrl: text("screenshot_url"),
  extractionConfidence: decimal("extraction_confidence", { precision: 3, scale: 2 }), // 0.00 to 1.00
  lastVerifiedAt: timestamp("last_verified_at"),
  lastVerifiedBy: int("last_verified_by").references(() => users.id),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: int("created_by").references(() => users.id),
});

export type ProductComplete = typeof productsComplete.$inferSelect;
export type InsertProductComplete = typeof productsComplete.$inferInsert;


// API Keys for external integrations
export const apiKeyPermissionEnum = mysqlEnum("api_key_permission", ["read", "write", "delete", "admin"]);

export const apiKeys = mysqlTable("api_keys", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  keyHash: varchar("key_hash", { length: 255 }).notNull(), // bcrypt hash of the API key
  keyPrefix: varchar("key_prefix", { length: 20 }).notNull(), // First 8 chars for identification (e.g., "rts_live_")
  permissions: json("permissions").notNull(), // Array of permission strings
  scopes: json("scopes"), // Optional: specific resource scopes
  rateLimit: int("rate_limit").default(1000), // Requests per hour
  lastUsedAt: timestamp("last_used_at"),
  usageCount: int("usage_count").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: int("created_by").notNull().references(() => users.id),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

// Job Shares for public access
export const jobShares = mysqlTable("job_shares", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("job_id").notNull().references(() => jobsV2.id, { onDelete: "cascade" }),
  shareToken: varchar("share_token", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  expiresAt: timestamp("expires_at"),
  viewCount: int("view_count").default(0),
  allowDownloads: boolean("allow_downloads").default(true).notNull(),
  password: varchar("password", { length: 255 }), // Optional password protection (hashed)
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: int("created_by").notNull().references(() => users.id),
  lastAccessedAt: timestamp("last_accessed_at"),
});

export type JobShare = typeof jobShares.$inferSelect;
export type InsertJobShare = typeof jobShares.$inferInsert;

// API Usage Logs for tracking and analytics
export const apiUsageLogs = mysqlTable("api_usage_logs", {
  id: int("id").autoincrement().primaryKey(),
  apiKeyId: int("api_key_id").notNull().references(() => apiKeys.id, { onDelete: "cascade" }),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  statusCode: int("status_code"),
  responseTime: int("response_time"), // milliseconds
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  requestBody: json("request_body"),
  responseBody: json("response_body"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ApiUsageLog = typeof apiUsageLogs.$inferSelect;
export type InsertApiUsageLog = typeof apiUsageLogs.$inferInsert;

// Organization Members - Multi-tenant user-organization relationships
export const orgMemberRoleEnum = mysqlEnum("org_member_role", ["owner", "admin", "member", "viewer"]);
export const invitationStatusEnum = mysqlEnum("invitation_status", ["pending", "accepted", "declined", "expired"]);

export const organizationMembers = mysqlTable("organization_members", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: orgMemberRoleEnum.default("member").notNull(),
  invitedBy: int("invited_by").references(() => users.id),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  joinedAt: timestamp("joined_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = typeof organizationMembers.$inferInsert;

// Organization Invitations - for inviting users to join organizations
export const organizationInvitations = mysqlTable("organization_invitations", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 320 }).notNull(),
  role: orgMemberRoleEnum.default("member").notNull(),
  invitedBy: int("invited_by").notNull().references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(), // Unique invitation token
  status: invitationStatusEnum.default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(), // Invitations expire after 7 days
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type OrganizationInvitation = typeof organizationInvitations.$inferSelect;
export type InsertOrganizationInvitation = typeof organizationInvitations.$inferInsert;
