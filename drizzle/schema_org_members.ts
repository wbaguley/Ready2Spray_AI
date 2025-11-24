import { int, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { organizations } from "./schema";
import { users } from "./schema";

/**
 * Organization Members Table
 * Links users to organizations with role-based access
 * Supports multi-tenant architecture where users can belong to one organization
 */

export const orgMemberRoleEnum = mysqlEnum("org_member_role", ["owner", "admin", "member", "viewer"]);
export const invitationStatusEnum = mysqlEnum("invitation_status", ["pending", "accepted", "declined", "expired"]);

// Organization Members - links users to organizations
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
