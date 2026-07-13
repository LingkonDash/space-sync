/* 
now now the dashboard. 

i want you to make a dashboard for me that will be used by 3 role. admin host and user. read this prd doc to get the idea of overall overview. but this one is a bit old. i have updated some things in the web. so for now you can have it as the overview. and i will tell you what to do by giving you instructions. 

so first lets make the dashboard panle. here is the mock dashboard sidebar idea from my old project. you make it same but with the new project data. the prd and the dashboard sidebar is down bellow;

no need to make it that much complex just user the sidbar structure thats it. and give me DashboardSidebar.tsx file code in your body. dont make any other componnet all in one. since out project doesnt have that much routes and its very simple.

prd:
SpaceSync — Product Requirements Document
A co-working & event space booking platform Stack: Next.js (App Router) + TypeScript · MongoDB · Better Auth · Tailwind CSS · GSAP · Recharts

Deadline: 13 July, 8:00 PM

1. Concept Summary
SpaceSync lets people discover and book work/event spaces (co-working desks, meeting rooms, event halls, studios). Three roles:

User (Renter) — browses spaces, views details, books a time slot, leaves reviews after booking.
Host — lists their own spaces (pending admin approval), manages their listings and incoming bookings.
Admin — approves/rejects new space listings, manages users, views platform-wide stats.
No payment gateway required (not in requirements) — booking creates a request with status pending → confirmed → completed/cancelled, host confirms manually. This keeps scope realistic for a 3-day build.

2. Color System (max 3 primary + neutral)
Keep this locked everywhere — no exceptions, no extra accent colors.

Role	Hex	Usage
Primary — Indigo	#4F46E5	Buttons, active nav, links, primary CTAs
Secondary — Amber	#F59E0B	Highlights, ratings, badges, secondary CTAs
Accent — Teal	#0D9488	Success states, confirmed badges, chart accents
Neutral	#0F172A (text) / #F8FAFC (bg) / #E2E8F0 (borders)	Layout, cards, typography
Dark neutral text on light neutral background. One accent per UI moment — don't mix all 3 in a single card.

Typography: Inter (body) + Space Grotesk (headings) via next/font/google. Rounded corners rounded-xl everywhere, consistent shadow shadow-sm on cards, consistent border border-neutral-200.

Route	Purpose
/dashboard	Role-aware dashboard home (redirects based on role)
/dashboard/bookings	User: my bookings history
/dashboard/item/add	Host: add new space (protected, host+admin only)
/dashboard/items/manage	Host: manage my spaces (protected)
/dashboard/host/bookings	Host: incoming booking requests, confirm/cancel
/dashboard/admin/approvals	Admin: approve/reject pending spaces
/dashboard/admin/users	Admin: manage users
/dashboard/profile	Edit profile

Dashboards
User: upcoming/past bookings, leave review after completed booking.
Host: overview stats (Recharts: bookings over time, revenue estimate), manage spaces, incoming booking requests (confirm/cancel).
Admin: pending approvals queue, user management table (role change, delete with self-guard), platform stats charts.

thats the pretty much things.
*/





"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  MdDashboard,
  MdMenuBook,
  MdLocalShipping,
  MdAddBox,
  MdPeople,
  MdReceiptLong,
  MdStar,
  MdPerson,
  MdLogout,
  MdMenu,
  MdClose,
  MdAdminPanelSettings,
  MdLibraryBooks,
} from "react-icons/md";
import { BiBookOpen } from "react-icons/bi";
import { toast } from "react-toastify";
import { FaBookReader } from "react-icons/fa";

