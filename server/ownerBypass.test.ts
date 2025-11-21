import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { upsertUser } from "./db";
import { OWNER_EMAIL } from "./products";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createOwnerContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 9999,
    openId: "test-owner-bypass",
    email: OWNER_EMAIL, // Use the actual owner email from env
    name: "Test Owner",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Owner Bypass", () => {
  it("auto-creates organization for owner on first getSubscriptionStatus call", async () => {
    // Create owner user
    await upsertUser({
      id: 9999,
      openId: "test-owner-bypass",
      email: OWNER_EMAIL,
      name: "Test Owner",
      loginMethod: "manus",
      role: "admin",
    });

    const ctx = createOwnerContext();
    const caller = appRouter.createCaller(ctx);

    // First call should auto-create organization
    const status = await caller.stripe.getSubscriptionStatus();

    expect(status.hasOrganization).toBe(true);
    expect(status.hasSubscription).toBe(true);
    expect(status.isOwnerBypass).toBe(true);
    expect(status.status).toBe("active");
    expect(status.plan).toBe("enterprise");
    expect(status.creditsTotal).toBe(999999);
  });

  it("owner bypasses invitation code requirement", async () => {
    await upsertUser({
      id: 9998,
      openId: "test-owner-bypass-2",
      email: OWNER_EMAIL,
      name: "Test Owner 2",
      loginMethod: "manus",
      role: "admin",
    });

    const ctx: TrpcContext = {
      user: {
        id: 9998,
        openId: "test-owner-bypass-2",
        email: OWNER_EMAIL,
        name: "Test Owner 2",
        loginMethod: "manus",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    // Owner should be able to create org without invitation code
    const result = await caller.stripe.createOrganization({
      name: "Owner Test Org",
      mode: "ag_aerial",
      invitationCode: "WRONG_CODE", // Should be ignored for owner
    });

    expect(result.organization).toBeDefined();
    expect(result.organization.name).toBe("Owner Test Org");
    expect(result.requiresPayment).toBe(false); // Owner doesn't need payment
  });
});
