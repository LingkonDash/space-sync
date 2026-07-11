export default function RoomsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-[var(--color-neutral-border)] bg-white shadow-sm"
        >
          <div className="h-48 w-full animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
              <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}