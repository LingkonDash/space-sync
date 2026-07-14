'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Centralized link config — edit hrefs/labels here without touching the JSX below.
const LINKS = {
  viewAll: {
    href: '/categories',
    label: 'View all',
  },
  // Prefix used to build each category's destination: `${categoryBase}${slug}`
  categoryBase: '/explore?category=',
};

// TypeScript Interface for Category Data
interface CategoryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

// Mock data populated with working, high-quality Unsplash 3D/Isometric workspace illustrations
const categories: CategoryItem[] = [
  {
    id: '1',
    title: 'Coworking Spaces',
    description: 'Work in inspiring shared environments',
    imageUrl: 'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&w=500&q=80',
    slug: 'Co-working',
  },
  {
    id: '2',
    title: 'Meeting Rooms',
    description: 'Professional spaces for productive meetings',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80',
    slug: 'Meeting+Room',
  },
  {
    id: '3',
    title: 'Event Halls',
    description: 'Host events that leave a lasting impression',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=80',
    slug: 'Event+Hall',
  },
  {
    id: '4',
    title: 'Creative Studios',
    description: 'Built for creators, innovators & teams',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=500&q=80',
    slug: 'Studio',
  },
];

export default function Category() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const cards = gsap.utils.toArray<HTMLElement>('.category-card');

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Same entrance language as the "How It Works" section: cards rise
      // and settle in with a soft stagger as the grid scrolls into view.
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
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

  return (
    <section
      ref={containerRef}
      className="w-full px-4 py-12 md:px-8 max-w-7xl mx-auto bg-[var(--color-neutral-bg)]"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-neutral-text)]">
          Featured Categories
        </h2>
        <Link
          href={LINKS.viewAll.href}
          className="group flex items-center gap-1 text-sm font-semibold text-[var(--color-neutral-text)] hover:text-[var(--color-primary)] transition-colors duration-200"
        >
          {LINKS.viewAll.label}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`${LINKS.categoryBase}${category.slug}`}
            className="category-card group block p-6 bg-white border border-[var(--color-neutral-border)] rounded-2xl text-center transition-all duration-300 ease-out opacity-0 hover:border-[var(--color-primary)] hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5"
          >
            {/* Image Container with Subtle Zoom Effect */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-[var(--color-neutral-bg)] flex items-center justify-center">
              <Image
                src={category.imageUrl}
                alt={category.title}
                fill
                sizes="(max-w-7xl) 25vw, (max-w-1024px) 33vw, (max-w-640px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                priority={false}
              />
            </div>

            {/* Typography */}
            <h3 className="text-lg font-bold text-[var(--color-neutral-text)] mb-2 tracking-tight">
              {category.title}
            </h3>
            <p className="text-sm text-slate-500 max-w-[220px] mx-auto leading-relaxed">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}