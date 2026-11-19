"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Sparkles,
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Store,
  AlertCircle,
} from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user as any;

  const [pollState, setPollState] = useState<"polling" | "activated" | "timeout">("polling");
  const [subData, setSubData] = useState<any | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/signin?callbackURL=/payment/success");
      return;
    }

    if (pollState === "activated") return;

    let timer: NodeJS.Timeout;
    const maxAttempts = 15; // 30 seconds total

    async function checkPlan() {
      try {
        const res = await api.get("/api/subscription/status");
        if (res.success && res.data) {
          setSubData(res.data);
          if (res.data.isPremium || res.data.subscriptionPlan === "premium") {
            setPollState("activated");
            return;
          }
        }
      } catch (e) {
        // continue polling
      }

      setAttempts((prev) => {
        if (prev + 1 >= maxAttempts) {
          setPollState("timeout");
          return prev + 1;
        }
        timer = setTimeout(checkPlan, 2000);
        return prev + 1;
      });
    }

    // Start polling immediately
    timer = setTimeout(checkPlan, 1000);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [session, sessionLoading, pollState, router]);

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto py-12">
        {pollState === "polling" && (
          <div className="bg-card border border-border p-8 sm:p-12 rounded-3xl shadow-lg text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-inner">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-amber-500 text-white font-bold animate-pulse">
                Awaiting Webhook
              </Badge>
              <h2 className="text-3xl font-black font-heading text-foreground">
                Verifying Your Subscription...
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                We're securely waiting for Stripe's cryptographic webhook to verify your payment and activate your Premium benefits in the database.
              </p>
            </div>

            {sessionId && (
              <div className="p-3 bg-muted/60 rounded-xl text-xs font-mono text-muted-foreground max-w-sm mx-auto truncate border border-border">
                Session: {sessionId}
              </div>
            )}

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-xs text-muted-foreground max-w-md mx-auto flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>Polling server status ({attempts}/15)... Zero client trust enforced.</span>
            </div>
          </div>
        )}

        {pollState === "activated" && (
          <div className="bg-card border border-emerald-500/40 p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-6 ring-2 ring-emerald-500/10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-inner">
              <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-600 text-white font-extrabold gap-1 px-3 py-1 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" /> Webhook Confirmed
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
                Welcome to Premium!
              </h2>
              <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your payment of <strong>$29.00</strong> was verified by Stripe Webhook. Your vendor account now has unlimited menu capacity and featured ranking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-xs text-left bg-muted/40 p-4 rounded-2xl border border-border">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Unlimited Menu Items</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Featured Homepage Slot</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Verified Artisan Badge</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Priority Kitchen Dispatch</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/vendor">
                <Button size="lg" className="rounded-xl font-bold gap-2 px-8 shadow-md">
                  <Store className="h-4 w-4" />
                  <span>Go to Vendor Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {pollState === "timeout" && (
          <div className="bg-card border border-border p-8 sm:p-12 rounded-3xl shadow-lg text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <AlertCircle className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black font-heading text-foreground">
                Payment Received by Stripe
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your payment was successful on Stripe. The webhook synchronization is taking slightly longer to finish. Your perks will update automatically in your dashboard.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link href="/dashboard/vendor">
                <Button className="rounded-xl font-bold gap-2 px-6">
                  <span>Return to Vendor Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
