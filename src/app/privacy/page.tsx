import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto py-12 space-y-6">
        <h1 className="text-3xl font-extrabold font-heading text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          At PizzaHub, we value your privacy. This Privacy Policy describes how we collect, use, and protect your personal information when using our application.
        </p>

        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-xl font-bold font-heading text-foreground">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect your full name, email address, encrypted authentication hashes, delivery addresses, and optional profile avatars uploaded via ImgBB.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-xl font-bold font-heading text-foreground">2. Security and Data Protection</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All passwords are cryptographically hashed using Better Auth. Access tokens use asymmetric JWKS signature verification, and zero client trust is maintained across all sensitive endpoints.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-xl font-bold font-heading text-foreground">3. Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For any inquiries, contact our security and support desk at <strong className="text-foreground">nazmunnahar.codeware@gmail.com</strong>.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
