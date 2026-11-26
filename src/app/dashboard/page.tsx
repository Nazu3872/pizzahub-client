"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function DashboardRootPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/signin?callbackURL=/dashboard");
      return;
    }
    const role = (session.user as any)?.role;
    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "vendor") {
      router.replace("/dashboard/vendor");
    } else {
      router.replace("/dashboard/customer");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}
