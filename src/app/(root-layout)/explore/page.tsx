import { Suspense } from "react";
import getRooms from "@/lib/api/rooms";
import SearchAndFilter from "@/components/explore/SearchAndFilter";
import RoomsBody from "@/components/explore/RoomsBody";
import RoomsSkeleton from "@/components/explore/RoomsSkeleton";
import type { ExploreSearchParams } from "@/types/searchParams";

interface ExplorePageProps {
  searchParams: Promise<ExploreSearchParams>;
}

function buildQueryString(params: ExploreSearchParams): string {
  const usp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    const singleValue = Array.isArray(value) ? value[0] : value;
    if (singleValue) usp.set(key, singleValue);
  });

  return usp.toString();
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const queryString = buildQueryString(resolvedParams);

  return (
    <main className="min-h-screen bg-[var(--color-neutral-bg)] pb-14 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Explore Spaces
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-[var(--color-neutral-text)] sm:text-4xl">
            Find your next workspace
          </h1>
          <p className="mt-3 text-slate-500">
            Search and filter through verified coworking desks, meeting rooms, event halls, and
            studios.
          </p>
        </div>

        <div className="mt-8">
          <SearchAndFilter />
        </div>

        <div className="mt-10">
          <Suspense key={queryString} fallback={<RoomsSkeleton />}>
            <RoomsBody queryString={queryString} currentParams={resolvedParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}