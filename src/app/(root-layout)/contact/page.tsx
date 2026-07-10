"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_INFO = [
  {
    icon: FiMail,
    title: "Email Us",
    lines: ["support@spacesync.com", "partnerships@spacesync.com"],
  },
  {
    icon: FiPhone,
    title: "Call Us",
    lines: ["+880 1776572194", "Mon–Fri, 9am–6pm"],
  },
  {
    icon: FiMapPin,
    title: "Visit Us",
    lines: ["House 12, Sobujbag", "Srimangal 3210, Bangladesh"],
  },
  {
    icon: FiClock,
    title: "Support Hours",
    lines: ["Saturday–Thursday", "9:00 AM – 8:00 PM"],
  },
];

const FAQS = [
  {
    q: "How quickly will I get a response?",
    a: "Our support team typically replies within 24 hours on business days.",
  },
  {
    q: "I'm a host — who do I contact about listing issues?",
    a: "Email partnerships@spacesync.com and our host success team will follow up directly.",
  },
  {
    q: "Do you offer support outside Dhaka?",
    a: "Yes — SpaceSync operates across 45 cities and our support covers all of them.",
  },
];

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const formSectionRef = useRef<HTMLElement | null>(null);
  const faqSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.children ?? [], {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(cardsRef.current?.children ?? [], {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });

      [formSectionRef, faqSectionRef].forEach((ref) => {
        if (!ref.current) return;
        gsap.from(ref.current.children, {
          y: 28,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Static page — wiring this up to an API route comes later.
  }

  return (
    <main className="bg-[var(--color-neutral-bg)] pb-24 pt-8 sm:pt-12">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div ref={heroRef}>
          <span className="inline-flex items-center rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)]">
            Get in Touch
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-[var(--color-neutral-text)] sm:text-5xl">
            We are here to help
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-500">
            Questions about a booking, listing your space, or just want to say hello? Reach
            out through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div ref={cardsRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_INFO.map(({ icon: Icon, title, lines }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--color-neutral-border)] bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-sm font-semibold text-[var(--color-neutral-text)]">
                {title}
              </h3>
              <div className="mt-2 space-y-0.5">
                {lines.map((line) => (
                  <p key={line} className="text-sm text-slate-500">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + map */}
      <section
        ref={formSectionRef}
        className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-[var(--color-neutral-border)] bg-white p-8 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-[var(--color-neutral-text)]">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Fill out the form and our team will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-[var(--color-neutral-text)]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="mt-2 w-full rounded-xl border border-[var(--color-neutral-border)] bg-white px-4 py-3 text-sm text-[var(--color-neutral-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--color-neutral-text)]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-[var(--color-neutral-border)] bg-white px-4 py-3 text-sm text-[var(--color-neutral-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  className="mt-2 w-full rounded-xl border border-[var(--color-neutral-border)] bg-white px-4 py-3 text-sm text-[var(--color-neutral-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[var(--color-neutral-text)]">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="mt-2 w-full resize-none rounded-xl border border-[var(--color-neutral-border)] bg-white px-4 py-3 text-sm text-[var(--color-neutral-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary)]/90"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map placeholder */}
          <div className="overflow-hidden rounded-2xl border border-[var(--color-neutral-border)] shadow-sm">
            <iframe
              title="SpaceSync office location"
              src="https://www.google.com/maps?q=Srimangal,Moulvibazar,Sylhet,Bangladesh&output=embed"
              className="h-full min-h-[320px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        ref={faqSectionRef}
        className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-center font-heading text-2xl font-bold text-[var(--color-neutral-text)] sm:text-3xl">
          Frequently asked questions
        </h2>

        <div className="mt-10 space-y-4">
          {FAQS.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-2xl border border-[var(--color-neutral-border)] bg-white p-6 shadow-sm"
            >
              <h3 className="font-heading text-sm font-semibold text-[var(--color-neutral-text)]">
                {q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}