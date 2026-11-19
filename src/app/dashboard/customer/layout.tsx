"use client";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}
