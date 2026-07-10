"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { FiTarget, FiUsers, FiShield, FiTrendingUp } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import TestimonialSlider from "@/components/home/TestimonialSlider";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    icon: FiTarget,
    title: "Simplicity First",
    desc: "Finding and booking a space should take minutes, not emails back and forth.",
  },
  {
    icon: FiShield,
    title: "Verified Listings",
    desc: "Every space is reviewed by our team before it goes live, so what you see is what you get.",
  },
  {
    icon: FiUsers,
    title: "Built for Hosts Too",
    desc: "We give hosts real tools to manage bookings, not just a listing form.",
  },
  {
    icon: FiTrendingUp,
    title: "Always Improving",
    desc: "We ship based on what our community actually asks for, not guesswork.",
  },
];

const STATS = [
  { value: "1200+", label: "Spaces listed" },
  { value: "45", label: "Cities covered" },
  { value: "18k+", label: "Bookings made" },
  { value: "4.9", label: "Average rating" },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.children ?? [], {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });

      sectionRefs.current.forEach((section) => {
        if (!section) return;
        gsap.from(section.children, {
          y: 28,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  function setSectionRef(el: HTMLElement | null, i: number) {
    sectionRefs.current[i] = el;
  }

  return (
    <main className="bg-[var(--color-neutral-bg)] pb-24 pt-8 sm:pt-12">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div ref={heroRef}>
          <span className="inline-flex items-center rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)]">
            About SpaceSync
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-[var(--color-neutral-text)] sm:text-5xl">
            We are building the easiest way to find your next workspace
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-500">
            SpaceSync connects people who need a place to work, meet, or host an event with
            hosts who have the right space for it — with transparent pricing, verified
            listings, and booking that takes minutes.
          </p>
        </div>
      </section>

      {/* Story */}
      <section
        ref={(el) => setSectionRef(el, 0)}
        className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="relative h-72 overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:h-96">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
              alt="Team working in a coworking space"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Our Story
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold text-[var(--color-neutral-text)] sm:text-3xl">
              Started from a frustrating Tuesday morning
            </h2>
            <p className="mt-4 leading-relaxed text-slate-500">
              Our founders spent an entire morning calling around the city trying to book a
              meeting room for eight people, only to show up and find the listing photos were
              years out of date. SpaceSync exists so nobody has to do that again — every
              space is verified, every price is upfront, and every booking is confirmed
              before you show up.
            </p>
            <p className="mt-4 leading-relaxed text-slate-500">
              Today, SpaceSync helps thousands of people book desks, meeting rooms, studios,
              and event halls across dozens of cities — and helps hosts turn unused space
              into steady income.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={(el) => setSectionRef(el, 1)}
        className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--color-neutral-border)] bg-white p-8 shadow-sm sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-[var(--color-primary)]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section
        ref={(el) => setSectionRef(el, 2)}
        className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            What We Stand For
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--color-neutral-text)]">
            The principles behind every decision we make
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--color-neutral-border)] bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-[var(--color-neutral-text)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial strip */}
      <TestimonialSlider />

      {/* CTA */}
      <section
        ref={(el) => setSectionRef(el, 4)}
        className="mx-auto mt-10 max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="font-heading text-2xl font-bold text-[var(--color-neutral-text)] sm:text-3xl">
          Ready to find your space?
        </h2>
        <p className="mt-3 text-slate-500">
          Browse verified spaces near you or list your own in minutes.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/explore"
            className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary)]/90"
          >
            Explore Spaces
          </Link>
          <Link
            href="/register?role=host"
            className="rounded-xl border border-[var(--color-neutral-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-neutral-text)] transition-colors hover:bg-slate-50"
          >
            Become a Host
          </Link>
        </div>
      </section>
    </main>
  );
}