import getFeaturedRooms from "@/lib/api/getFeaturedRooms";
import RoomCard from "../shared/RoomCard";
import type { Space } from "@/types/space";

const FEATURED_COUNT = 8;

export default async function FeaturedRooms() {
  const featuredRooms: Space[] = await getFeaturedRooms(FEATURED_COUNT);

  return (
    <section className="bg-[var(--color-neutral-bg)] py-5 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Featured Spaces
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--color-neutral-text)] sm:text-4xl">
            Handpicked spaces our community loves
          </h2>
          <p className="mt-4 text-slate-500">
            Top-rated coworking desks, meeting rooms, and event venues — ready to book by the
            hour, day, or month.
          </p>
        </div>

        {featuredRooms.length === 0 ? (
          <p className="mt-12 text-center text-sm text-slate-400">
            No featured spaces available right now — check back soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredRooms.map((room, index) => (
              <RoomCard key={room._id} room={room} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}