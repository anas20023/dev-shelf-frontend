"use client";

import * as React from "react";
import { Resource, Category, Difficulty } from "@/lib/types";
import { ResourceCard } from "./resource-card";
import { ResourceListItem } from "./resource-list-item";
import { Pagination } from "@/components/common/pagination";
import { LayoutGrid, List, RotateCcw, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceGridProps {
  resources: Resource[];
  searchQuery?: string;
  category?: Category;
  onResetFilters?: () => void;
}

type SortOption = "stars" | "newest" | "title" | "difficulty";

export function ResourceGrid({
  resources,
  searchQuery = "",
  category = "All Categories",
  onResetFilters,
}: ResourceGridProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = React.useState<SortOption>("stars");
  const [difficultyFilter, setDifficultyFilter] = React.useState<Difficulty | "All">("All");

  const [prevFilter, setPrevFilter] = React.useState({
    searchQuery,
    category,
    difficultyFilter,
    sortBy,
  });

  // Reset to page 1 during render when search or filters change
  if (
    prevFilter.searchQuery !== searchQuery ||
    prevFilter.category !== category ||
    prevFilter.difficultyFilter !== difficultyFilter ||
    prevFilter.sortBy !== sortBy
  ) {
    setPrevFilter({ searchQuery, category, difficultyFilter, sortBy });
    setCurrentPage(1);
  }

  // Filter and sort resources
  const processedResources = React.useMemo(() => {
    const filtered = resources.filter((item) => {
      // Category match
      const matchesCategory =
        category === "All Categories" || item.category === category;

      // Difficulty match
      const matchesDifficulty =
        difficultyFilter === "All" || item.difficulty === difficultyFilter;

      // Query match (title, description, tags)
      const q = searchQuery.toLowerCase().trim();
      const matchesText = !q
        ? true
        : item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesDifficulty && matchesText;
    });

    // Sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === "stars") {
        return (b.stars || 0) - (a.stars || 0);
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "difficulty") {
        const order: Record<Difficulty, number> = {
          Beginner: 1,
          Intermediate: 2,
          Advanced: 3,
        };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });
  }, [resources, searchQuery, category, difficultyFilter, sortBy]);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Catalog Header & Adaptive Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border/70">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Curated Repositories &amp; Architecture Blueprints
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Showing <strong className="text-foreground">{processedResources.length}</strong> of{" "}
            <span className="font-mono">1,048,576</span> verified open-source items
            {category !== "All Categories" && ` in ${category}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Adaptive Controls: Difficulty pills, Sort selector, View Mode toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border bg-muted/30">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  difficultyFilter === diff
                    ? "bg-background text-foreground font-medium shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 pl-2">
            <ArrowUpDown className="size-3 text-muted-foreground hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort repositories"
              className="py-1 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="stars">Most Stars</option>
              <option value="newest">Newest First</option>
              <option value="difficulty">Difficulty</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-border bg-muted/30">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              title="Compact list view"
            >
              <List className="size-3.5" />
            </Button>
          </div>

          {/* Reset Filters button if any filter is active */}
          {(searchQuery || category !== "All Categories" || difficultyFilter !== "All") &&
            onResetFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDifficultyFilter("All");
                  onResetFilters();
                }}
                className="text-xs gap-1"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </Button>
            )}
        </div>
      </div>

      {/* Grid or List Display */}
      {processedResources.length > 0 ? (
        viewMode === "grid" ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {processedResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-2.5">
            {processedResources.map((resource) => (
              <ResourceListItem key={resource.id} resource={resource} />
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="mt-10 py-16 text-center border border-dashed border-border rounded-xl bg-muted/20 p-8">
          <h3 className="font-heading text-base font-semibold text-foreground">
            No indexed entries match your filter
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or clearing the difficulty filter.
          </p>
          {onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDifficultyFilter("All");
                onResetFilters();
              }}
              className="mt-4 gap-1.5"
            >
              <RotateCcw className="size-3" />
              <span>Clear filters</span>
            </Button>
          )}
        </div>
      )}

      {/* Pagination Shell */}
      <Pagination
        currentPage={currentPage}
        totalPages={50000}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </section>
  );
}

