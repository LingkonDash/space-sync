"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { FiCompass } from "react-icons/fi";

const BRAND = {
  indigo: "#4F46E5",
  teal: "#0D9488",
  amber: "#F59E0B",
  violet: "#8B5CF6",
};

export default function NotFoundScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(containerRef.current!.querySelectorAll(".fade-item"), { opacity: 1, y: 0 });
        return;
      }

      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.5,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // slow, endless compass spin — it's lost, after all
      gsap.to(compassRef.current, {
        rotate: 360,
        duration: 5,
        ease: "power1.inOut",
        repeat: -1,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        digitRefs.current,
        { opacity: 0, y: 30, scale: 0.6 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.12 }
      ).fromTo(
        ".fade-item",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-bg px-4 text-center"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${BRAND.indigo}33 0%, ${BRAND.violet}22 45%, transparent 70%)`,
        }}
      />

      <div className="relative mb-2 flex items-center justify-center gap-1 sm:gap-2">
        {["4", "0", "4"].map((digit, i) => (
          <span
            key={i}
            ref={(el) => {
              digitRefs.current[i] = el;
            }}
            className="text-7xl font-bold sm:text-8xl"
            style={{
              color: [BRAND.indigo, BRAND.teal, BRAND.amber][i],
            }}
          >
            {digit}
          </span>
        ))}
      </div>

      <div
        ref={compassRef}
        className="fade-item mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
        style={{ backgroundColor: `${BRAND.indigo}15` }}
      >
        <FiCompass size={26} style={{ color: BRAND.indigo }} />
      </div>

      <h1 className="fade-item text-2xl font-semibold text-neutral-text sm:text-3xl">
        This page does not exist
      </h1>
      <p className="fade-item mt-2 max-w-sm text-sm text-neutral-text/60">
        The page you are looking for may have been moved, renamed, or never existed.
      </p>

      <Link
        href="/"
        className="fade-item mt-8 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        style={{ backgroundColor: BRAND.indigo }}
      >
        Back to home
      </Link>
    </div>
  );
}