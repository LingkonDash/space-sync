'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import { FaLaptop } from 'react-icons/fa';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StepItem {
  id: number;
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Zigzag rhythm: 'up' cards sit flush, 'down' cards drop lower on md+ */
  offset: 'up' | 'down';
}

const steps: StepItem[] = [
  {
    id: 1,
    label: 'Step 01',
    title: 'Search',
    description: 'Find spaces that fit your needs — filter by location, capacity, and amenities in seconds.',
    icon: FiSearch,
    offset: 'up',
  },
  {
    id: 2,
    label: 'Step 02',
    title: 'Book',
    description: 'Choose your time and confirm instantly. No back-and-forth, no waiting on approval.',
    icon: FiCalendar,
    offset: 'down',
  },
  {
    id: 3,
    label: 'Step 03',
    title: 'Work',
    description: 'Show up and get things done. Your space is ready exactly when you booked it.',
    icon: FaLaptop,
    offset: 'up',
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const cards = gsap.utils.toArray<HTMLElement>('.step-panel');

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0, rotate: 0 });
        return;
      }

      // Entrance: each panel rises in with a slight, alternating rotation
      // so the reveal feels hand-placed rather than mechanical.
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            rotate: i % 2 === 0 ? -3 : 3,
          },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      // Subtle parallax drift on the oversized background numerals —
      // gives the section depth on scroll without any connecting line.
      gsap.utils.toArray<HTMLElement>('.ghost-number').forEach((el) => {
        gsap.to(el, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id='howItWorks'
      className="w-full px-4 py-20 md:px-8 max-w-7xl mx-auto bg-[#F8FAFC] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-14 md:mb-20 max-w-7xl mx-auto">
        <div>
          <span className="block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary)] mb-3">
            The process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-neutral-text)]">
            How it works
          </h2>
        </div>
        <Link
          href="/about"
          className="group hidden sm:flex items-center gap-1 text-sm font-semibold text-[var(--color-neutral-text)] hover:text-[var(--color-primary)] transition-colors duration-200"
        >
          View all
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      {/* Zigzag panel grid — offsets only apply from md up; mobile stacks cleanly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto items-start">
        {steps.map((step) => {
          const StepIcon = step.icon;
          return (
            <div
              key={step.id}
              className={`step-panel group relative ${
                step.offset === 'down' ? 'md:mt-12' : 'md:mt-0'
              }`}
            >
              <div className="relative overflow-hidden rounded-[2rem] bg-white border border-[var(--color-neutral-border)] p-8 pt-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/10">
                {/* Oversized ghost numeral, clipped by the panel's rounded corners */}
                <span
                  aria-hidden="true"
                  className="ghost-number pointer-events-none select-none absolute -top-4 -right-3 text-[7.5rem] md:text-[8.5rem] font-black leading-none text-slate-50"
                >
                  {String(step.id).padStart(2, '0')}
                </span>

                <span className="relative z-10 block text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-4">
                  {step.label}
                </span>

                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/50 to-primary flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6 rotate-3 transition-transform duration-500 group-hover:rotate-0">
                  <StepIcon className="w-7 h-7 text-white" />
                </div>

                <h3 className="relative z-10 text-xl font-bold text-[var(--color-neutral-text)] mb-2">
                  {step.title}
                </h3>
                <p className="relative z-10 text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}