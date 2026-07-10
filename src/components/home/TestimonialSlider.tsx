'use client';

import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

interface Testimonial {
  id: number;
  image: string;
  rating: number;
  quote: string;
  author: string;
  role: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    quote: "SpaceSync helps us find the perfect spaces for our team offsites. Super seamless experience!",
    author: "Sarah J.",
    role: "Marketing Director at Acme",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    quote: "Booking meeting rooms has never been this effortless. We cut down our coordination time by 80%.",
    author: "David K.",
    role: "Operations Lead at TechFlow",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    quote: "The flexible terms allowed our startup to scale up desk spaces month-by-month seamlessly.",
    author: "Elena R.",
    role: "Founder at NexaGlobal",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    quote: "Incredible client support and verified locations. You genuinely get exactly what you see in the images.",
    author: "Marcus T.",
    role: "Creative Director at VibeStudio",
  }
];

export default function TestimonialSlider(): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // Function to clear and reset the auto-slide timer safely
  const resetAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
    autoplayTimer.current = setInterval(() => {
      handleNext();
    }, 3000); // Transitions automatically every 5 seconds
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [activeIndex]);

  const handlePrev = (): void => {
    setActiveIndex((prev) => (prev === 0 ? mockTestimonials.length - 1 : prev - 1));
  };

  const handleNext = (): void => {
    setActiveIndex((prev) => (prev === mockTestimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number): void => {
    setActiveIndex(index);
  };

  return (
    <section className="w-full bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Row containing Arrow Navigation Controls */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Top Rated By Professionals
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#4F46E5] active:scale-95 transition-all shadow-sm"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#4F46E5] active:scale-95 transition-all shadow-sm"
              aria-label="Next slide"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Window Viewport */}
        <div className="relative bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100 min-h-[380px] md:min-h-[300px] overflow-hidden flex items-center">
          {mockTestimonials.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.id}
                className={`w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center absolute inset-0 p-6 md:p-8 transition-all duration-700 ease-in-out transform ${
                  isActive 
                    ? "opacity-100 translate-x-0 pointer-events-auto" 
                    : "opacity-0 translate-x-8 pointer-events-none"
                }`}
              >
                {/* Left Column: Premium Workspace Photo */}
                <div className="md:col-span-5 h-48 md:h-64 w-full relative rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                  <img
                    src={item.image}
                    alt="Beautiful premium workspace interior"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Right Column: Review Details */}
                <div className="md:col-span-7 space-y-5 flex flex-col justify-center">
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-[#F59E0B]">
                    {[...Array(item.rating)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 fill-[#F59E0B]" />
                    ))}
                  </div>

                  {/* Dynamic Quote Text */}
                  <p className="text-lg md:text-xl font-medium text-[#0F172A] leading-relaxed italic">
                    "{item.quote}"
                  </p>

                  {/* Author Profile Information */}
                  <div className="flex items-center gap-3.5 pt-2">
                    <div className="w-11 h-11 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center font-bold text-[#4F46E5] text-sm tracking-tight shadow-sm">
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">{item.author}</h4>
                      <p className="text-xs font-semibold text-slate-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Indicator Bullets */}
        <div className="flex justify-center gap-2.5 mt-6">
          {mockTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? "w-7 bg-[#4F46E5]" 
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}