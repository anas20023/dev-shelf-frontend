"use client";

import * as React from "react";
import { Resource, Category } from "@/lib/types";
import { SearchSection } from "./search-section";
import { ResourceGrid } from "./resource-grid";

interface DevShelfDashboardProps {
  initialResources: Resource[];
}

export function DevShelfDashboard({ initialResources }: DevShelfDashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [category, setCategory] = React.useState<Category>("All Categories");

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategory("All Categories");
  };

  const handleQuickTagSelect = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <>
      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        onQuickTagSelect={handleQuickTagSelect}
      />
      <ResourceGrid
        resources={initialResources}
        searchQuery={searchQuery}
        category={category}
        onResetFilters={handleResetFilters}
      />
    </>
  );
}

