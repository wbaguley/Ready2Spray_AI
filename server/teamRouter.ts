/**
 * Team Management Router
 * 
 * Handles team invitations, member management, and role-based access
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./_core/trpc";
import {
  createInvitation,
  getInvitationByToken,
  getOrganizationInvitations,
  updateInvitationStatus,
  addOrganizationMember,
  getOrganizationMembers,
  getUserOrganization,
  getOrganizationById,
} from "./dbOrganizations";
import { updateInvitation } from "./dbOrganizationsExtended";
import { sendTeamInvitationEmail, sendTeamMemberJoinedNotification } from "./email";
import { getUserByOpenId } from "./db";
import { randomBytes } from "crypto";

/**
 * Generate a secure random invitation token
 */
function generateInviteToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Calculate invitation expiry date (7 days from now)
 */
function calculateExpiryDate(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return expiry;
}

export const teamRouter = router({
  /**
   * Invite a new team member
   */
  inviteMember: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["admin", "member", "viewer"]),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's organization
      const userOrg = await getUserOrganization(ctx.user.id);
      if (!userOrg) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must belong to an organization to invite members",
        });
      }

      const { organization } = userOrg;
      const userRole = userOrg.membership.role;

      // Check if user has permission to invite (must be owner or admin)
      if (userRole !== "owner" && userRole !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only organization owners and admins can invite members",
        });
      }

      // Check if email is already a member
      const members = await getOrganizationMembers(organization.id);
      const existingMember = members.find(
        (m) => m.user?.email?.toLowerCase() === input.email.toLowerCase()
      );
      if (existingMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This email is already a member of your organization",
        });
      }

      // Check if there's already a pending invitation
      const invitations = await getOrganizationInvitations(organization.id);
      const pendingInvite = invitations.find(
        (inv) =>
          inv.email.toLowerCase() === input.email.toLowerCase() &&
          inv.status === "pending" &&
          inv.expiresAt > new Date()
      );
      if (pendingInvite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is already a pending invitation for this email",
        });
      }

      // Create invitation
      const token = generateInviteToken();
      const expiresAt = calculateExpiryDate();

      const invitation = await createInvitation({
        organizationId: organization.id,
        email: input.email,
        role: input.role,
        invitedBy: ctx.user.id,
        token,
        expiresAt,
      });

      // Send invitation email
      const origin = ctx.req.headers.origin || "http://localhost:3000";
      const inviteUrl = `${origin}/invite/${token}`;

      await sendTeamInvitationEmail({
        inviteeEmail: input.email,
        inviteeName: input.name,
        organizationName: organization.name,
        inviterName: ctx.user.name || "A team member",
        role: input.role,
        inviteToken: token,
        inviteUrl,
      });

      return {
        invitation,
        inviteUrl,
      };
    }),

  /**
   * Resend invitation email
   */
  resendInvitation: protectedProcedure
    .input(z.object({ invitationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Get user's organization
      const userOrg = await getUserOrganization(ctx.user.id);
      if (!userOrg) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must belong to an organization",
        });
      }

      const { organization } = userOrg;
      const userRole = userOrg.membership.role;

      // Check permission
      if (userRole !== "owner" && userRole !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only organization owners and admins can resend invitations",
        });
      }

      // Get all invitations and find the one to resend
      const invitations = await getOrganizationInvitations(organization.id);
      const invitation = invitations.find((inv) => inv.id === input.invitationId);

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      if (invitation.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only resend pending invitations",
        });
      }

      // Extend expiry date
      const newExpiresAt = calculateExpiryDate();
      await updateInvitation(invitation.id, {
        expiresAt: newExpiresAt,
      });

      // Resend email
      const origin = ctx.req.headers.origin || "http://localhost:3000";
      const inviteUrl = `${origin}/invite/${invitation.token}`;

      await sendTeamInvitationEmail({
        inviteeEmail: invitation.email,
        organizationName: organization.name,
        inviterName: ctx.user.name || "A team member",
        role: invitation.role,
        inviteToken: invitation.token,
        inviteUrl,
      });

      return { success: true };
    }),

  /**
   * Revoke/cancel invitation
   */
  revokeInvitation: protectedProcedure
    .input(z.object({ invitationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Get user's organization
      const userOrg = await getUserOrganization(ctx.user.id);
      if (!userOrg) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must belong to an organization",
        });
      }

      const { organization } = userOrg;
      const userRole = userOrg.membership.role;

      // Check permission
      if (userRole !== "owner" && userRole !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only organization owners and admins can revoke invitations",
        });
      }

      // Get invitation
      const invitations = await getOrganizationInvitations(organization.id);
      const invitation = invitations.find((inv) => inv.id === input.invitationId);

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      // Update status to expired (revoked)
      await updateInvitation(invitation.id, {
        status: "expired",
      });

      return { success: true };
    }),

  /**
   * Get all invitations for user's organization
   */
  getInvitations: protectedProcedure.query(async ({ ctx }) => {
    const userOrg = await getUserOrganization(ctx.user.id);
    if (!userOrg) {
      return [];
    }

    return await getOrganizationInvitations(userOrg.organization.id);
  }),

  /**
   * Get invitation details by token (public endpoint for accepting invites)
   */
  getInvitationByToken: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const invitation = await getInvitationByToken(input.token);

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      if (invitation.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invitation has already been used or revoked",
        });
      }

      if (invitation.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invitation has expired",
        });
      }

      // Get organization details
      const organization = await getOrganizationById(invitation.organizationId);

      return {
        invitation,
        organization,
      };
    }),

  /**
   * Accept invitation and join organization
   */
  acceptInvitation: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await getInvitationByToken(input.token);

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      if (invitation.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invitation has already been used or revoked",
        });
      }

      if (invitation.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invitation has expired",
        });
      }

      // Verify email matches
      if (ctx.user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invitation was sent to a different email address",
        });
      }

      // Check if already a member
      const members = await getOrganizationMembers(invitation.organizationId);
      const existingMember = members.find((m) => m.userId === ctx.user.id);
      if (existingMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already a member of this organization",
        });
      }

      // Add as member
      await addOrganizationMember({
        organizationId: invitation.organizationId,
        userId: ctx.user.id,
        role: invitation.role,
        joinedAt: new Date(),
      });

      // Update invitation status
      await updateInvitation(invitation.id, {
        status: "accepted",
      });

      // Get organization and inviter details
      const organization = await getOrganizationById(invitation.organizationId);
      const inviter = await getUserByOpenId(
        members.find((m) => m.userId === invitation.invitedBy)?.user?.openId || ""
      );

      // Notify organization owner
      if (inviter && inviter.email) {
        await sendTeamMemberJoinedNotification({
          ownerEmail: inviter.email,
          ownerName: inviter.name || "Organization Owner",
          memberEmail: ctx.user.email || "",
          memberName: ctx.user.name || "New Member",
          organizationName: organization?.name || "Your Organization",
          role: invitation.role,
        });
      }

      return {
        success: true,
        organization,
      };
    }),

  /**
   * Get all members of user's organization
   */
  getMembers: protectedProcedure.query(async ({ ctx }) => {
    const userOrg = await getUserOrganization(ctx.user.id);
    if (!userOrg) {
      return [];
    }

    return await getOrganizationMembers(userOrg.organization.id);
  }),
});
