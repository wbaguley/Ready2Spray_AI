import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getOrganizationByOwnerEmail, getUserOrganization } from "./dbOrganizations";
import { OWNER_EMAIL } from "./products";
import { upsertUser } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userOverrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 999,
    openId: "test-user-stripe",
    email: "test-stripe@example.com",
    name: "Test Stripe User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...userOverrides,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: { origin: "http://localhost:3000" },
      ip: "127.0.0.1",
      get: (header: string) => {
        if (header === "user-agent") return "test-agent";
        return undefined;
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

function createOwnerContext(): TrpcContext {
  return createAuthContext({
    id: 1000,
    openId: "owner-user",
    email: OWNER_EMAIL,
    name: "Owner User",
  });
}

describe("Stripe Integration", () => {
  // Create test users before each test
  beforeEach(async () => {
    // Create test users in database
    await upsertUser({
      id: 999,
      openId: "test-user-stripe",
      email: "test-stripe@example.com",
      name: "Test Stripe User",
      loginMethod: "manus",
      role: "user",
    });
    
    await upsertUser({
      id: 1000,
      openId: "owner-user",
      email: OWNER_EMAIL,
      name: "Owner User",
      loginMethod: "manus",
      role: "admin",
    });
  });

  describe("stripe.getPlans", () => {
    it("returns all available subscription plans", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const plans = await caller.stripe.getPlans();

      expect(plans).toHaveLength(3);
      expect(plans[0]?.id).toBe("starter");
      expect(plans[1]?.id).toBe("professional");
      expect(plans[2]?.id).toBe("enterprise");

      // Verify plan structure
      const starterPlan = plans.find((p) => p.id === "starter");
      expect(starterPlan).toMatchObject({
        id: "starter",
        name: "Starter",
        monthlyPrice: 29,
        aiCreditsPerMonth: 1000,
      });
      expect(starterPlan?.features).toBeInstanceOf(Array);
      expect(starterPlan?.features.length).toBeGreaterThan(0);
    });
  });

  describe("stripe.createOrganization", () => {
    it("creates organization for regular user", async () => {
      await upsertUser({
        id: 1001,
        openId: "newuser-openid",
        email: "newuser@example.com",
        name: "New User",
        loginMethod: "manus",
        role: "user",
      });
      
      const ctx = createAuthContext({
        id: 1001,
        openId: "newuser-openid",
        email: "newuser@example.com",
      });
      const caller = appRouter.createCaller(ctx);

      const result = await caller.stripe.createOrganization({
        name: "Test Organization",
        mode: "ag_aerial",
      });

      expect(result.organization).toBeDefined();
      expect(result.organization.name).toBe("Test Organization");
      expect(result.organization.ownerId).toBe(1001);
      expect(result.requiresPayment).toBe(true);
      expect(result.organization.stripeCustomerId).toBeDefined();
    });

    it("creates organization with owner bypass", async () => {
      const ctx = createOwnerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.stripe.createOrganization({
        name: "Owner Organization",
        mode: "ag_aerial",
      });

      expect(result.organization).toBeDefined();
      expect(result.organization.name).toBe("Owner Organization");
      expect(result.requiresPayment).toBe(false);
      expect(result.organization.subscriptionStatus).toBe("active");
      expect(result.organization.subscriptionPlan).toBe("enterprise");
      expect(result.organization.aiCreditsTotal).toBe(999999);
      expect(result.organization.stripeCustomerId).toBeUndefined();
    });

    it("prevents creating duplicate organization", async () => {
      await upsertUser({
        id: 1002,
        openId: "duplicate-openid",
        email: "duplicate@example.com",
        name: "Duplicate User",
        loginMethod: "manus",
        role: "user",
      });
      
      const ctx = createAuthContext({
        id: 1002,
        openId: "duplicate-openid",
        email: "duplicate@example.com",
      });
      const caller = appRouter.createCaller(ctx);

      // Create first organization
      await caller.stripe.createOrganization({
        name: "First Org",
        mode: "ag_aerial",
      });

      // Try to create second organization
      await expect(
        caller.stripe.createOrganization({
          name: "Second Org",
          mode: "ag_aerial",
        })
      ).rejects.toThrow("already belong to an organization");
    });
  });

  describe("stripe.getSubscriptionStatus", () => {
    it("returns no organization for new user", async () => {
      await upsertUser({
        id: 2001,
        openId: "noorg-openid",
        email: "noorg@example.com",
        name: "No Org User",
        loginMethod: "manus",
        role: "user",
      });
      
      const ctx = createAuthContext({
        id: 2001,
        openId: "noorg-openid",
        email: "noorg@example.com",
      });
      const caller = appRouter.createCaller(ctx);

      const status = await caller.stripe.getSubscriptionStatus();

      expect(status.hasOrganization).toBe(false);
      expect(status.hasSubscription).toBe(false);
    });

    it("returns organization status for user with org", async () => {
      await upsertUser({
        id: 2002,
        openId: "withorg-openid",
        email: "withorg@example.com",
        name: "With Org User",
        loginMethod: "manus",
        role: "user",
      });
      
      const ctx = createAuthContext({
        id: 2002,
        openId: "withorg-openid",
        email: "withorg@example.com",
      });
      const caller = appRouter.createCaller(ctx);

      // Create organization
      await caller.stripe.createOrganization({
        name: "Status Test Org",
        mode: "ag_aerial",
      });

      const status = await caller.stripe.getSubscriptionStatus();

      expect(status.hasOrganization).toBe(true);
      expect(status.status).toBe("incomplete");
      expect(status.creditsTotal).toBe(0);
      expect(status.creditsUsed).toBe(0);
      expect(status.creditsRemaining).toBe(0);
    });

    it("returns unlimited credits for owner", async () => {
      const ctx = createOwnerContext();
      const caller = appRouter.createCaller(ctx);

      // Create owner organization
      await caller.stripe.createOrganization({
        name: "Owner Status Test",
        mode: "ag_aerial",
      });

      const status = await caller.stripe.getSubscriptionStatus();

      expect(status.hasOrganization).toBe(true);
      expect(status.hasSubscription).toBe(true);
      expect(status.status).toBe("active");
      expect(status.plan).toBe("enterprise");
      expect(status.creditsTotal).toBe(999999);
      expect(status.creditsRemaining).toBe(999999);
      expect(status.isOwnerBypass).toBe(true);
    });
  });

  describe("stripe.createCheckout", () => {
    it("creates checkout session for organization", async () => {
      await upsertUser({
        id: 3001,
        openId: "checkout-openid",
        email: "checkout@example.com",
        name: "Checkout User",
        loginMethod: "manus",
        role: "user",
      });
      
      const ctx = createAuthContext({
        id: 3001,
        openId: "checkout-openid",
        email: "checkout@example.com",
      });
      const caller = appRouter.createCaller(ctx);

      // Create organization first
      await caller.stripe.createOrganization({
        name: "Checkout Test Org",
        mode: "ag_aerial",
      });

      const result = await caller.stripe.createCheckout({
        planId: "professional",
      });

      expect(result.checkoutUrl).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(typeof result.checkoutUrl).toBe("string");
      expect(result.checkoutUrl).toContain("checkout.stripe.com");
    });

    it("fails without organization", async () => {
      await upsertUser({
        id: 3002,
        openId: "nocheckout-openid",
        email: "nocheckout@example.com",
        name: "No Checkout User",
        loginMethod: "manus",
        role: "user",
      });
      
      const ctx = createAuthContext({
        id: 3002,
        openId: "nocheckout-openid",
        email: "nocheckout@example.com",
      });
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.stripe.createCheckout({
          planId: "professional",
        })
      ).rejects.toThrow("No organization found");
    });
  });
});
