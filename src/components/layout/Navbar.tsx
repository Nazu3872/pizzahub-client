"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Pizza,
  ShoppingBag,
  Menu,
  User,
  Store,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore Pizzas", href: "/pizzas" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Partner with Us", href: "/partner" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Live session state from Better Auth
  const { data: session, isPending } = useSession();
  const user = session?.user as any;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully", {
        description: "Come back soon for more fresh pizza!",
      });
      router.push("/signin");
      router.refresh();
    } catch (err: any) {
      toast.error("Logout Error", {
        description: err.message || "Could not complete sign out.",
      });
    }
  };

  const getDashboardHref = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "vendor") return "/dashboard/vendor";
    return "/dashboard/customer";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-card/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 text-white shadow-md shadow-primary/20">
            <Pizza className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-2xl font-black tracking-tight text-foreground flex items-center">
              Pizza<span className="text-primary">Hub</span>
              <span className="ml-1 h-2 w-2 rounded-full bg-secondary inline-block animate-pulse" />
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase -mt-1">
              Fresh & Artisanal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150",
                  isActive
                    ? "bg-accent text-primary shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Cart Icon */}
          <Link href="/cart">
            <Button
              variant="outline"
              size="icon"
              className="relative h-10 w-10 rounded-lg border-border hover:border-primary/50"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground shadow">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Profile / Auth State */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-1.5 h-auto rounded-full hover:bg-accent cursor-pointer"
                >
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.image} alt={user.name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                      {user.name ? user.name.slice(0, 2) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline text-xs font-bold text-foreground max-w-[100px] truncate">
                    {user.name || "My Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2 shadow-xl">
                <DropdownMenuLabel className="p-2">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold leading-none text-foreground truncate">
                        {user.name}
                      </p>
                      <Badge
                        variant={user.role === "admin" ? "destructive" : "secondary"}
                        className="text-[10px] capitalize font-bold px-1.5 py-0"
                      >
                        {user.role || "customer"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href={getDashboardHref()}
                    className="cursor-pointer font-medium py-2 flex items-center gap-2.5 text-sm"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                {user.role === "customer" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/customer/orders"
                      className="cursor-pointer font-medium py-2 flex items-center gap-2.5 text-sm"
                    >
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                {user.role === "vendor" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/vendor/orders"
                        className="cursor-pointer font-medium py-2 flex items-center gap-2.5 text-sm"
                      >
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        <span>Customer Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/vendor/subscription"
                        className="cursor-pointer font-medium py-2 flex items-center gap-2.5 text-sm"
                      >
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>Subscription Plan</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="cursor-pointer font-medium py-2 flex items-center gap-2.5 text-sm"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer font-medium py-2 text-destructive flex items-center gap-2.5 text-sm focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/signin">
                <Button variant="ghost" size="sm" className="font-semibold text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="font-semibold text-xs rounded-lg shadow-xs">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10 text-foreground"
                aria-label="Toggle Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between"
            >
              <div>
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                      <Pizza className="h-5 w-5" />
                    </div>
                    <span className="font-heading text-xl font-bold">PizzaHub</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all",
                          isActive
                            ? "bg-accent text-primary font-bold"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                          {user.name ? user.name.slice(0, 2) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-foreground truncate">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setMobileOpen(false)}
                      className="w-full block"
                    >
                      <Button className="w-full justify-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Go to Dashboard</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                      className="w-full justify-center text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={() => setMobileOpen(false)}
                      className="w-full block"
                    >
                      <Button variant="outline" className="w-full justify-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="w-full block"
                    >
                      <Button className="w-full justify-center">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
