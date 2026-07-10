'use client';

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { 
  FiCheckSquare, 
  FiCalendar, 
  FiClock, 
  FiShield, 
  FiSearch, 
  FiBarChart2 
} from "react-icons/fi";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const featuresData: FeatureItem[] = [
  {
    id: 1,
    title: "Verified Hosts",
    description: "All hosts are verified for quality & trust",
    icon: FiCheckSquare,
  },
  {
    id: 2,
    title: "Flexible Scheduling",
    description: "Book by the hour, day, or month",
    icon: FiCalendar,
  },
  {
    id: 3,
    title: "Instant Availability",
    description: "Real-time availability at your fingertips",
    icon: FiClock,
  },
  {
    id: 4,
    title: "Transparent Pricing",
    description: "No hidden fees. What you see is what you pay",
    icon: FiShield,
  },
  {
    id: 5,
    title: "Smart Discovery",
    description: "AI-powered search for the perfect fit",
    icon: FiSearch,
  },
  {
    id: 6,
    title: "Workspace Analytics",
    description: "Insights to optimize your workspace use",
    icon: FiBarChart2,
  },
];

export default function WhyChooseUs(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(".animate-header, .feature-card", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(".animate-header", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      }).from(
        ".feature-card",
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "all", // Clears GSAP properties so Tailwind hover styles work perfectly
        },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  return (
    <section 
      ref={containerRef} 
      className="w-full bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Header Row */}
        <div className="animate-header flex items-center justify-between mb-10 border-b border-slate-100 pb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Why Choose SpaceSync?
          </h2>
        </div>

        {/* Responsive Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="group feature-card flex items-start gap-5 p-6 bg-white border border-[#E2E8F0] rounded-2xl cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#4F46E5] hover:shadow-xl hover:shadow-[#4F46E5]/5"
              >
                {/* Icon Wrapper via Tailwind States */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#4F46E5] transition-transform duration-300 group-hover:scale-110">
                  <IconComponent className="w-6 h-6 stroke-[1.75]" />
                </div>

                {/* Text Content */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}