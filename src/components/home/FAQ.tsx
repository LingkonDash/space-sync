'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FiPlus } from 'react-icons/fi';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'How do I book a space on SpaceSync?',
    answer:
      'Browse the Explore page, filter by category, city, price, or capacity, then open any listing and confirm your time slot from the details page. Your booking is instant — no waiting on host approval.',
  },
  {
    id: 2,
    question: 'Can I cancel or reschedule a booking?',
    answer:
      'Yes. Go to "My Bookings" in your dashboard, select the booking, and choose to cancel or change the time. Cancellation windows vary slightly by host, so check the listing details before booking.',
  },
  {
    id: 3,
    question: 'How does hosting work — how do I list my space?',
    answer:
      'Register as a host, then head to "Add Space" in your dashboard. Fill in your title, description, category, location, pricing, and at least two photos, then submit for review.',
  },
  {
    id: 4,
    question: 'What happens after I submit a space for approval?',
    answer:
      'Our admin team reviews new listings to confirm details are accurate and photos meet quality guidelines. Most spaces are approved within 24-48 hours, and you can track status from "Manage Spaces."',
  },
  {
    id: 5,
    question: 'Is payment handled on the platform or with the host directly?',
    answer:
      'Pricing is shown per hour on every listing so you know the exact cost upfront before confirming a booking, keeping the process transparent between you and the host.',
  },
  {
    id: 6,
    question: 'What cities does SpaceSync currently cover?',
    answer:
      'We currently list spaces across Dhaka, Chattogram, Sylhet, and Khulna, with new cities added as more hosts join the platform.',
  },
];

export default function FAQ() {
  const containerRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [openId, setOpenId] = useState<number | null>(faqs[0].id);

  // Entrance reveal on scroll
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const rows = gsap.utils.toArray<HTMLElement>('.faq-row');

      if (prefersReducedMotion) {
        gsap.set(rows, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        rows,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  // Expand/collapse animation — drives height off the panel's natural content height
  const toggle = (id: number) => {
    const isOpening = openId !== id;
    const nextId = isOpening ? id : null;

    faqs.forEach((item) => {
      const panel = panelRefs.current[item.id];
      const icon = iconRefs.current[item.id];
      if (!panel) return;

      const shouldOpen = item.id === nextId;

      gsap.to(panel, {
        height: shouldOpen ? 'auto' : 0,
        opacity: shouldOpen ? 1 : 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });

      if (icon) {
        gsap.to(icon, {
          rotate: shouldOpen ? 45 : 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    setOpenId(nextId);
  };

  return (
    <section
      ref={containerRef}
      id="faq"
      className="w-full px-4 py-20 md:px-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-12 md:mb-16 max-w-2xl mx-auto text-center">
        <span className="block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary)] mb-3">
          Got questions?
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-neutral-text)]">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-500">
          Everything you need to know about booking and hosting on SpaceSync.
        </p>
      </div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="faq-row overflow-hidden rounded-2xl border border-[var(--color-neutral-border)] bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left"
              >
                <span className="text-sm sm:text-base font-semibold text-[var(--color-neutral-text)]">
                  {item.question}
                </span>
                <span
                  ref={(el) => {
                    iconRefs.current[item.id] = el;
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                >
                  <FiPlus className="h-4 w-4" />
                </span>
              </button>

              <div
                ref={(el) => {
                  panelRefs.current[item.id] = el;
                }}
                style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden px-5 sm:px-6"
              >
                <p className="pb-5 sm:pb-6 text-sm leading-relaxed text-slate-500">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}