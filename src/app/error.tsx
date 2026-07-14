"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const BRAND = {
  red: "#EF4444",
  indigo: "#4F46E5",
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const iconWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // log to your error reporting service here if you have one
    console.error(error);
  }, [error]);

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
        opacity: 0.45,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        iconWrapRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.2)" }
      )
        // little "shake it off" wobble on the warning icon
        .to(iconWrapRef.current, {
          rotate: -6,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "sine.inOut",
        })
        .set(iconWrapRef.current, { rotate: 0 })
        .fromTo(
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
        className="pointer-events-none absolute h-[380px] w-[380px] rounded-full opacity-35 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${BRAND.red}33 0%, ${BRAND.indigo}1a 45%, transparent 70%)`,
        }}
      />

      <div
        ref={iconWrapRef}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-sm sm:h-24 sm:w-24"
        style={{ backgroundColor: `${BRAND.red}15` }}
      >
        <FiAlertTriangle size={36} style={{ color: BRAND.red }} />
      </div>

      <p className="fade-item text-xs font-semibold uppercase tracking-widest text-neutral-text/40">
        Something went wrong
      </p>
      <h1 className="fade-item mt-2 text-2xl font-semibold text-neutral-text sm:text-3xl">
        We hit a snag loading this page
      </h1>
      <p className="fade-item mt-2 max-w-sm text-sm text-neutral-text/60">
        {error.message || "An unexpected error occurred. You can try again or head back home."}
      </p>

      <div className="fade-item mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: BRAND.indigo }}
        >
          <FiRefreshCw size={15} />
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-neutral-border bg-white px-6 py-3 text-sm font-semibold text-neutral-text transition hover:bg-neutral-bg"
        >
          Back to home
        </Link>
      </div>

      {error.digest && (
        <p className="fade-item mt-6 text-xs text-neutral-text/30">Error ID: {error.digest}</p>
      )}
    </div>
  );
}