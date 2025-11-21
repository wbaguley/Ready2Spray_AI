/**
 * Extended organization database functions
 * Additional helpers for invitation management
 */

import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { organizationInvitations, type OrganizationInvitation } from "../drizzle/schema";

/**
 * Update invitation with partial data (for resending, revoking, etc.)
 */
export async function updateInvitation(
  id: number,
  data: Partial<{
    status: "pending" | "accepted" | "declined" | "expired";
    expiresAt: Date;
    acceptedAt: Date;
  }>
): Promise<OrganizationInvitation> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [invitation] = await db
    .update(organizationInvitations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(organizationInvitations.id, id))
    .returning();

  if (!invitation) throw new Error("Invitation not found");
  return invitation;
}
