"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Resource, Category, Difficulty, SortOption } from "@/lib/types";
import { SearchSection } from "./search-section";
import { ResourceGrid } from "./resource-grid";

interface DevShelfDashboardProps {
  resources: Resource[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  initialQuery?: string;
  initialCategory?: Category;
  initialDifficulty?: Difficulty | "All";
  initialSort?: SortOption;
  initialView?: "grid" | "list";
}

export function DevShelfDashboard({
  resources,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  initialQuery = "",
  initialCategory = "All Categories",
  initialDifficulty = "All",
  initialSort = "stars",
  initialView = "grid",
}: DevShelfDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // Helper to build new query strings
  const updateQueryParams = React.useCallback(
    (updates: Record<string, string | number | null>, shouldScroll: boolean = false) => {
      const current = new URLSearchParams(searchParams?.toString() ?? "");

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "All Categories" || value === "All") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      // If page is 1, keep URL clean by removing page=1
      if (current.get("page") === "1") {
        current.delete("page");
      }

      const queryString = current.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.push(targetUrl, { scroll: shouldScroll });
      });

      if (shouldScroll) {
        const catalogEl = document.getElementById("catalog");
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [router, pathname, searchParams]
  );

  const handleSearchChange = (query: string) => {
    updateQueryParams({ q: query || null, page: 1 });
  };

  const handleCategoryChange = (cat: Category) => {
    updateQueryParams({ category: cat === "All Categories" ? null : cat, page: 1 });
  };

  const handleDifficultyChange = (diff: Difficulty | "All") => {
    updateQueryParams({ difficulty: diff === "All" ? null : diff, page: 1 });
  };

  const handleSortChange = (sort: SortOption) => {
    updateQueryParams({ sort: sort === "stars" ? null : sort, page: 1 });
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    updateQueryParams({ view: mode === "grid" ? null : mode }, false);
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page }, true);
  };

  const handleResetFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const handleQuickTagSelect = (tag: string) => {
    updateQueryParams({ q: tag, page: 1 });
  };

  return (
    <>
      <SearchSection
        searchQuery={initialQuery}
        onSearchChange={handleSearchChange}
        category={initialCategory}
        onCategoryChange={handleCategoryChange}
        onQuickTagSelect={handleQuickTagSelect}
      />
      <ResourceGrid
        resources={resources}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        searchQuery={initialQuery}
        category={initialCategory}
        difficulty={initialDifficulty}
        sortBy={initialSort}
        viewMode={initialView}
        isPending={isPending}
        onPageChange={handlePageChange}
        onDifficultyChange={handleDifficultyChange}
        onSortChange={handleSortChange}
        onViewModeChange={handleViewModeChange}
        onResetFilters={handleResetFilters}
      />
    </>
  );
}
