import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect } from "react";

/**
 * Hook to check subscription status and redirect if needed
 */
export function useSubscription(options?: { requireActive?: boolean }) {
  const [, setLocation] = useLocation();
  const { data: status, isLoading } = trpc.stripe.getSubscriptionStatus.useQuery();

  useEffect(() => {
    if (isLoading) return;

    // Owner bypass - skip all checks
    if (status?.isOwnerBypass) {
      return;
    }

    // If no organization, redirect to setup
    if (!status?.hasOrganization) {
      setLocation("/signup/organization");
      return;
    }

    // If requires active subscription and doesn't have one
    if (options?.requireActive && !status.hasSubscription) {
      setLocation("/signup/plans");
      return;
    }

    // If subscription is not active (and not owner bypass)
    if (
      options?.requireActive &&
      status.status !== "active" &&
      status.status !== "trialing" &&
      !status.isOwnerBypass
    ) {
      setLocation("/signup/plans");
      return;
    }
  }, [status, isLoading, setLocation, options?.requireActive]);

  return {
    status,
    isLoading,
    hasOrganization: status?.hasOrganization || false,
    hasSubscription: status?.hasSubscription || false,
    isActive: status?.status === "active" || status?.status === "trialing" || status?.isOwnerBypass || false,
    creditsRemaining: status?.creditsRemaining || 0,
    creditsTotal: status?.creditsTotal || 0,
    creditsUsed: status?.creditsUsed || 0,
    isOwnerBypass: status?.isOwnerBypass || false,
  };
}

/**
 * Hook to get subscription management functions
 */
export function useSubscriptionActions() {
  const utils = trpc.useUtils();

  const createCheckout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
      }
    },
  });

  const purchaseCredits = trpc.stripe.purchaseCredits.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onSettled: () => {
      // Refresh subscription status after purchase
      utils.stripe.getSubscriptionStatus.invalidate();
    },
  });

  const getPortalUrl = trpc.stripe.getPortalUrl.useMutation({
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      }
    },
  });

  return {
    createCheckout,
    purchaseCredits,
    getPortalUrl,
  };
}
