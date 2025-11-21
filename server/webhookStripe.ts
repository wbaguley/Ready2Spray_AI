/**
 * Stripe Webhook Handler
 * 
 * Processes Stripe webhook events for subscription lifecycle management
 */

import { Request, Response } from "express";
import { constructWebhookEvent, getCreditsForPlan, calculateBillingPeriod } from "./stripe";
import {
  getOrganizationByStripeCustomerId,
  updateOrganization,
  resetBillingPeriod,
  addRolloverCredits,
} from "./dbOrganizations";
import { AI_CREDIT_ADDONS } from "./products";
import Stripe from "stripe";

/**
 * Handle Stripe webhook events
 * This endpoint must be registered with express.raw() middleware
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    console.error("[Stripe Webhook] No signature found");
    return res.status(400).json({ error: "No signature" });
  }

  let event: Stripe.Event;

  try {
    // Construct event from raw body and signature
    const sig = Array.isArray(signature) ? signature[0] : signature;
    event = constructWebhookEvent(req.body, sig);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[Stripe Webhook] Checkout completed:", session.id);

  const customerId = session.customer as string;
  const organizationId = session.metadata?.organizationId;

  if (!customerId || !organizationId) {
    console.error("[Stripe Webhook] Missing customer ID or organization ID");
    return;
  }

  // Get organization
  const org = await getOrganizationByStripeCustomerId(customerId);
  if (!org) {
    console.error("[Stripe Webhook] Organization not found for customer:", customerId);
    return;
  }

  // Handle subscription checkout
  if (session.mode === "subscription") {
    const subscriptionId = session.subscription as string;
    const planId = session.metadata?.planId || "starter";

    // Calculate billing period
    const { start, end } = calculateBillingPeriod();

    // Get credits for plan
    const credits = getCreditsForPlan(planId);

    await updateOrganization(org.id, {
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
      subscriptionPlan: planId,
      aiCreditsTotal: credits,
      aiCreditsUsed: 0,
      billingPeriodStart: start,
      billingPeriodEnd: end,
    });

    console.log(`[Stripe Webhook] Subscription activated for org ${org.id}`);
  }

  // Handle one-time payment (AI credits)
  if (session.mode === "payment") {
    const credits = parseInt(session.metadata?.credits || "0");
    if (credits > 0) {
      await addRolloverCredits({
        organizationId: org.id,
        credits,
      });
      console.log(`[Stripe Webhook] Added ${credits} rollover credits to org ${org.id}`);
    }
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Subscription updated:", subscription.id);

  const customerId = subscription.customer as string;
  const org = await getOrganizationByStripeCustomerId(customerId);

  if (!org) {
    console.error("[Stripe Webhook] Organization not found for customer:", customerId);
    return;
  }

  // Get plan from price ID
  const priceId = subscription.items.data[0]?.price.id;
  let planId = "starter";

  // Match price ID to plan (you may need to adjust this based on your actual price IDs)
  if (priceId?.includes("professional")) {
    planId = "professional";
  } else if (priceId?.includes("enterprise")) {
    planId = "enterprise";
  }

  // Map Stripe status to our status
  let status = subscription.status;
  if (status === "trialing") {
    status = "trialing";
  } else if (status === "active") {
    status = "active";
  } else if (status === "past_due") {
    status = "past_due";
  } else if (status === "canceled" || status === "unpaid") {
    status = "canceled";
  }

  await updateOrganization(org.id, {
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: status,
    subscriptionPlan: planId,
  });

  console.log(`[Stripe Webhook] Updated subscription status to ${status} for org ${org.id}`);
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("[Stripe Webhook] Subscription deleted:", subscription.id);

  const customerId = subscription.customer as string;
  const org = await getOrganizationByStripeCustomerId(customerId);

  if (!org) {
    console.error("[Stripe Webhook] Organization not found for customer:", customerId);
    return;
  }

  await updateOrganization(org.id, {
    subscriptionStatus: "canceled",
  });

  console.log(`[Stripe Webhook] Subscription canceled for org ${org.id}`);
}

/**
 * Handle successful invoice payment (renewal)
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("[Stripe Webhook] Invoice paid:", invoice.id);

  const customerId = invoice.customer as string;
  const org = await getOrganizationByStripeCustomerId(customerId);

  if (!org) {
    console.error("[Stripe Webhook] Organization not found for customer:", customerId);
    return;
  }

  // Reset billing period and credits for subscription renewals
  // @ts-ignore - subscription exists on Invoice but types may not reflect it
  if (invoice.subscription) {
    const { start, end } = calculateBillingPeriod();
    const credits = getCreditsForPlan(org.subscriptionPlan || "starter");

    await resetBillingPeriod({
      organizationId: org.id,
      newCreditsTotal: credits,
      billingPeriodStart: start,
      billingPeriodEnd: end,
    });

    console.log(`[Stripe Webhook] Reset billing period for org ${org.id}`);
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("[Stripe Webhook] Invoice payment failed:", invoice.id);

  const customerId = invoice.customer as string;
  const org = await getOrganizationByStripeCustomerId(customerId);

  if (!org) {
    console.error("[Stripe Webhook] Organization not found for customer:", customerId);
    return;
  }

  await updateOrganization(org.id, {
    subscriptionStatus: "past_due",
  });

  console.log(`[Stripe Webhook] Marked subscription as past_due for org ${org.id}`);
}
