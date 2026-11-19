"use client";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["vendor", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}
