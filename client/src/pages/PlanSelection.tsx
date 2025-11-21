import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Loader2, Sparkles } from "lucide-react";

export default function PlanSelection() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "professional" | "enterprise">("professional");
  const [couponCode, setCouponCode] = useState("");

  const { data: plans, isLoading } = trpc.stripe.getPlans.useQuery();

  const createCheckoutMutation = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        // Open Stripe checkout in new tab
        window.open(data.checkoutUrl, "_blank");
        toast.info("Redirecting to checkout...");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const handleSelectPlan = () => {
    createCheckoutMutation.mutate({
      planId: selectedPlan,
      couponCode: couponCode || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const planCards = [
    {
      id: "starter",
      highlight: false,
    },
    {
      id: "professional",
      highlight: true,
    },
    {
      id: "enterprise",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-300">
            Select the plan that best fits your business needs. All plans include full access to Ready2Spray features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {planCards.map((card) => {
            const plan = plans?.find((p) => p.id === card.id);
            if (!plan) return null;

            const isSelected = selectedPlan === card.id;

            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-purple-500 shadow-xl scale-105"
                    : "hover:shadow-lg hover:scale-102"
                } ${card.highlight ? "border-purple-500 border-2" : ""}`}
                onClick={() => setSelectedPlan(card.id as typeof selectedPlan)}
              >
                {card.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-4 py-1">
                      <Sparkles className="w-3 h-3 mr-1 inline" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">${plan.monthlyPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{plan.aiCreditsPerMonth.toLocaleString()}</strong> AI
                    credits/month
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedPlan(card.id as typeof selectedPlan)}
                  >
                    {isSelected ? "Selected" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Complete Your Subscription</CardTitle>
            <CardDescription>Have a coupon code? Enter it below for a discount.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coupon">Coupon Code (Optional)</Label>
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="TRIAL14 or TRIAL30"
              />
              <p className="text-xs text-muted-foreground">
                Use <strong>TRIAL14</strong> for 14-day free trial or <strong>TRIAL30</strong> for 30-day free trial
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setLocation("/dashboard")} className="flex-1">
                Skip for Now
              </Button>
              <Button
                onClick={handleSelectPlan}
                disabled={createCheckoutMutation.isPending}
                className="flex-1"
              >
                {createCheckoutMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to Payment
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              You'll be redirected to Stripe to complete your payment securely. Cancel anytime.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Need help? Contact us at{" "}
            <a href="mailto:support@ready2spray.com" className="text-purple-400 hover:underline">
              support@ready2spray.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
