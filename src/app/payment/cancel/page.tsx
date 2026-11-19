"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XCircle, ArrowLeft, Store, RefreshCw } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/signin?callbackURL=/payment/cancel");
    }
  }, [session, sessionLoading, router]);

  return (
    <PageContainer>
      <div className="max-w-xl mx-auto py-16">
        <div className="bg-card border border-border p-8 sm:p-12 rounded-3xl shadow-lg text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-muted-foreground border border-border shadow-inner">
            <XCircle className="h-10 w-10 text-muted-foreground stroke-[2]" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="font-bold">
              Checkout Cancelled
            </Badge>
            <h2 className="text-3xl font-black font-heading text-foreground">
              Upgrade Not Completed
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your Stripe checkout session was cancelled. No money was charged, and your account remains on the Free starter plan.
            </p>
          </div>

          <div className="p-4 bg-muted/40 rounded-2xl border border-border text-xs text-muted-foreground text-left space-y-1.5 max-w-md mx-auto">
            <p className="font-semibold text-foreground">What happens now?</p>
            <p>• You still have your existing menu items and active listings.</p>
            <p>• You can upgrade to Premium anytime to unlock unlimited capacity.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/vendor/subscription">
              <Button size="lg" className="rounded-xl font-bold gap-2 px-6 shadow-md w-full sm:w-auto">
                <RefreshCw className="h-4 w-4" />
                <span>Try Upgrading Again</span>
              </Button>
            </Link>
            <Link href="/dashboard/vendor">
              <Button variant="outline" size="lg" className="rounded-xl font-semibold gap-2 px-6 w-full sm:w-auto">
                <Store className="h-4 w-4" />
                <span>Vendor Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
