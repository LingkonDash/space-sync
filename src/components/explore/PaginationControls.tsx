"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationControlsProps {
  currentPage: number;
  hasNextPage: boolean;
}

export default function PaginationControls({ currentPage, hasNextPage }: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (currentPage === 1 && !hasNextPage) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1.5 rounded-xl border border-[var(--color-neutral-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-neutral-text)] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <span className="text-sm font-medium text-slate-500">Page {currentPage}</span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center gap-1.5 rounded-xl border border-[var(--color-neutral-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-neutral-text)] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}