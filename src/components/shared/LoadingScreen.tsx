"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Brand palette — same colors used across the dashboard charts/badges
const BRAND = {
  indigo: "#4F46E5",
  amber: "#F59E0B",
  teal: "#0D9488",
  violet: "#8B5CF6",
};

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        [blockRefs.current, ringRef.current, progressRef.current, labelRef.current],
        { opacity: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // ambient glow, slow breathing
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.55,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // outer ring, slow constant rotation
      gsap.to(ringRef.current, {
        rotate: 360,
        duration: 6,
        ease: "none",
        repeat: -1,
      });

      // the four "space type" blocks assemble → hover → disperse, on loop
      const tl = gsap.timeline({ repeat: -1 });

      tl.set(blockRefs.current, { opacity: 0, scale: 0.4, y: 16 })
        .to(blockRefs.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: 0.12,
        })
        .to(
          blockRefs.current,
          {
            y: -6,
            duration: 0.5,
            ease: "sine.inOut",
            stagger: { each: 0.1, yoyo: true, repeat: 1 },
          },
          "+=0.15"
        )
        .to(
          blockRefs.current,
          {
            opacity: 0,
            scale: 0.4,
            y: 16,
            duration: 0.4,
            ease: "power1.in",
            stagger: 0.06,
          },
          "+=0.3"
        );

      // progress bar sweep, on loop
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.8,
          ease: "power1.inOut",
          repeat: -1,
          transformOrigin: "left center",
        }
      );

      // label settles in once
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-neutral-bg"
    >
      {/* ambient brand glow behind the mark */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${BRAND.indigo}33 0%, ${BRAND.teal}22 45%, transparent 70%)`,
        }}
      />

      {/* slow rotating ring */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute h-40 w-40 rounded-full border-2 border-dashed sm:h-48 sm:w-48"
        style={{ borderColor: `${BRAND.indigo}30` }}
      />

      {/* four blocks — one per space category, assembling in brand colors */}
      <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3">
        {[BRAND.indigo, BRAND.amber, BRAND.teal, BRAND.violet].map((color, i) => (
          <div
            key={color}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
            className="h-9 w-9 rounded-xl shadow-sm sm:h-11 sm:w-11"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* progress sweep */}
      <div className="relative mt-10 h-1 w-40 overflow-hidden rounded-full bg-neutral-text/10 sm:w-52">
        <div
          ref={progressRef}
          className="h-full w-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${BRAND.indigo}, ${BRAND.teal})`,
            transform: "scaleX(0)",
          }}
        />
      </div>

      <p ref={labelRef} className="mt-4 text-sm font-medium text-neutral-text/60">
        Finding your spaces…
      </p>
    </div>
  );
}