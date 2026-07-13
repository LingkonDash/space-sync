"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateBookingStatus } from "@/lib/action/bookings";
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

// Defines what a host can move a booking to next, and how that action button looks.
// Booking statuses without an entry here (completed / cancelled) are locked -> badge only.
const nextStatusMap: Partial<
  Record<BookingStatus, { next: BookingStatus; label: string; className: string }>
> = {
  pending: {
    next: "confirmed",
    label: "Confirm",
    className: "bg-[#4F46E5] text-white hover:bg-[#4338CA]",
  },
  confirmed: {
    next: "completed",
    label: "Mark Completed",
    className: "bg-[#0D9488] text-white hover:bg-[#0B7A70]",
  },
};

export default function HostBookingsTable({ bookings }: { bookings: UserBooking[] }) {
  const [rows, setRows] = useState(bookings);

  if (rows.length === 0) return <EmptyState />;

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setRows((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)));
  };

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {rows.map((booking) => (
          <BookingCard key={booking._id} booking={booking} onStatusChange={handleStatusChange} />
        ))}
      </div>

      {/* Tablet/Desktop: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
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
              {rows.map((booking, i) => (
                <BookingRow
                  key={booking._id}
                  booking={booking}
                  isLast={i === rows.length - 1}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* scroll hint, tablet only */}
        <div className="border-t border-neutral-border bg-neutral-bg px-5 py-2 text-center text-xs text-neutral-text/40 lg:hidden">
          Swipe left/right to see more →
        </div>
      </div>
    </>
  );
}

function StatusControl({
  booking,
  onStatusChange,
}: {
  booking: UserBooking;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const action = nextStatusMap[booking.status];

  // completed / cancelled bookings can no longer change -> render as a plain badge
  if (!action) {
    return (
      <span
        className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[booking.status]}`}
      >
        {booking.status}
      </span>
    );
  }

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await updateBookingStatus(booking._id, action.next);
        // updateBookingStatus resolves with a MongoDB updateOne-style result
        if (res && (res.acknowledged === false || res.modifiedCount === 0)) {
          setError("Update failed. Try again.");
          return;
        }
        onStatusChange(booking._id, action.next);
      } catch {
        setError("Something went wrong.");
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-1.5">
      <span
        className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[booking.status]}`}
      >
        {booking.status}
      </span>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
      >
        {isPending ? "Updating…" : action.label}
      </button>
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}

function BookingRow({
  booking,
  isLast,
  onStatusChange,
}: {
  booking: UserBooking;
  isLast: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
}) {
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
        <StatusControl booking={booking} onStatusChange={onStatusChange} />
      </td>
    </tr>
  );
}

function BookingCard({
  booking,
  onStatusChange,
}: {
  booking: UserBooking;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
}) {
  const price = Number(booking.totalPrice);
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-neutral-border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-bg">
          {booking.spaceImages?.[0] ? (
            <Image
              src={booking.spaceImages[0]}
              alt={booking.spaceTitle}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-text/30">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-text">{booking.spaceTitle}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-text/60">
            <LiaCalendarDaySolid size={13} className="shrink-0 text-neutral-text/40" />
            <span>{formattedDate}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-text/60">
            <CgLock size={13} className="shrink-0 text-neutral-text/40" />
            <span>
              {booking.startTime} – {booking.endTime}
            </span>
          </div>
        </div>

        <span className="whitespace-nowrap text-sm font-semibold text-neutral-text">
          ৳{Number.isFinite(price) ? price.toFixed(2) : booking.totalPrice}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-border pt-3">
        <StatusControl booking={booking} onStatusChange={onStatusChange} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-border bg-white py-16 text-center">
      <BiMapPin size={32} className="mb-3 text-neutral-text/30" />
      <p className="text-sm font-medium text-neutral-text">No bookings yet</p>
      <p className="mt-1 text-sm text-neutral-text/50">
        Once you receive a booking, it will show up here.
      </p>
    </div>
  );
}