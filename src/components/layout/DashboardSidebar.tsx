"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Pizza,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user as any;
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || "customer";

  // Enforce role-based dashboard access (URL manipulation guard)
  React.useEffect(() => {
    if (isPending || !session?.user) return;
    const userRole = (session.user as any)?.role || "customer";

    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      toast.error("Access Denied", {
        description: "You do not have administrative permissions to access the Admin Console.",
      });
      router.replace(userRole === "vendor" ? "/dashboard/vendor" : "/dashboard/customer");
    } else if (
      pathname.startsWith("/dashboard/vendor") &&
      userRole !== "vendor" &&
      userRole !== "admin"
    ) {
      toast.error("Access Denied", {
        description: "This portal is reserved for registered restaurant vendors.",
      });
      router.replace("/dashboard/customer");
    } else if (
      pathname.startsWith("/dashboard/customer") &&
      userRole === "vendor"
    ) {
      router.replace("/dashboard/vendor");
    }
  }, [pathname, session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/signin");
      router.refresh();
    } catch (err: any) {
      toast.error("Logout Failed", { description: err.message });
    }
  };

  // Build role-based navigation links
  const getNavLinks = () => {
    if (role === "admin") {
      return [
        { label: "Admin Console", href: "/dashboard/admin", icon: ShieldCheck },
        { label: "Browse Store", href: "/menu", icon: Pizza },
      ];
    }
    if (role === "vendor") {
      return [
        { label: "Kitchen Catalog", href: "/dashboard/vendor", icon: Store },
        { label: "Customer Orders", href: "/dashboard/vendor/orders", icon: ShoppingBag },
        { label: "Subscription & Plan", href: "/dashboard/vendor/subscription", icon: Sparkles },
        { label: "Public Menu", href: "/menu", icon: Pizza },
      ];
    }
    return [
      { label: "My Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
      { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
      { label: "Order Fresh Pizza", href: "/menu", icon: Pizza },
    ];
  };

  const navLinks = getNavLinks();

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      {/* Top Brand & Links */}
      <div className="space-y-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-colors group-hover:bg-primary/95">
            <Pizza className="h-5 w-5" />
          </div>
          <div>
            <span className="font-heading text-lg font-bold text-foreground flex items-center">
              Pizza<span className="text-primary">Hub</span>
            </span>
            <span className="text-[11px] font-medium text-muted-foreground capitalize block -mt-0.5">
              {role} portal
            </span>
          </div>
        </Link>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-muted-foreground")} />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card & Actions */}
      <div className="space-y-3 pt-6 border-t border-border">
        {/* Profile Settings Link */}
        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors",
            pathname === "/profile"
              ? "bg-muted text-foreground font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Profile Settings</span>
        </Link>

        {/* Theme and Logout row */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-xs text-muted-foreground font-medium">Theme</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-destructive hover:bg-destructive/10 text-xs font-bold gap-1.5 h-8 rounded-lg cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* User Card */}
        <div className="p-3 bg-card border border-border/80 rounded-2xl flex items-center gap-3 shadow-xs">
          <Avatar className="h-9 w-9 border border-border shrink-0">
            <AvatarImage src={user?.image} alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
              {user?.name ? user.name.slice(0, 2) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{user?.name || "Member"}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Badge
            variant={role === "admin" ? "destructive" : role === "vendor" ? "default" : "secondary"}
            className="text-[9px] px-1.5 py-0 capitalize font-bold"
          >
            {role}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col md:flex-row bg-background">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-border/80 bg-card/60 p-5 sticky top-20 h-[calc(100vh-5rem)]">
        <SidebarContent />
      </aside>

      {/* Mobile/Tablet Sticky Bar with Hamburger Sheet */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-20 z-30">
        <div className="flex items-center gap-2">
          <Badge
            variant={role === "admin" ? "destructive" : "secondary"}
            className="text-[10px] capitalize font-bold"
          >
            {role} Portal
          </Badge>
          <span className="text-xs font-bold text-foreground truncate max-w-[150px]">
            {user?.name}
          </span>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold h-9">
              <Menu className="h-4 w-4" />
              <span>Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-6">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
