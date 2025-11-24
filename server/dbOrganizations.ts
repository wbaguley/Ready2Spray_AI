/**
 * Database helper functions for organization management
 */

import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  organizations,
  organizationMembers,
  organizationInvitations,
  users,
  type Organization,
  type InsertOrganization,
  type OrganizationMember,
  type InsertOrganizationMember,
  type OrganizationInvitation,
  type InsertOrganizationInvitation,
} from "../drizzle/schema";

/**
 * Create a new organization
 */
export async function createOrganization(
  data: InsertOrganization
): Promise<Organization> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(organizations).values(data);
  const insertId = Number(result.insertId);
  const inserted = await db.select().from(organizations).where(eq(organizations.id, insertId)).limit(1);
  const org = inserted[0];
  if (!org) throw new Error("Failed to create organization");
  
  return org;
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(
  id: number
): Promise<Organization | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);

  return org;
}

/**
 * Get organization by Stripe customer ID
 */
export async function getOrganizationByStripeCustomerId(
  stripeCustomerId: string
): Promise<Organization | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.stripeCustomerId, stripeCustomerId))
    .limit(1);

  return org;
}

/**
 * Get organization by owner email
 */
export async function getOrganizationByOwnerEmail(
  email: string
): Promise<Organization | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db
    .select({
      org: organizations,
    })
    .from(organizations)
    .innerJoin(users, eq(organizations.ownerId, users.id))
    .where(eq(users.email, email))
    .limit(1);

  return result?.org;
}

/**
 * Update organization
 */
export async function updateOrganization(
  id: number,
  data: Partial<InsertOrganization>
): Promise<Organization> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [org] = await db
    .update(organizations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(organizations.id, id))
    ;

  if (!org) throw new Error("Organization not found");
  return org;
}

/**
 * Add user to organization
 */
export async function addOrganizationMember(
  data: InsertOrganizationMember
): Promise<OrganizationMember> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [member] = await db
    .insert(organizationMembers)
    .values(data)
    ;

  if (!member) throw new Error("Failed to add organization member");
  return member;
}

/**
 * Get user's organization membership
 */
export async function getUserOrganization(
  userId: number
): Promise<{ organization: Organization; membership: OrganizationMember } | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db
    .select({
      organization: organizations,
      membership: organizationMembers,
    })
    .from(organizationMembers)
    .innerJoin(
      organizations,
      eq(organizationMembers.organizationId, organizations.id)
    )
    .where(eq(organizationMembers.userId, userId))
    .limit(1);

  return result;
}

/**
 * Get all members of an organization
 */
export async function getOrganizationMembers(
  organizationId: number
): Promise<Array<OrganizationMember & { user: typeof users.$inferSelect }>> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const results = await db
    .select({
      member: organizationMembers,
      user: users,
    })
    .from(organizationMembers)
    .innerJoin(users, eq(organizationMembers.userId, users.id))
    .where(eq(organizationMembers.organizationId, organizationId));

  return results.map(r => ({ ...r.member, user: r.user }));
}

/**
 * Create an invitation
 */
export async function createInvitation(
  data: InsertOrganizationInvitation
): Promise<OrganizationInvitation> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [invitation] = await db
    .insert(organizationInvitations)
    .values(data)
    ;

  if (!invitation) throw new Error("Failed to create invitation");
  return invitation;
}

/**
 * Get invitation by token
 */
export async function getInvitationByToken(
  token: string
): Promise<OrganizationInvitation | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [invitation] = await db
    .select()
    .from(organizationInvitations)
    .where(eq(organizationInvitations.token, token))
    .limit(1);

  return invitation;
}

/**
 * Update invitation status
 */
export async function updateInvitationStatus(
  id: number,
  status: "accepted" | "declined" | "expired",
  acceptedAt?: Date
): Promise<OrganizationInvitation> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [invitation] = await db
    .update(organizationInvitations)
    .set({
      status,
      acceptedAt,
      updatedAt: new Date(),
    })
    .where(eq(organizationInvitations.id, id))
    ;

  if (!invitation) throw new Error("Invitation not found");
  return invitation;
}

/**
 * Get pending invitations for an organization
 */
export async function getOrganizationInvitations(
  organizationId: number
): Promise<OrganizationInvitation[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(organizationInvitations)
    .where(
      and(
        eq(organizationInvitations.organizationId, organizationId),
        eq(organizationInvitations.status, "pending")
      )
    );
}

/**
 * Update AI credit usage
 */
export async function updateAICredits(params: {
  organizationId: number;
  creditsUsed: number;
}): Promise<Organization> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get current credits
  const org = await getOrganizationById(params.organizationId);
  if (!org) throw new Error("Organization not found");

  const newCreditsUsed = org.aiCreditsUsed + params.creditsUsed;

  const [updated] = await db
    .update(organizations)
    .set({
      aiCreditsUsed: newCreditsUsed,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, params.organizationId))
    ;

  if (!updated) throw new Error("Failed to update AI credits");
  return updated;
}

/**
 * Reset AI credits for new billing period
 */
export async function resetBillingPeriod(params: {
  organizationId: number;
  newCreditsTotal: number;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
}): Promise<Organization> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [updated] = await db
    .update(organizations)
    .set({
      aiCreditsTotal: params.newCreditsTotal,
      aiCreditsUsed: 0,
      billingPeriodStart: params.billingPeriodStart,
      billingPeriodEnd: params.billingPeriodEnd,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, params.organizationId))
    ;

  if (!updated) throw new Error("Failed to reset billing period");
  return updated;
}

/**
 * Add rollover credits (from one-time purchases)
 */
export async function addRolloverCredits(params: {
  organizationId: number;
  credits: number;
}): Promise<Organization> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const org = await getOrganizationById(params.organizationId);
  if (!org) throw new Error("Organization not found");

  const newRollover = org.aiCreditsRollover + params.credits;

  const [updated] = await db
    .update(organizations)
    .set({
      aiCreditsRollover: newRollover,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, params.organizationId))
    ;

  if (!updated) throw new Error("Failed to add rollover credits");
  return updated;
}
