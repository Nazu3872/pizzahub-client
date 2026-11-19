import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PizzaHub | Fresh & Artisanal Pizza Ordering & Delivery",
  description:
    "Order piping hot, authentic artisanal pizzas from top local pizzerias or join as a partner restaurant vendor.",
  keywords: [
    "pizza delivery",
    "artisan pizza",
    "order pizza online",
    "local pizzerias",
    "pizzahub",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontHeading.variable} ${fontBody.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
