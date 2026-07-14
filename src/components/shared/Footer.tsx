'use client'

import React, { useEffect, useRef, MouseEvent } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import logo from "@/images/spaceSyncLogo.svg";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { IconType } from "react-icons";
import Link from "next/link";

interface SocialLinkProps {
  platform: string;
  link: string;
  iconLetter: IconType;
}

export default function Footer(): React.JSX.Element {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".animate-cta", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".animate-col", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>): void => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2, ease: "power1.out" });
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>): void => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power1.out" });
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-[#0F172A] text-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-[#F59E0B]/30"
    >
      {/* Upper Newsletter / CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="animate-cta relative rounded-3xl bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#0D9488] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-[#4F46E5]/20">

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] rounded-3xl pointer-events-none"></div>

          <div className="space-y-4 max-w-xl text-center lg:text-left relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Ready to Find Your Next Workspace?
            </h2>
            <p className="text-indigo-100 text-sm md:text-base font-medium opacity-90">
              Join thousands of businesses and professionals finding spaces that inspire productivity.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full max-w-md flex flex-col sm:flex-row gap-3 relative z-10"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="w-full px-5 py-4 rounded-xl text-[#0F172A] bg-white/95 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] transition-shadow text-sm font-medium shadow-inner"
            />
            <button
              type="submit"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="w-full sm:w-auto px-7 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] font-bold rounded-xl transition-colors duration-200 text-sm whitespace-nowrap flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/20"
            >
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid Content Area — 4 real columns: Brand, Product, Company, Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 border-b border-slate-800">

        {/* Brand Meta Column */}
        <div className="animate-col sm:col-span-2 lg:col-span-1 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white tracking-tighter">
              <Image src={logo} alt="logo" height={50} width={50} className="brightness-0 rounded-full invert" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SpaceSync</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            The modern marketplace for workspaces, meeting rooms, and event venues.
          </p>
          <div className="flex gap-3">
            {[
              { platform: "linkedin", iconLetter: BsLinkedin, link: 'https://www.linkedin.com/in/lingkon-dash/' },
              { platform: "github", iconLetter: BsGithub, link: 'https://github.com/LingkonDash' },
              { platform: "instagram", iconLetter: BsInstagram, link: 'https://www.instagram.com/lingkon.dash/' },
              { platform: "facebook", iconLetter: FaFacebook, link: 'https://www.facebook.com/lingkon.dash.2025' }
            ].map((social: SocialLinkProps) => (
              <a
                key={social.platform}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#4F46E5] hover:bg-[#4F46E5]/10 transition-all duration-300 text-xs font-bold"
                aria-label={`Follow us on ${social.platform}`}
              >
                <social.iconLetter />
              </a>
            ))}
          </div>
        </div>

        {/* Product Navigation — only real, working links */}
        <div className="animate-col space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">Product</h3>
          <ul className="space-y-2.5 text-sm text-slate-400">
            {[
              { label: "Explore Spaces", href: "/explore" },
              { label: "Become a Host", href: "/register" },
              { label: "How It Works", href: "/#howItWorks" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-[#4F46E5] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company — only real, working links */}
        <div className="animate-col space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">Company</h3>
          <ul className="space-y-2.5 text-sm text-slate-400">
            {[
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[#4F46E5] transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Integrated Footer Newsletter Form */}
        <div className="animate-col sm:col-span-2 lg:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">Stay Connected</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Subscribe to get the latest updates, workspace tips, and offers.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 focus-within:border-[#4F46E5] transition-colors"
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none placeholder-slate-500 text-white"
            />
            <button
              type="submit"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="bg-[#4F46E5] text-white px-4 rounded-lg flex items-center justify-center hover:bg-[#4338CA] transition-colors"
              aria-label="Submit email newsletter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar — copyright only, no dead legal links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center text-xs text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} SpaceSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}