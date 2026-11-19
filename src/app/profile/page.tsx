"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  User,
  Mail,
  Store,
  Upload,
  Lock,
  Loader2,
  CheckCircle2,
  Shield,
  Sparkles,
  Camera,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user as any;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/signin?callbackURL=/profile");
      return;
    }

    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
      setBusinessName(user.businessName || "");
    }
  }, [session, sessionLoading, user, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please select an image file (PNG, JPG, WEBP)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Image size must be less than 5MB." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
        toast.success("Image uploaded successfully via ImgBB!");
      } else {
        toast.error("Upload failed", { description: data.error || "Could not upload image." });
      }
    } catch (err: any) {
      toast.error("Upload error", { description: err.message || "Failed to reach upload server." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name required", { description: "Name must be at least 2 characters." });
      return;
    }

    const payload: any = {
      name: name.trim(),
      image: image.trim(),
    };

    if (user?.role === "vendor") {
      payload.businessName = businessName.trim();
    }

    setIsSaving(true);
    try {
      const res = await api.patch("/api/users/profile", payload);
      if (res.success) {
        toast.success("Profile Updated Successfully!", {
          description: "Your updated profile information is now saved.",
        });
        router.refresh();
      } else {
        toast.error("Update Failed", { description: res.message || "Could not save profile." });
      }
    } catch (err: any) {
      toast.error("Update Error", { description: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  const role = user?.role || "customer";

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-heading text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal profile, contact information, and public artisan kitchen branding.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card className="rounded-3xl border border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/80 p-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-md">
                    <AvatarImage src={image} alt={name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl uppercase">
                      {name ? name.slice(0, 2) : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <label
                    htmlFor="profile-image-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                    title="Change Profile Photo"
                  >
                    <Camera className="h-6 w-6" />
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading || isSaving}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold font-heading text-foreground">{name || "User Profile"}</h3>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={role === "admin" ? "destructive" : role === "vendor" ? "default" : "secondary"}
                      className="text-[10px] capitalize font-bold"
                    >
                      {role}
                    </Badge>
                    {user?.subscriptionPlan === "premium" && (
                      <Badge className="bg-amber-500 text-white font-bold text-[10px] gap-1">
                        <Sparkles className="h-2.5 w-2.5" /> Premium Partner
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="mt-3 flex items-center gap-2 text-xs text-primary font-semibold">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading photo to ImgBB...</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Full Name</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="rounded-xl font-medium"
                />
              </div>

              {/* Email (Read-Only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-xs font-bold flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Email Address</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Cannot be changed
                  </span>
                </div>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="rounded-xl bg-muted/50 cursor-not-allowed font-medium text-muted-foreground"
                />
              </div>

              {/* Vendor Business Name */}
              {role === "vendor" && (
                <div className="space-y-1.5 pt-1">
                  <Label htmlFor="businessName" className="text-xs font-bold flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-secondary" />
                    <span>Pizzeria / Business Name</span>
                  </Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Napoli Fire Kitchen"
                    className="rounded-xl font-medium"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This brand name appears on your public pizzas and order confirmations.
                  </p>
                </div>
              )}

              {/* Avatar Image URL (optional direct input or ImgBB file upload) */}
              <div className="space-y-1.5 pt-1">
                <Label htmlFor="imageUrl" className="text-xs font-bold flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Avatar Image URL</span>
                </Label>
                <Input
                  id="imageUrl"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://... or click avatar photo to upload"
                  className="rounded-xl text-xs font-mono"
                />
              </div>

              {/* Security notice */}
              <div className="p-3 bg-muted/40 rounded-xl border border-border text-[11px] text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Privilege changes (role, billing, account status) are strictly secured on the server with field whitelisting.</span>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || isUploading}
                className="rounded-xl font-bold gap-2 shadow-md cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
}
