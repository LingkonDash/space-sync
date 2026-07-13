"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaStar } from "react-icons/fa";
import { FiMapPin, FiUsers } from "react-icons/fi";
import type { Space } from "@/types/space";

gsap.registerPlugin(ScrollTrigger);

interface RoomCardProps {
  room: Space;
  index?: number; // optional stagger hint — pass grid position from parent
}

export default function RoomCard({ room, index = 0 }: RoomCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  // Scroll-in entrance — runs independently per card, works in any grid/list context
  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: (index % 4) * 0.08, // subtle row-relative stagger
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  function handleMouseEnter() {
    gsap.to(cardRef.current, { y: -6, duration: 0.3, ease: "power2.out" });
    gsap.to(imageRef.current, { scale: 1.08, duration: 0.5, ease: "power2.out" });
  }

  function handleMouseLeave() {
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: "power2.out" });
    gsap.to(imageRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group overflow-hidden rounded-2xl border border-[var(--color-neutral-border)] bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <div ref={imageRef} className="h-full w-full">
          <Image
            src={room.images[0]}
            alt={room.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[var(--color-neutral-text)] backdrop-blur-sm">
          {room.category}
        </span>

        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[var(--color-neutral-text)] backdrop-blur-sm">
          <FaStar className="h-3 w-3 text-[var(--color-secondary)]" />
          {room.rating.toFixed(1)}
          <span className="font-normal text-slate-400">({room.reviewCount})</span>
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="truncate font-heading text-base font-semibold text-[var(--color-neutral-text)]">
          {room.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{room.shortDescription}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <FiMapPin className="h-3.5 w-3.5" />
            {room.city}
          </span>
          <span className="flex items-center gap-1">
            <FiUsers className="h-3.5 w-3.5" />
            {room.capacity} people
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-neutral-border)] pt-3">
          <p className="text-sm font-bold text-[var(--color-neutral-text)]">
            ${room.pricePerHour}
            <span className="text-xs font-normal text-slate-400">/hr</span>
          </p>

          <Link
            href={`/explore/${room._id}`}
            className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-primary)]/90"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}