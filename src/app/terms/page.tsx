import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";

export default function TermsPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto py-12 space-y-6">
        <h1 className="text-3xl font-extrabold font-heading text-foreground">Terms of Service</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Welcome to PizzaHub. By accessing or using our pizza ordering and vendor platform, you agree to be bound by these Terms of Service.
        </p>

        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-xl font-bold font-heading text-foreground">1. User Accounts and Roles</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Users may register as Customers or Partner Vendors. Role elevation to Administrator is restricted and strictly enforced on the server. You are responsible for safeguarding your account credentials.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-xl font-bold font-heading text-foreground">2. Ordering and Delivery</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All customer pizza payments are currently simulated for demonstration and hiring evaluation purposes. Vendors prepare and fulfill orders according to scheduled delivery dates.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-xl font-bold font-heading text-foreground">3. Vendor Subscriptions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Vendor Premium plans are billed via Stripe at \$29.00 USD/month. Subscriptions unlock unlimited active menu listings and featured placement upon cryptographic webhook confirmation.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
