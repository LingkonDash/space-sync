import RoomCard from "@/components/shared/RoomCard";
import type { Space } from "@/types/space";
import type { ExploreSearchParams } from "@/types/searchParams";
import PaginationControls from "./PaginationControls";
import { getRooms } from "@/lib/api/rooms";


interface RoomsBodyProps {
  queryString: string;
  currentParams: ExploreSearchParams;
}

export default async function RoomsBody({ queryString, currentParams }: RoomsBodyProps) {
  const rooms: Space[] = await getRooms(queryString);

  const currentPage = Number(currentParams.page) || 1;
  const hasNextPage = rooms.length === 12;

  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-neutral-border)] bg-white py-16 text-center shadow-sm">
        <p className="text-sm font-semibold text-[var(--color-neutral-text)]">
          No spaces match your filters
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your search, category, or price range.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rooms.map((room, index) => (
          <RoomCard key={room._id} room={room} index={index} />
        ))}
      </div>

      <PaginationControls currentPage={currentPage} hasNextPage={hasNextPage} />
    </div>
  );
}