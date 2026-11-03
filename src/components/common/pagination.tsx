"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CornerDownLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const [jumpPage, setJumpPage] = React.useState("");
  const [showJumpInput, setShowJumpInput] = React.useState(false);

  const safeCurrentPage = Math.max(1, currentPage || 1);
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeTotalCount = totalCount || 0;

  const handlePage = (page: number) => {
    if (page >= 1 && page <= safeTotalPages && page !== safeCurrentPage && onPageChange) {
      onPageChange(page);
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPage, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= safeTotalPages) {
      handlePage(parsed);
      setShowJumpInput(false);
      setJumpPage("");
    }
  };

  // Generate pagination items with sliding window
  const getPageNumbers = (): (number | "ellipsis-left" | "ellipsis-right")[] => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-right", safeTotalPages];
    }

    if (safeCurrentPage >= safeTotalPages - 3) {
      return [
        1,
        "ellipsis-left",
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      "ellipsis-left",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "ellipsis-right",
      safeTotalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Resources server pagination"
      className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/70 pt-6"
    >
      {/* Page indicator & Total records */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground order-2 md:order-1 font-mono">
        <div>
          Page <strong className="text-foreground">{safeCurrentPage.toLocaleString()}</strong> of{" "}
          <strong className="text-foreground">{safeTotalPages.toLocaleString()}</strong>
        </div>
        <span className="text-border">|</span>
        <div className="hidden sm:inline">
          <strong className="text-foreground">{safeTotalCount.toLocaleString()}</strong> records
        </div>
      </div>

      {/* Button controls */}
      <div className="flex flex-wrap items-center justify-center gap-1 order-1 md:order-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePage(1)}
          disabled={safeCurrentPage <= 1 || isLoading}
          aria-label="Go to first page"
          title="First page"
          className="hidden sm:inline-flex"
        >
          <ChevronsLeft className="size-3.5" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePage(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1 || isLoading}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden xs:inline">Prev</span>
        </Button>

        {/* Dynamic Page Numbers */}
        {pages.map((item, idx) => {
          if (item === "ellipsis-left" || item === "ellipsis-right") {
            return (
              <button
                key={`${item}-${idx}`}
                type="button"
                onClick={() => setShowJumpInput((prev) => !prev)}
                title="Click to jump to page"
                className="size-7 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground select-none font-mono transition-colors rounded hover:bg-muted"
                aria-label="Jump to page"
              >
                ...
              </button>
            );
          }

          const pageNum = Number(item);
          const isCurrent = pageNum === safeCurrentPage;
          return (
            <Button
              key={pageNum}
              variant={isCurrent ? "default" : "outline"}
              size="icon-sm"
              onClick={() => handlePage(pageNum)}
              disabled={isLoading}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Go to page ${pageNum}`}
              className="font-mono text-xs"
            >
              {pageNum.toLocaleString()}
            </Button>
          );
        })}

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePage(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages || isLoading}
          aria-label="Go to next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="size-3.5" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePage(safeTotalPages)}
          disabled={safeCurrentPage >= safeTotalPages || isLoading}
          aria-label="Go to last page"
          title="Last page"
          className="hidden sm:inline-flex"
        >
          <ChevronsRight className="size-3.5" />
        </Button>

        {/* Quick Jump Input Toggle / Form */}
        {showJumpInput ? (
          <form onSubmit={handleJumpSubmit} className="inline-flex items-center gap-1 ml-2">
            <input
              type="number"
              min={1}
              max={safeTotalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder={`1-${safeTotalPages}`}
              autoFocus
              className="w-20 px-2 py-1 text-xs font-mono bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button type="submit" size="icon-xs" variant="secondary" title="Jump">
              <CornerDownLeft className="size-3" />
            </Button>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setShowJumpInput(true)}
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground hidden lg:inline-flex ml-1"
          >
            Jump
          </Button>
        )}
      </div>
    </nav>
  );
}
