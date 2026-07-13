import Image from "next/image";
import { getUserBookings } from "@/lib/action/bookings";
import { LiaCalendarDaySolid } from "react-icons/lia";
import { CgLock } from "react-icons/cg";
import { BiMapPin } from "react-icons/bi";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface UserBooking {
  _id: string;
  spaceId: string;
  spaceTitle: string;
  spaceImages: string[];
  userId: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: string | number;
  status: BookingStatus;
  createdAt: string | Date;
}

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-[#F59E0B]/15 text-[#F59E0B]",
  confirmed: "bg-[#4F46E5]/15 text-[#4F46E5]",
  completed: "bg-[#0D9488]/15 text-[#0D9488]",
  cancelled: "bg-red-500/10 text-red-600",
};

async function UserBookingsPage() {
  const userBookings: UserBooking[] = await getUserBookings();

  return (
    <div className="min-h-screen bg-neutral-bg px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-text sm:text-2xl">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-neutral-text/60">
            {userBookings.length} booking{userBookings.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {userBookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-border bg-neutral-bg">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-text/50">
                      Space
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-text/50">
                      Date
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-text/50">
                      Time
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-text/50">
                      Price
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-text/50">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings.map((booking, i) => (
                    <BookingRow
                      key={booking._id}
                      booking={booking}
                      isLast={i === userBookings.length - 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* scroll hint, mobile only */}
            <div className="border-t border-neutral-border bg-neutral-bg px-5 py-2 text-center text-xs text-neutral-text/40 sm:hidden">
              Swipe left/right to see more →
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingRow({ booking, isLast }: { booking: UserBooking; isLast: boolean }) {
  const price = Number(booking.totalPrice);
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <tr
      className={`transition hover:bg-neutral-bg/60 ${!isLast ? "border-b border-neutral-border" : ""}`}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-bg">
            {booking.spaceImages?.[0] ? (
              <Image
                src={booking.spaceImages[0]}
                alt={booking.spaceTitle}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-text/30">
                No image
              </div>
            )}
          </div>
          <span className="max-w-[160px] truncate text-sm font-medium text-neutral-text">
            {booking.spaceTitle}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm text-neutral-text/70">
          <LiaCalendarDaySolid size={14} className="shrink-0 text-neutral-text/40" />
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm text-neutral-text/70">
          <CgLock size={14} className="shrink-0 text-neutral-text/40" />
          <span className="whitespace-nowrap">
            {booking.startTime} – {booking.endTime}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="whitespace-nowrap text-sm font-semibold text-neutral-text">
          ৳{Number.isFinite(price) ? price.toFixed(2) : booking.totalPrice}
        </span>
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[booking.status]}`}
        >
          {booking.status}
        </span>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-border bg-white py-16 text-center">
      <BiMapPin size={32} className="mb-3 text-neutral-text/30" />
      <p className="text-sm font-medium text-neutral-text">No bookings yet</p>
      <p className="mt-1 text-sm text-neutral-text/50">
        Once you book a space, it will show up here.
      </p>
    </div>
  );
}

export default UserBookingsPage;