// ─── Nav Definitions ───────────────────────────────────────────────
const userNavItems = [
  { label: "Overview", href: "/dashboard/user", icon: MdDashboard },
  { label: "My Deliveries", href: "/dashboard/user/my-deliveries", icon: MdLocalShipping },
  { label: "My Reading list", href: "/dashboard/user/my-readinglist", icon: FaBookReader },
  { label: "My Reviews", href: "/dashboard/user/my-reviews", icon: MdStar },
  { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

const librarianNavItems = [
  { label: "Overview", href: "/dashboard/librarian", icon: MdDashboard },
  { label: "My Books", href: "/dashboard/librarian/my-books", icon: MdLibraryBooks },
  { label: "Add Book", href: "/dashboard/librarian/add-book", icon: MdAddBox },
  { label: "Manage Deliveries", href: "/dashboard/librarian/deliveries", icon: MdLocalShipping },
  { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

const adminNavItems = [
  { label: "Overview", href: "/dashboard/admin", icon: MdAdminPanelSettings },
  { label: "Manage All Books", href: "/dashboard/admin/manage-books", icon: MdMenuBook },
  { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: MdPeople },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: MdReceiptLong },
  { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

function getNavItems(role) {
  if (role === "admin") return adminNavItems;
  if (role === "librarian") return librarianNavItems;
  return userNavItems;
}

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    textColor: "text-rose-600",
    bgColor: "bg-rose-50",
    dotColor: "bg-rose-500",
  },
  librarian: {
    label: "Librarian",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    dotColor: "bg-blue-500",
  },
  user: {
    label: "Reader",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    dotColor: "bg-emerald-500",
  },
};

// ─── Nav Link ──────────────────────────────────────────────────────
function NavLink({ item, pathname, onClick }) {
  const isActive = pathname === item.href;

  return (
    <div>
      <Link
        href={item.href}
        onClick={onClick}
        className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group overflow-hidden ${
          isActive
            ? "text-white"
            : "text-gray-500 hover:text-[#fc4a32] hover:bg-[#fc4a32]/5"
        }`}
      >
        {/* Active pill background */}
        {isActive && (
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#fc4a32] to-[#ff6b4a] shadow-lg shadow-[#fc4a32]/30" />
        )}

        {/* Left accent bar for active */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-white/60" />
        )}

        <item.icon
          className={`relative size-[18px] shrink-0 transition-colors duration-200 ${
            isActive
              ? "text-white"
              : "text-gray-400 group-hover:text-[#fc4a32]"
          }`}
        />
        <span className="relative tracking-[-0.01em]">{item.label}</span>

        {/* Hover shimmer */}
        {!isActive && (
          <span className="absolute inset-0 rounded-2xl bg-[#fc4a32] opacity-0 group-hover:opacity-[0.04] transition-opacity duration-200" />
        )}
      </Link>
    </div>
  );
}

// ─── User Avatar ───────────────────────────────────────────────────
function UserAvatar({ session, size = "md" }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = session?.user?.image;
  const name = session?.user?.name || "U";
  const sizeClasses = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";

  if (imageUrl && !imgError) {
    return (
      <div className={`${sizeClasses} rounded-full overflow-hidden ring-2 ring-[#fc4a32]/20 shrink-0`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#fc4a32] to-[#ff7a5a] flex items-center justify-center shrink-0 ring-2 ring-[#fc4a32]/20`}
    >
      <MdPerson className="text-white size-5" />
    </div>
  );
}

// ─── Sidebar Core Content ──────────────────────────────────────────
function SidebarContent({ session, pathname, onNavClick, router, showCloseButton = false }) {
  const role = session?.user?.userRole || "user";
  const navItems = getNavItems(role);
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG["user"];
  const name = session?.user?.name || "User";
  const email = session?.user?.email || "";

  const handleLogout = async () => {
    const data = await authClient.signOut();
    if (!data?.success) {
      toast.success("Signed out successfully!");
      router.push("/login");
    } else {
      toast.error("Something went wrong, try again.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* ── Brand Layout Header ── */}
      <div className="px-5 pt-6 pb-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group w-fit" onClick={onNavClick}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#fc4a32] to-[#e03a24] flex items-center justify-center shadow-md shadow-[#fc4a32]/35 group-hover:shadow-[#fc4a32]/50 transition-shadow duration-300">
            <BiBookOpen className="text-white size-5" />
          </div>
          <div className="leading-none">
            <span className="font-extrabold text-gray-900 text-[17px] tracking-tight">
              Book
            </span>
            <span className="font-extrabold text-[17px] tracking-tight text-[#fc4a32]">
              Hub
            </span>
          </div>
        </Link>

        {/* Floating Close Switch for Mobile Drawer Layouts */}
        {showCloseButton && (
          <button
            onClick={onNavClick}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 active:scale-95"
            aria-label="Close menu"
          >
            <MdClose className="size-5" />
          </button>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-gray-100" />

      {/* ── User Profile Snapshot ── */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50/80 border border-gray-100 px-3.5 py-3">
          <UserAvatar session={session} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-gray-900 truncate leading-snug">
              {name}
            </p>
            {email && (
              <p className="text-[11px] text-gray-400 truncate leading-snug mt-0.5">
                {email}
              </p>
            )}
            <span
              className={`inline-flex items-center gap-1 mt-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${roleConfig.bgColor} ${roleConfig.textColor}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dotColor}`} />
              {roleConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-gray-100" />

      {/* ── Navigation Tree ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] px-3.5 mb-2">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* ── Footer Actions ── */}
      <div className="mx-4 h-px bg-gray-100" />
      <div className="px-3 py-4 flex flex-col gap-1">
        <button
          onClick={() => {
            onNavClick?.();
            handleLogout();
          }}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full group"
        >
          <MdLogout className="size-[18px] text-gray-400 group-hover:text-red-400 transition-colors shrink-0" />
          <span>Sign Out</span>
        </button>
        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
        >
          <span className="text-base leading-none">←</span>
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────
export default function DashboardSidebar({ session }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-100/80 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)] z-30">
        <SidebarContent
          session={session}
          pathname={pathname}
          onNavClick={() => {}}
          router={router}
        />
      </aside>

      {/* 2. Mobile Global Top Navigation Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#fc4a32] to-[#e03a24] flex items-center justify-center shadow-md shadow-[#fc4a32]/30">
            <BiBookOpen className="text-white size-4" />
          </div>
          <span className="font-extrabold text-gray-900 text-sm tracking-tight">
            Book<span className="text-[#fc4a32]">Hub</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <UserAvatar session={session} size="sm" />
          
          {/* Custom Action Trigger replacing HeroUI Drawer Button setup */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100/80 border border-gray-100 transition-all duration-200 active:scale-95"
            aria-label="Open menu options"
          >
            <MdMenu className="size-5" />
          </button>
        </div>
      </div>

      {/* 3. Sliding Right Drawer Component (Pure CSS Transitions) */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-visibility duration-300 ${
          isOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        {/* Dynamic Dark Matte Backdrop Cover */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Right-Aligned Sliding Core Wrapper Panel */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-full max-w-[290px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SidebarContent
            session={session}
            pathname={pathname}
            onNavClick={() => setIsOpen(false)}
            router={router}
            showCloseButton={true}
          />
        </div>
      </div>

      {/* Mobile top structural padding offset spacer */}
      <div className="lg:hidden h-[57px]" />
    </>
  );
}