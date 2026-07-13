'use client'

import { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import RoomReviews, { Review } from "./RoomReviews";
import BookingPanel from "./BookingPanel";
import { Space } from "@/types/space";

gsap.registerPlugin(ScrollTrigger);

interface CanUpdate {
  canUpdate: boolean;
  redirectLink: string;
}

interface RoomPageBodyProps {
  room: Space;
  reviews?: Review[];
  relatedSpaces?: Space[];
  canReview: boolean;
  canUpdate?: CanUpdate;
}

export default function RoomPageBody({ room, reviews = [], relatedSpaces = [], canReview, canUpdate }: RoomPageBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-gallery", { opacity: 0, scale: 1.02, duration: 0.7, ease: "power2.out" })
        .from(".hero-title", { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, "-=0.4")
        .from(".hero-meta", { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" }, "-=0.3");

      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-neutral-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="hero-gallery mb-8">
          <ImageGallery images={room.images} />
        </div>

        <div className="mb-6">
          <span className="hero-meta mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {room.category}
          </span>
          <h1 className="hero-title text-2xl font-semibold text-neutral-text md:text-3xl">{room.title}</h1>
          <p className="hero-meta mt-1 text-sm text-neutral-text/60">{room.location}, {room.city}</p>
        </div>

        <div className="reveal-section mb-10">
          <BookingPanel
            room={room}
            canUpdate={canUpdate}
            onConfirmBooking={async (payload) => {
              // TODO: call your backend booking endpoint
              console.log("confirm booking", payload);
            }}
          />
        </div>

        <div className="space-y-10">
          <section className="reveal-section">
            <h2 className="mb-3 text-xl font-semibold text-neutral-text">About this space</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-text/80">
              {room.fullDescription || room.shortDescription}
            </p>
          </section>

          <section className="reveal-section border-t border-neutral-border pt-8">
            <h2 className="mb-4 text-xl font-semibold text-neutral-text">Details</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <SpecCard icon={<UsersIcon />} label="Capacity" value={`${room.capacity} people`} />
              <SpecCard icon={<TagIcon />} label="Price" value={`৳${room.pricePerHour}/hr`} />
              <SpecCard icon={<MapPinIcon />} label="Location" value={room.city} />
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {room.amenities.map((a: string) => (
                  <span
                    key={a}
                    className="flex items-center gap-1.5 rounded-full border border-neutral-border bg-white px-3 py-1.5 text-xs text-neutral-text/80"
                  >
                    <CheckIcon className="w-3.5 h-3.5 text-accent" />
                    {a}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 overflow-hidden rounded-xl border border-neutral-border">
              <iframe
                title="Location map"
                className="h-64 w-full"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${room.location}, ${room.city}`)}&output=embed`}
              />
            </div>
          </section>

          <div className="reveal-section">
            <RoomReviews
              room={room}
              reviews={reviews}
              canReview={canReview}
              onSubmitReview={async (payload) => {
                // TODO: call your server action, e.g. submitReview(room._id, payload)
                console.log("submit review", payload);
              }}
            />
          </div>

          {relatedSpaces.length > 0 && (
            <section className="reveal-section border-t border-neutral-border pt-8">
              <h2 className="mb-4 text-xl font-semibold text-neutral-text">More spaces like this</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {relatedSpaces.map((s) => (
                  <a
                    key={s._id}
                    href={`/rooms/${s._id}`}
                    className="w-56 shrink-0 overflow-hidden rounded-xl border border-neutral-border bg-white transition hover:shadow-md"
                  >
                    <div className="relative h-32 w-full">
                      <Image src={s.images?.[0]} alt={s.title} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-neutral-text">{s.title}</p>
                      <p className="text-xs text-neutral-text/60">৳{s.pricePerHour}/hr · {s.city}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

interface ImageGalleryProps {
  images: string[];
}

function ImageGallery({ images = [] }: ImageGalleryProps) {
  const [active, setActive] = useState<number>(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const goTo = (i: number) => {
    const next = (i + images.length) % images.length;
    gsap.to(slideRef.current, {
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        setActive(next);
        gsap.to(slideRef.current, { opacity: 1, duration: 0.25 });
      },
    });
  };

  if (!images.length) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div ref={slideRef} className="relative h-72 w-full md:h-105">
        <Image src={images[active]} alt="Room image" fill priority className="object-cover" />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => goTo(active - 1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            onClick={() => goTo(active + 1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
          >
            <ChevronIcon direction="right" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-primary" : "w-1.5 bg-white/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface SpecCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SpecCard({ icon, label, value }: SpecCardProps) {
  return (
    <div className="rounded-xl border border-neutral-border bg-white p-4">
      <div className="mb-2 text-primary">{icon}</div>
      <p className="text-xs text-neutral-text/60">{label}</p>
      <p className="text-sm font-medium text-neutral-text">{value}</p>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-4 w-4 text-neutral-text">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d={direction === "left" ? "M12.5 15L7.5 10L12.5 5" : "M7.5 15L12.5 10L7.5 5"} />
    </svg>
  );
}
function UsersIcon() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth={1.5} d="M13 8a3 3 0 11-6 0 3 3 0 016 0zM3 17c0-2.8 2.7-5 6-5s6 2.2 6 5" /></svg>;
}
function TagIcon() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth={1.5} d="M4 4h6l6 6-8 8-6-6V4z" /><circle cx="8" cy="8" r="1" fill="currentColor" /></svg>;
}
function MapPinIcon() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth={1.5} d="M10 18s6-5.2 6-9.5A6 6 0 004 8.5C4 12.8 10 18 10 18z" /><circle cx="10" cy="8.5" r="2" strokeWidth={1.5} /></svg>;
}
function CheckIcon({ className }: { className: string }) {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className={className}><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 10l4 4 8-8" /></svg>;
}