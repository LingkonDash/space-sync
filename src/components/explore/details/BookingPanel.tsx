"use client";

import { useState, useRef, useLayoutEffect, FormEvent } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Space } from "@/types/space";
import type { Booking, BookingStatus } from "@/types/bookings";
import { postBookings } from "@/lib/action/bookings";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

interface CanUpdate {
  canUpdate: boolean;
  redirectLink: string;
}

interface BookingForm {
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
}

interface BookingPanelProps {
  room: Space;
  canUpdate?: CanUpdate;
}

export default function BookingPanel({ room, canUpdate }: BookingPanelProps) {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(false);
  const [form, setForm] = useState<BookingForm>({
    date: "",
    startTime: "",
    endTime: "",
    guests: 1,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const barRef = useRef<HTMLDivElement>(null);

  const isApproved = room.status === "approved";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(barRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.35,
      });
    });
    return () => ctx.revert();
  }, []);

  const totalHours = calcHours(form.startTime, form.endTime);
  const estimatedCost = (totalHours > 0 ? totalHours * room.pricePerHour : 0).toFixed(2);

  const handleBookNowClick = async () => {
    setCheckingAuth(true);
    try {
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        toast.info("Please log in to book this space.");
        router.push(`/login`);
        return;
      }

      setOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't verify your session. Please try again.");
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setOpen(true)

    try {
      // Re-check session right before submitting — protects against
      // a session expiring while the modal was open.
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        toast.info("Your session expired. Please log in again.");
        setOpen(false);
        router.push(`/login?redirect=/rooms/${room._id}`);
        return;
      }

      if (!room._id) {
        toast.error("Something's wrong with this space. Please refresh the page.");
        return;
      }

      const bookingData: Booking = {
        spaceId: room._id,
        spaceTitle: room.title,
        spaceImages: room.images,
        userId: session.user.id,
        userEmail: session.user.email,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        totalPrice: Number(estimatedCost),
        status: "pending" as BookingStatus,
      };

      const res = await postBookings(bookingData);
      // Adjust this check to match whatever shape postBookings actually resolves to.
      if (res?.insertedId) {
        toast.success("Booking confirmed! We'll notify you once it's approved.");
        setForm({ date: "", startTime: "", endTime: "", guests: 1 });
        setOpen(false);
      } else {
        toast.error("Couldn't complete your booking. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={barRef} className="relative">
      {/* ticket stub bar — sits in normal flow, no sticky/fixed positioning */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-border bg-white">
        <span
          className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-bg"
          aria-hidden="true"
        />
        <span
          className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-bg"
          aria-hidden="true"
        />

        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-4 p-6">
            <div>
              <p className="text-xs text-neutral-text/50">Price</p>
              <p className="text-lg font-semibold text-neutral-text">
                ৳{room.pricePerHour}{" "}
                <span className="text-sm font-normal text-neutral-text/60">/ hour</span>
              </p>
            </div>
            <div className="hidden h-8 w-px bg-neutral-border sm:block" />
            <div>
              <p className="text-xs text-neutral-text/50">Capacity</p>
              <p className="text-lg font-semibold text-neutral-text">{room.capacity} people</p>
            </div>
            <div className="hidden h-8 w-px bg-neutral-border sm:block" />
            <div>
              <p className="text-xs text-neutral-text/50">Location</p>
              <p className="text-lg font-semibold text-neutral-text">{room.city}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2 border-t border-dashed border-neutral-border p-6 sm:w-56 sm:border-l sm:border-t-0">
            {canUpdate?.canUpdate && (
              <Link
                href={canUpdate.redirectLink}
                className="rounded-lg border border-primary px-4 py-2 text-center text-sm font-medium text-primary transition hover:bg-primary/5"
              >
                Manage this space
              </Link>
            )}

            {isApproved ? (
              <button
                onClick={handleBookNowClick}
                disabled={checkingAuth}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {checkingAuth ? "Checking..." : "Book now"}
              </button>
            ) : (
              <p className="rounded-lg bg-neutral-bg px-4 py-2.5 text-center text-sm text-neutral-text/60">
                Not open for booking yet
              </p>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-text/40 p-4">
          <form
            onSubmit={handleConfirm}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-text">Book {room.title}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-neutral-text/50 hover:text-neutral-text"
              >
                ✕
              </button>
            </div>

            <label className="mb-3 block text-sm">
              <span className="mb-1 block text-neutral-text/70">Date</span>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-neutral-border p-2.5 outline-none focus:border-primary"
              />
            </label>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-neutral-text/70">Start time</span>
                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full rounded-lg border border-neutral-border p-2.5 outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-text/70">End time</span>
                <input
                  type="time"
                  required
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full rounded-lg border border-neutral-border p-2.5 outline-none focus:border-primary"
                />
              </label>
            </div>

            <label className="mb-4 block text-sm">
              <span className="mb-1 block text-neutral-text/70">Guests</span>
              <input
                type="number"
                min={1}
                max={room.capacity}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-border p-2.5 outline-none focus:border-primary"
              />
            </label>

            {form.startTime && form.endTime && totalHours <= 0 && (
              <p className="mb-4 rounded-lg bg-[#F59E0B]/10 px-3 py-2 text-sm text-[#F59E0B]">
                End time must be after start time.
              </p>
            )}

            {totalHours > 0 && (
              <p className="mb-4 rounded-lg bg-neutral-bg px-3 py-2 text-sm text-neutral-text/70">
                {totalHours} hr{totalHours !== 1 ? "s" : ""} · Estimated ৳{estimatedCost}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || totalHours <= 0}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Confirming..." : "Confirm booking"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function calcHours(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = (eh * 60 + em - (sh * 60 + sm)) / 60;
  return diff > 0 ? diff : 0;
}