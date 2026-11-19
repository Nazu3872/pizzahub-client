"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { PageLoader } from "./PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "vendor" | "customer")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user as any;

  useEffect(() => {
    // Wait until session finishes loading before making any redirect decisions
    if (isPending) return;

    // 1. Unauthenticated -> redirect to /signin with callback
    if (!session || !user) {
      const returnUrl = encodeURIComponent(pathname || "/");
      router.replace(`/signin?callbackURL=${returnUrl}`);
      return;
    }

    // 2. Blocked User Check
    if (user.isBlocked) {
      toast.error("Account Suspended", {
        description: "Your account has been deactivated. Please contact support.",
      });
      router.replace("/signin");
      return;
    }

    // 3. Role-based check (protect against URL tampering)
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = user.role || "customer";
      if (!allowedRoles.includes(userRole)) {
        toast.warning("Access Restricted", {
          description: `You do not have permission to view this portal. Redirecting to your dashboard...`,
        });

        if (userRole === "admin") {
          router.replace("/dashboard/admin");
        } else if (userRole === "vendor") {
          router.replace("/dashboard/vendor");
        } else {
          router.replace("/dashboard/customer");
        }
      }
    }
  }, [isPending, session, user, router, pathname, allowedRoles]);

  // While session is loading, show page loader (DO NOT redirect to login!)
  if (isPending) {
    return <PageLoader message="Verifying secure credentials..." />;
  }

  // If not logged in or role unauthorized, render loader while redirect takes place
  if (!session || !user) {
    return <PageLoader message="Redirecting to Sign In..." />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <PageLoader message="Redirecting to authorized dashboard..." />;
  }

  return <>{children}</>;
}
