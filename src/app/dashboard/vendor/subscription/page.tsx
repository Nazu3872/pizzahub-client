"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  Clock,
  ArrowLeft,
  Zap,
  Store,
} from "lucide-react";

export default function VendorSubscriptionPage() {
  const { data: session } = useSession();
  const [subStatus, setSubStatus] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/subscription/status");
      if (res.success && res.data) {
        setSubStatus(res.data);
      }
    } catch (err: any) {
      toast.error("Could not load subscription details", {
        description: err.message || "Failed to contact server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await api.post("/api/subscription/checkout", {});
      if (res.success && res.url) {
        toast.info("Redirecting to Stripe Checkout...", {
          description: "Complete payment to unlock unlimited artisan menu items.",
        });
        window.location.href = res.url;
      } else {
        toast.error("Checkout Failed", {
          description: res.message || "Could not initialize checkout session.",
        });
        setUpgrading(false);
      }
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "An unexpected error occurred.",
      });
      setUpgrading(false);
    }
  };

  const isPremium = subStatus?.isPremium || subStatus?.subscriptionPlan === "premium";

  const formatDate = (dateVal: string | Date | null) => {
    if (!dateVal) return "N/A";
    return new Date(dateVal).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/dashboard/vendor"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-extrabold font-heading text-foreground">
              Subscription & Billing
            </h1>
            {isPremium ? (
              <Badge className="bg-amber-500 text-white font-bold gap-1 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" /> Premium Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="font-semibold">
                Free Tier
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Scale your artisan kitchen with unlimited menu listings and featured homepage showcase.
          </p>
        </div>

        <Link href="/dashboard/vendor">
          <Button variant="outline" className="rounded-xl font-semibold gap-2">
            <Store className="h-4 w-4 text-primary" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>

      {/* Current Subscription Status Banner */}
      <div className="mb-10 p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl shrink-0 shadow-inner ${
              isPremium
                ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {isPremium ? <Sparkles className="h-7 w-7" /> : <Store className="h-7 w-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                Current Plan
              </span>
              <Badge
                className={
                  isPremium
                    ? "bg-amber-500 text-white font-bold"
                    : "bg-muted text-muted-foreground font-bold"
                }
              >
                {isPremium ? "Premium Partner" : "Free Plan"}
              </Badge>
            </div>
            <h3 className="text-2xl font-black font-heading text-foreground">
              {isPremium ? "Artisan Kitchen Unlimited" : "Standard Artisan Starter"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>
                {isPremium
                  ? `Subscription active until: ${formatDate(subStatus?.subscriptionExpiresAt)}`
                  : "Limited to max 3 active menu items"}
              </span>
            </p>
          </div>
        </div>

        {!isPremium ? (
          <Button
            size="lg"
            onClick={handleUpgrade}
            disabled={upgrading || loading}
            className="rounded-2xl font-extrabold gap-2.5 px-8 py-6 text-base bg-gradient-to-r from-primary to-orange-600 hover:from-primary/95 hover:to-orange-600/95 shadow-lg shadow-primary/20 shrink-0 cursor-pointer"
          >
            {upgrading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Redirecting to Stripe...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Upgrade to Premium ($29/mo)</span>
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>All Premium perks activated via verified Stripe Webhook</span>
          </div>
        )}
      </div>

      {/* Pricing Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* FREE PLAN */}
        <Card
          className={`rounded-3xl border transition-all ${
            !isPremium
              ? "border-primary/50 shadow-md ring-2 ring-primary/10"
              : "border-border shadow-xs opacity-80"
          }`}
        >
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-center mb-2">
              <Badge variant="outline" className="font-bold">
                Starter
              </Badge>
              {!isPremium && (
                <span className="text-xs font-bold text-primary">Your Current Plan</span>
              )}
            </div>
            <CardTitle className="text-2xl font-black font-heading text-foreground">
              Free Plan
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground pt-1">
              Perfect for new artisan pizzerias getting started on PizzaHub.
            </CardDescription>
            <div className="pt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black font-heading text-foreground">$0</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-4 space-y-3.5 text-sm">
            <div className="flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Up to <strong>3 Active Menu Items</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Standard Menu Catalog Listing</span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct Customer Order Management</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground line-through">
              <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Featured Homepage Placement</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground line-through">
              <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Verified Artisan Premium Badge</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground line-through">
              <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Unlimited Active Menu Items</span>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0">
            <Button
              variant="outline"
              disabled
              className="w-full rounded-xl font-bold py-5 text-sm"
            >
              {!isPremium ? "Current Plan" : "Downgrade on Expiry"}
            </Button>
          </CardFooter>
        </Card>

        {/* PREMIUM PLAN */}
        <Card
          className={`rounded-3xl border transition-all relative overflow-hidden ${
            isPremium
              ? "border-amber-500 shadow-lg ring-2 ring-amber-500/20 bg-card"
              : "border-primary shadow-xl ring-2 ring-primary/20 bg-card"
          }`}
        >
          <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-orange-500 text-white text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-bl-2xl shadow-sm">
            Recommended
          </div>

          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-center mb-2">
              <Badge className="bg-amber-500 text-white font-bold gap-1">
                <Sparkles className="h-3 w-3" /> Artisan Pro
              </Badge>
            </div>
            <CardTitle className="text-2xl font-black font-heading text-foreground">
              Premium Partner
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground pt-1">
              For ambitious pizza chefs ready to dominate orders in their city.
            </CardDescription>
            <div className="pt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black font-heading text-primary">$29</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-4 space-y-3.5 text-sm">
            <div className="flex items-center gap-2.5 text-foreground font-semibold">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span><strong>Unlimited</strong> Active Menu Items</span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span><strong>Featured Homepage Showcase</strong> (Top ranking)</span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span><strong>"Premium" Verified Badge</strong> on cards</span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Direct Customer Order Management</span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>ImgBB High-Resolution Image CDN</span>
            </div>
            <div className="flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>24/7 Priority Support & Analytics</span>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0">
            {isPremium ? (
              <Button
                disabled
                className="w-full rounded-xl font-extrabold py-5 text-sm bg-emerald-600 text-white hover:bg-emerald-600 cursor-default"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Active Subscription
              </Button>
            ) : (
              <Button
                onClick={handleUpgrade}
                disabled={upgrading || loading}
                className="w-full rounded-xl font-extrabold py-5 text-sm shadow-md gap-2 cursor-pointer"
              >
                {upgrading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Upgrade to Premium Now</span>
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
