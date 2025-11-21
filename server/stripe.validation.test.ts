import { describe, it, expect } from "vitest";
import Stripe from "stripe";

describe("Stripe API Key Validation", () => {
  it("should be able to connect to Stripe with the secret key", async () => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-11-17.clover",
    });
    try {
      const account = await stripe.account.retrieve();
      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
    } catch (error) {
      console.error("Stripe secret key validation failed:", error);
      expect(error).toBeNull();
    }
  });
});
