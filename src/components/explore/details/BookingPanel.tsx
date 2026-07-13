'use client'

import { useState, useRef, useLayoutEffect, FormEvent } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Space } from "@/types/space";

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

interface BookingPayload extends BookingForm {
  roomId?: string;
  estimatedCost: number;
}

interface BookingPanelProps {
  room: Space;
  canUpdate?: CanUpdate;
  onConfirmBooking?: (payload: BookingPayload) => Promise<void>;
}

export default function BookingPanel({ room, canUpdate, onConfirmBooking }: BookingPanelProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<BookingForm>({ date: "", startTime: "", endTime: "", guests: 1 });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const barRef = useRef<HTMLDivElement>(null);

  const isApproved = room.status === "approved";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(barRef.current, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out", delay: 0.35 });
    });
    return () => ctx.revert();
  }, []);

  const totalHours = calcHours(form.startTime, form.endTime);
  const estimatedCost = totalHours > 0 ? totalHours * room.pricePerHour : 0;

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirmBooking?.({ roomId: room._id, ...form, estimatedCost }); // TODO: hook to backend
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={barRef} className="relative">
      {/* ticket stub bar — sits in normal flow, no sticky/fixed positioning */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-border bg-white">
        <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-bg" aria-hidden="true" />
        <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-bg" aria-hidden="true" />

        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-4 p-6">
            <div>
              <p className="text-xs text-neutral-text/50">Price</p>
              <p className="text-lg font-semibold text-neutral-text">
                ৳{room.pricePerHour} <span className="text-sm font-normal text-neutral-text/60">/ hour</span>
              </p>
            </div>
            <div className="h-8 w-px bg-neutral-border hidden sm:block" />
            <div>
              <p className="text-xs text-neutral-text/50">Capacity</p>
              <p className="text-lg font-semibold text-neutral-text">{room.capacity} people</p>
            </div>
            <div className="h-8 w-px bg-neutral-border hidden sm:block" />
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
                onClick={() => setOpen(true)}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Book now
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
          <form onSubmit={handleConfirm} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-text">Book {room.title}</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-neutral-text/50 hover:text-neutral-text">
                ✕
              </button>
            </div>

            <label className="mb-3 block text-sm">
              <span className="mb-1 block text-neutral-text/70">Date</span>
              <input
                type="date"
                required
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

            {totalHours > 0 && (
              <p className="mb-4 rounded-lg bg-neutral-bg px-3 py-2 text-sm text-neutral-text/70">
                {totalHours} hr{totalHours !== 1 ? "s" : ""} · Estimated ৳{estimatedCost}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
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