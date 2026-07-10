"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { HiArrowRight, HiOutlineLocationMarker, HiOutlineCalendar, HiSearch, HiChevronDown } from "react-icons/hi";
import { FiGlobe, FiMapPin, FiClipboard } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import StatCard from "./StatCard";

// Swap these for your own hosted images later — unsplash used as placeholder source
const IMG_MAIN = "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&w=800&q=80";
const IMG_SECONDARY = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80";
const IMG_SMALL = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80";

export default function Banner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);

  const badgeRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const mainImgRef = useRef<HTMLDivElement | null>(null);
  const secondaryImgRef = useRef<HTMLDivElement | null>(null);
  const smallImgRef = useRef<HTMLDivElement | null>(null);
  const ratingRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance sequence
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(badgeRef.current, { y: 16, opacity: 0, duration: 0.5 })
        .from(headingRef.current, { y: 24, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(paraRef.current, { y: 16, opacity: 0, duration: 0.5 }, "-=0.35")
        .from(ctaRef.current, { y: 16, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(
          [mainImgRef.current, secondaryImgRef.current, smallImgRef.current],
          { scale: 0.85, opacity: 0, duration: 0.7, stagger: 0.12 },
          "-=0.4"
        )
        .from(ratingRef.current, { scale: 0.6, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(statsRef.current?.children ?? [], { x: 24, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.5")
        .from(searchRef.current, { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");

      // Ambient background blob — slow floating "wave"
      gsap.to(blobRef.current, {
        x: 40,
        y: -30,
        scale: 1.08,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Floating collage images — calm, continuous, slightly offset per image
      gsap.to(mainImgRef.current, {
        y: -14,
        rotate: 1,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(secondaryImgRef.current, {
        y: 12,
        rotate: -1.2,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.4,
      });
      gsap.to(smallImgRef.current, {
        y: -10,
        x: 6,
        duration: 5.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.8,
      });
      gsap.to(ratingRef.current, {
        y: -6,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-neutral-bg)] pt-8 sm:pt-15 pb-16"
    >
      {/* Ambient background blob */}
      <div
        ref={blobRef}
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-[var(--color-primary)]/15 blur-3xl sm:h-[620px] sm:w-[620px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left: copy + CTAs + search bar */}
          <div>
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)]"
            >
              <span aria-hidden>⚡</span>
              The Future of Workspaces
            </div>

            <h1
              ref={headingRef}
              className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-neutral-text)] sm:text-5xl lg:text-[3.25rem]"
            >
              Find Your Perfect Space to{" "}
              <span className="text-[var(--color-primary)]">Work, Meet &amp; Create</span>
            </h1>

            <p ref={paraRef} className="mt-5 max-w-md text-base text-slate-500">
              Discover premium coworking spaces, meeting rooms, creative studios, and event venues
              in top cities. Book by the hour, day, or month — effortlessly.
            </p>

            <div ref={ctaRef} className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/explore"
                className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-primary)]/90"
              >
                Explore Spaces
                <HiArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Search bar */}
            <div
              ref={searchRef}
              className="mt-10 flex flex-col gap-3 rounded-2xl border border-[var(--color-neutral-border)] bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-[var(--color-neutral-border)]"
            >
              <div className="flex flex-1 items-center gap-2 px-3 py-1.5">
                <HiOutlineLocationMarker className="h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[11px] text-slate-400">Location</p>
                  <p className="text-sm font-medium text-[var(--color-neutral-text)]">New York, USA</p>
                </div>
              </div>

              <div className="flex flex-1 items-center gap-2 px-3 py-1.5">
                <FiGlobe className="h-4 w-4 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <p className="text-[11px] text-slate-400">Category</p>
                  <p className="text-sm font-medium text-[var(--color-neutral-text)]">Coworking Space</p>
                </div>
                <HiChevronDown className="h-4 w-4 text-slate-400" />
              </div>

              <div className="flex flex-1 items-center gap-2 px-3 py-1.5">
                <HiOutlineCalendar className="h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[11px] text-slate-400">Date</p>
                  <p className="text-sm font-medium text-[var(--color-neutral-text)]">May 24, 2025</p>
                </div>
              </div>

              <div className="px-1 pt-1 sm:pt-0 sm:pl-3">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary)]/90 sm:w-auto">
                  <HiSearch className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Right: image collage + stat cards */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative h-[320px] w-full max-w-[480px] sm:h-[380px]">
              {/* Main image */}
              <div
                ref={mainImgRef}
                className="absolute right-0 top-0 h-[230px] w-[70%] overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:h-[260px]"
              >
                <img src={IMG_MAIN} alt="Modern coworking space" className="h-full w-full object-cover" />
              </div>

              {/* Secondary image, overlapping bottom-right */}
              <div
                ref={secondaryImgRef}
                className="absolute bottom-0 right-8 h-[190px] w-[58%] overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:h-[210px]"
              >
                <img src={IMG_SECONDARY} alt="Meeting room with wooden table" className="h-full w-full object-cover" />
              </div>

              {/* Small image, bottom-left */}
              <div
                ref={smallImgRef}
                className="absolute bottom-6 left-0 h-[150px] w-[42%] overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:h-[170px]"
              >
                <img src={IMG_SMALL} alt="City-view lounge space" className="h-full w-full object-cover" />
              </div>

              {/* Rating badge */}
              <div
                ref={ratingRef}
                className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[var(--color-neutral-border)] bg-white px-3 py-2 shadow-lg sm:left-[38%]"
              >
                <FaStar className="h-4 w-4 text-[var(--color-secondary)]" />
                <p className="text-sm font-bold text-[var(--color-neutral-text)]">4.9</p>
                <p className="text-xs text-slate-400">120 Reviews</p>
              </div>
            </div>

            {/* Stat cards */}
            <div ref={statsRef} className="mt-6 hidden flex-col gap-3 lg:ml-4 lg:mt-0 lg:flex">
              <StatCard icon={FiMapPin} value="1200+" label="Spaces" />
              <StatCard icon={FiGlobe} value="45" label="Cities" />
              <StatCard icon={FiClipboard} value="18k+" label="Bookings" />
            </div>
          </div>
        </div>

        {/* Stat cards row for mobile/tablet (hidden on lg since desktop shows the side column) */}
        <div className="mt-8 grid grid-cols-3 gap-3 lg:hidden">
          <StatCard icon={FiMapPin} value="1200+" label="Spaces" />
          <StatCard icon={FiGlobe} value="45" label="Cities" />
          <StatCard icon={FiClipboard} value="18k+" label="Bookings" />
        </div>
      </div>
    </section>
  );
}