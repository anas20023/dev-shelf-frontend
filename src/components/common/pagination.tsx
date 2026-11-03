"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage = 1,
  totalPages = 50000,
  onPageChange,
}: PaginationProps) {
  const handlePage = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <nav
      aria-label="Resources pagination"
      className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/70 pt-6"
    >
      {/* Mobile Page indicator */}
      <div className="text-xs text-muted-foreground order-2 sm:order-1 font-mono">
        Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages.toLocaleString()}</span>
      </div>

      {/* Button controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* First */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePage(1)}
          disabled={currentPage <= 1}
          aria-label="Go to first page"
          className="hidden sm:inline-flex"
        >
          <ChevronsLeft className="size-3.5" />
        </Button>

        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden xs:inline">Prev</span>
        </Button>

        {/* Page 1 */}
        <Button
          variant={currentPage === 1 ? "default" : "outline"}
          size="icon-sm"
          onClick={() => handlePage(1)}
          aria-current={currentPage === 1 ? "page" : undefined}
          className="font-mono text-xs"
        >
          1
        </Button>

        {/* Page 2 */}
        <Button
          variant={currentPage === 2 ? "default" : "outline"}
          size="icon-sm"
          onClick={() => handlePage(2)}
          aria-current={currentPage === 2 ? "page" : undefined}
          className="font-mono text-xs"
        >
          2
        </Button>

        {/* Page 3 */}
        <Button
          variant={currentPage === 3 ? "default" : "outline"}
          size="icon-sm"
          onClick={() => handlePage(3)}
          aria-current={currentPage === 3 ? "page" : undefined}
          className="font-mono text-xs"
        >
          3
        </Button>

        <span
          aria-hidden="true"
          className="size-7 flex items-center justify-center text-xs text-muted-foreground select-none font-mono"
        >
          ...
        </span>

        {/* Last Page (50,000) */}
        <Button
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePage(totalPages)}
          aria-current={currentPage === totalPages ? "page" : undefined}
          aria-label={`Go to page ${totalPages}`}
          className="font-mono text-xs px-2"
        >
          {totalPages.toLocaleString()}
        </Button>

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="size-3.5" />
        </Button>

        {/* Last */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handlePage(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Go to last page"
          className="hidden sm:inline-flex"
        >
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    </nav>
  );
}

