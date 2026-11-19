"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  SlidersHorizontal,
  Pizza,
  MapPin,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/api";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PizzaCard, PizzaItem } from "@/components/shared/PizzaCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/PageLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MENU_CATEGORIES } from "@/components/vendor/AddMenuItemDialog";

export default function PizzasCatalogPage() {
  const router = useRouter();

  const [pizzas, setPizzas] = useState<PizzaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPizzas = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.set("search", search.trim());
      if (selectedCategory !== "all") queryParams.set("category", selectedCategory);
      if (selectedLocation.trim()) queryParams.set("location", selectedLocation.trim());
      queryParams.set("sort", sort);
      queryParams.set("page", String(page));
      queryParams.set("limit", "12");

      const res = await api.get(`/menu-items?${queryParams.toString()}`, { skipAuth: true });
      if (res.success && res.data) {
        // Map backend schema to PizzaItem
        const mapped: PizzaItem[] = res.data.map((item: any) => ({
          id: item.id || item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          image: item.images?.[0] || "",
          category: item.category,
          restaurantName: item.vendorName || "Artisan Kitchen",
          rating: 4.9,
          prepTimeMinutes: 20,
        }));
        setPizzas(mapped);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
        }
      }
    } catch (err: any) {
      toast.error("Failed to Load Menu", {
        description: err.message || "Could not retrieve artisan pizzas.",
      });
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedLocation, sort, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPizzas();
    }, 250); // Debounce search input
    return () => clearTimeout(timer);
  }, [fetchPizzas]);

  const handleAddToCart = (pizza: PizzaItem) => {
    toast.success(`Added ${pizza.name} to cart!`, {
      description: "Proceed to checkout whenever you're ready.",
    });
  };

  const handleViewDetails = (pizza: PizzaItem) => {
    router.push(`/menu/${pizza.id}`);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedLocation("");
    setSort("newest");
    setPage(1);
  };

  return (
    <PageContainer>
      {/* Title Header */}
      <SectionHeading
        badge="Artisan Catalog"
        title="Explore Handcrafted Pizzas"
        subtitle="Discover fresh authentic pizzas from local wood-fired kitchens. Filter by category, price, or location."
      />

      {/* Filter and Search Bar */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by pizza name..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Location Filter */}
          <div className="lg:col-span-3 relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by city/area..."
              className="pl-10"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Sorting */}
          <div className="lg:col-span-3">
            <Select value={sort} onValueChange={(val) => { setSort(val); setPage(1); }}>
              <SelectTrigger>
                <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          <div className="lg:col-span-1 flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="w-full h-10"
              title="Reset Filters"
              onClick={handleResetFilters}
            >
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => { setSelectedCategory("all"); setPage(1); }}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            All Items
          </button>
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Pizzas */}
      {loading ? (
        <PageLoader message="Finding fresh artisanal pizzas..." />
      ) : pizzas.length === 0 ? (
        <EmptyState
          icon={<Pizza className="h-8 w-8 text-primary" />}
          title="No Pizzas Match Your Filter"
          description="Try clearing your search terms or choosing a different category to see more delicious options."
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pizzas.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm font-semibold text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
