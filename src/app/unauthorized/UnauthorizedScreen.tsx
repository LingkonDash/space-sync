"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { FiLock } from "react-icons/fi";

const BRAND = {
  indigo: "#4F46E5",
  amber: "#F59E0B",
};

export default function UnauthorizedScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const iconWrapRef = useRef<HTMLDivElement>(null);
  const shackleRef = useRef<HTMLDivElement>(null);

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
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        iconWrapRef.current,
        { scale: 0.5, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "back.out(2.2)" }
      )
        // lock shackle "clicks" shut
        .fromTo(
          shackleRef.current,
          { y: -6, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "bounce.out" },
          "-=0.15"
        )
        .fromTo(
          ".fade-item",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.1"
        );

      // subtle idle shake to draw the eye, once settled
      gsap.to(iconWrapRef.current, {
        rotate: 3,
        duration: 0.15,
        repeat: 3,
        yoyo: true,
        delay: 1.4,
        ease: "sine.inOut",
      });
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
        className="pointer-events-none absolute h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${BRAND.amber}33 0%, ${BRAND.indigo}22 45%, transparent 70%)`,
        }}
      />

      <div ref={iconWrapRef} className="relative mb-6">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-sm sm:h-24 sm:w-24"
          style={{ backgroundColor: `${BRAND.amber}15` }}
        >
          <FiLock size={36} style={{ color: BRAND.amber }} />
        </div>
        <div ref={shackleRef} className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2" />
      </div>

      <p className="fade-item text-xs font-semibold uppercase tracking-widest text-neutral-text/40">
        401 · Access denied
      </p>
      <h1 className="fade-item mt-2 text-2xl font-semibold text-neutral-text sm:text-3xl">
        You don't have access to this page
      </h1>
      <p className="fade-item mt-2 max-w-sm text-sm text-neutral-text/60">
        Log in with an account that has permission, or create a new one to continue.
      </p>

      <div className="fade-item mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: BRAND.indigo }}
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-xl border border-neutral-border bg-white px-6 py-3 text-sm font-semibold text-neutral-text transition hover:bg-neutral-bg"
        >
          Create an account
        </Link>
      </div>

      <Link
        href="/"
        className="fade-item mt-6 text-sm font-medium text-neutral-text/50 underline-offset-4 transition hover:text-neutral-text hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}