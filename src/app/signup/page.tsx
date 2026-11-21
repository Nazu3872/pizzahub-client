"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Pizza,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Store,
  Upload,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { signUp, signIn } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [businessName, setBusinessName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate client password rules: min 6 chars, 1 uppercase, 1 lowercase
  const validatePassword = (pass: string): string | null => {
    if (pass.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must include at least one uppercase letter (A-Z).";
    if (!/[a-z]/.test(pass)) return "Password must include at least one lowercase letter (a-z).";
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", {
        description: "Profile image must be less than 5MB.",
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!name.trim()) {
      toast.error("Name Required", { description: "Please enter your full name." });
      return;
    }

    if (!email.trim()) {
      toast.error("Email Required", { description: "Please enter a valid email." });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error("Weak Password", { description: passwordError });
      return;
    }

    if (role === "vendor" && !businessName.trim()) {
      toast.error("Restaurant Name Required", {
        description: "Vendors must enter a business/restaurant name.",
      });
      return;
    }

    try {
      setLoading(true);
      let profileImageUrl = "";

      // Upload profile image via server-side /api/upload route if selected
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          profileImageUrl = uploadData.url;
        } else {
          toast.warning("Image Upload Notice", {
            description: uploadData.message || "Could not upload image, proceeding with registration.",
          });
        }
        setUploadingImage(false);
      }

      // Register with Better Auth
      const result = await signUp.email({
        email,
        password,
        name,
        image: profileImageUrl || undefined,
        // custom additional fields
        role: role,
        businessName: role === "vendor" ? businessName : undefined,
      } as any);

      if (result.error) {
        toast.error("Registration Failed", {
          description: result.error.message || "Failed to create account.",
        });
        setLoading(false);
        return;
      }

      toast.success("Account Created Successfully!", {
        description: `Welcome to PizzaHub as a ${role}!`,
      });

      // Role-based redirect
      if (role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
      router.refresh();
    } catch (err: any) {
      toast.error("Registration Error", {
        description: err.message || "An unexpected error occurred during sign up.",
      });
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg border-border/80 bg-card shadow-xs rounded-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs mb-2">
            <Pizza className="h-6 w-6 stroke-[2.2]" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">
            Join PizzaHub
          </CardTitle>
          <CardDescription className="text-sm">
            Create an account to order artisan pizzas or grow your restaurant business
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Account Role Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">I want to join as a:</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    role === "customer"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <User className="h-5 w-5 mb-1" />
                  <span className="text-sm">Customer</span>
                  <span className="text-[11px] font-normal opacity-75">Order Delicious Pizza</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    role === "vendor"
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Store className="h-5 w-5 mb-1" />
                  <span className="text-sm">Pizzeria Vendor</span>
                  <span className="text-[11px] font-normal opacity-75">Sell & Manage Menu</span>
                </button>
              </div>
            </div>

            {/* Vendor Business Name (Conditional) */}
            {role === "vendor" && (
              <div className="space-y-2 animate-in fade-in-50 duration-200">
                <Label htmlFor="businessName">Restaurant / Business Name *</Label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    placeholder="e.g. Bella Napoli Pizzeria"
                    className="pl-10"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required={role === "vendor"}
                  />
                </div>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 chars (1 upper, 1 lower)"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Must be at least 6 characters with at least 1 uppercase and 1 lowercase letter.
              </p>
            </div>

            {/* Optional Profile Image */}
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image (Optional)</Label>
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground border">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-5 text-base font-bold shadow-md gap-2"
              disabled={loading || uploadingImage}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Register Account</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-6 pb-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="ml-1.5 font-bold text-primary hover:underline"
          >
            Sign in here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
