"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiSearch, FiChevronDown } from "react-icons/fi";

// ─── CONFIG — edit these to change what's filterable, no other code changes needed ──
const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "Co-working", label: "Co-working" },
  { value: "Meeting Room", label: "Meeting Room" },
  { value: "Event Hall", label: "Event Hall" },
  { value: "Studio", label: "Studio" },
] as const;

const CITY_OPTIONS = [
  { value: "", label: "All Cities" },
  { value: "Dhaka", label: "Dhaka" },
  { value: "Chattogram", label: "Chattogram" },
  { value: "Sylhet", label: "Sylhet" },
  { value: "Khulna", label: "Khulna" },
] as const;

const PRICE_OPTIONS = [
  { value: "", label: "Any Price", minPrice: "", maxPrice: "" },
  { value: "0-20", label: "Under ৳20/hr", minPrice: "0", maxPrice: "20" },
  { value: "20-50", label: "৳20 – ৳50/hr", minPrice: "20", maxPrice: "50" },
  { value: "50-100", label: "৳50 – ৳100/hr", minPrice: "50", maxPrice: "100" },
  { value: "100+", label: "৳100+/hr", minPrice: "100", maxPrice: "" },
] as const;

const CAPACITY_OPTIONS = [
  { value: "", label: "Any Capacity" },
  { value: "1", label: "1+ people" },
  { value: "5", label: "5+ people" },
  { value: "15", label: "15+ people" },
  { value: "30", label: "30+ people" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;
// ────────────────────────────────────────────────────────────────────────────────────

export default function SearchAndFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState<string>(searchParams.get("search") ?? "");

  // Debounce search input so we don't hit the server on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ search: search || undefined, page: undefined });
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    // Any filter change resets pagination back to page 1
    if (!("page" in updates)) params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handlePriceChange(value: string) {
    const preset = PRICE_OPTIONS.find((option) => option.value === value);
    updateParams({
      priceRange: value || undefined,
      minPrice: preset?.minPrice || undefined,
      maxPrice: preset?.maxPrice || undefined,
    });
  }

  return (
    <div className="rounded-2xl border border-[var(--color-neutral-border)] bg-white p-4 shadow-sm sm:p-5">
      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-neutral-border)] bg-[var(--color-neutral-bg)] px-4 py-3">
        <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or location..."
          className="w-full bg-transparent text-sm text-[var(--color-neutral-text)] outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Filter row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <FilterSelect
          label="Category"
          value={searchParams.get("category") ?? ""}
          options={CATEGORY_OPTIONS}
          onChange={(value) => updateParams({ category: value || undefined })}
        />
        <FilterSelect
          label="City"
          value={searchParams.get("city") ?? ""}
          options={CITY_OPTIONS}
          onChange={(value) => updateParams({ city: value || undefined })}
        />
        <FilterSelect
          label="Price"
          value={searchParams.get("priceRange") ?? ""}
          options={PRICE_OPTIONS}
          onChange={handlePriceChange}
        />
        <FilterSelect
          label="Capacity"
          value={searchParams.get("minCapacity") ?? ""}
          options={CAPACITY_OPTIONS}
          onChange={(value) => updateParams({ minCapacity: value || undefined })}
        />
        <FilterSelect
          label="Sort By"
          value={searchParams.get("sort") ?? "newest"}
          options={SORT_OPTIONS}
          onChange={(value) => updateParams({ sort: value || undefined })}
        />
      </div>
    </div>
  );
}

// ─── Shared select field ─────────────────────────────────────────────────────
interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly FilterOption[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <div className="relative mt-1.5">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[var(--color-neutral-border)] bg-white px-3 py-2.5 pr-8 text-sm text-[var(--color-neutral-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}