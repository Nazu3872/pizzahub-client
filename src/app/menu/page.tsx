"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Pizza,
  MapPin,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PizzaCard, PizzaItem } from "@/components/shared/PizzaCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
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

function MenuCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial filter values from URL query string
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [pizzas, setPizzas] = useState<PizzaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  // Synchronize state with URL query parameters
  const updateUrlParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([k, v]) => {
        if (!v || v === "all") {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      });
      router.replace(`/menu?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const fetchPizzas = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (category !== "all") query.set("category", category);
      if (location.trim()) query.set("location", location.trim());
      query.set("sort", sort);
      query.set("page", String(page));
      query.set("limit", "12");

      const res = await api.get(`/menu-items?${query.toString()}`, { skipAuth: true });
      if (res.success && res.data) {
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
  }, [search, category, location, sort, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPizzas();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchPizzas]);

  const handleCategoryClick = (cat: string) => {
    setCategory(cat);
    setPage(1);
    updateUrlParams({ category: cat, page: "1" });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
    updateUrlParams({ sort: newSort, page: "1" });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setLocation("");
    setSort("newest");
    setPage(1);
    router.replace("/menu");
  };

  const handleAddToCart = (pizza: PizzaItem) => {
    toast.success(`Added ${pizza.name} to cart!`, {
      description: "Ready to order hot & fresh.",
    });
  };

  const handleViewDetails = (pizza: PizzaItem) => {
    router.push(`/menu/${pizza.id}`);
  };

  return (
    <PageContainer>
      <SectionHeading
        badge="Artisan Kitchen Catalog"
        title="Browse Authentic Wood-Fired Pizzas"
        subtitle="Hand-tossed dough, imported Italian cheese, and organic herbs prepared fresh to order."
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
                updateUrlParams({ search: e.target.value, page: "1" });
              }}
            />
          </div>

          {/* Location Filter */}
          <div className="lg:col-span-3 relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by location (e.g. Gulshan)..."
              className="pl-10"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
                updateUrlParams({ location: e.target.value, page: "1" });
              }}
            />
          </div>

          {/* Sorting */}
          <div className="lg:col-span-3">
            <Select value={sort} onValueChange={handleSortChange}>
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
              className="w-full h-10 border-border"
              title="Reset Filters"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              category === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Items
          </button>
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                category === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Pizzas or Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col h-[430px] rounded-xl border border-border p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : pizzas.length === 0 ? (
        <EmptyState
          icon={<Pizza className="h-10 w-10 text-primary" />}
          title="No Pizzas Found in this Selection"
          description="We couldn't find any approved menu items matching your criteria. Try loosening your search filters."
          actionText="Clear All Filters"
          onAction={handleReset}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => {
                  const newPage = Math.max(1, page - 1);
                  setPage(newPage);
                  updateUrlParams({ page: String(newPage) });
                }}
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
                onClick={() => {
                  const newPage = Math.min(totalPages, page + 1);
                  setPage(newPage);
                  updateUrlParams({ page: String(newPage) });
                }}
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

export default function MenuCatalogPage() {
  return (
    <Suspense fallback={<PageContainer><div className="py-20 text-center text-sm text-muted-foreground">Loading menu catalog...</div></PageContainer>}>
      <MenuCatalogContent />
    </Suspense>
  );
}
