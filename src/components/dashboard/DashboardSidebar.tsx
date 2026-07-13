"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  MdDashboard,
  MdBookOnline,
  MdAddBox,
  MdMeetingRoom,
  MdPeople,
  MdOutlineHolidayVillage,
  MdPerson,
  MdLogout,
  MdMenu,
  MdClose,
  MdAdminPanelSettings,
  MdFactCheck,
} from "react-icons/md";
import { toast } from "react-toastify";

// ─── Types ─────────────────────────────────────────────────────────
type Role = "admin" | "host" | "user";

interface SessionUser {
  name?: string;
  email?: string;
  image?: string;
  userRole?: Role;
}

interface Session {
  user?: SessionUser;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardSidebarProps {
  session: Session | null;
}

// ─── Nav Definitions ───────────────────────────────────────────────
const userNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/user", icon: MdDashboard },
  { label: "My Bookings", href: "/dashboard/user/bookings", icon: MdBookOnline },
  { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

const hostNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/host", icon: MdDashboard },
  { label: "Add Space", href: "/dashboard/items/add", icon: MdAddBox },
  { label: "Manage Spaces", href: "/dashboard/items/manage", icon: MdOutlineHolidayVillage },
  { label: "Booking Requests", href: "/dashboard/host/bookings", icon: MdMeetingRoom },
  { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

const adminNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: MdAdminPanelSettings },
  { label: "Approvals", href: "/dashboard/admin/approvals", icon: MdFactCheck },
  { label: "Manage Spaces", href: "/dashboard/items/manage", icon: MdOutlineHolidayVillage },
  { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

function getNavItems(role: Role): NavItem[] {
  if (role === "admin") return adminNavItems;
  if (role === "host") return hostNavItems;
  return userNavItems;
}

const ROLE_CONFIG: Record<Role, { label: string; textColor: string; bgColor: string; dotColor: string }> = {
  admin: {
    label: "Admin",
    textColor: "text-[#0D9488]",
    bgColor: "bg-[#0D9488]/10",
    dotColor: "bg-[#0D9488]",
  },
  host: {
    label: "Host",
    textColor: "text-[#F59E0B]",
    bgColor: "bg-[#F59E0B]/10",
    dotColor: "bg-[#F59E0B]",
  },
  user: {
    label: "Renter",
    textColor: "text-[#4F46E5]",
    bgColor: "bg-[#4F46E5]/10",
    dotColor: "bg-[#4F46E5]",
  },
};

// ─── Nav Link ──────────────────────────────────────────────────────
function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group overflow-hidden ${isActive
          ? "text-white"
          : "text-slate-500 hover:text-[#4F46E5] hover:bg-[#4F46E5]/5"
        }`}
    >
      {isActive && (
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366f1] shadow-lg shadow-[#4F46E5]/30" />
      )}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-white/60" />
      )}

      <item.icon
        className={`relative size-[18px] shrink-0 transition-colors duration-200 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#4F46E5]"
          }`}
      />
      <span className="relative tracking-[-0.01em]">{item.label}</span>

      {!isActive && (
        <span className="absolute inset-0 rounded-xl bg-[#4F46E5] opacity-0 group-hover:opacity-[0.04] transition-opacity duration-200" />
      )}
    </Link>
  );
}

// ─── User Avatar ───────────────────────────────────────────────────
function UserAvatar({ session, size = "md" }: { session: Session | null; size?: "md" | "sm" }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = session?.user?.image;
  const name = session?.user?.name || "U";
  const sizeClasses = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";

  if (imageUrl && !imgError) {
    return (
      <div className={`${sizeClasses} rounded-full overflow-hidden ring-2 ring-[#4F46E5]/20 shrink-0`}>
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
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366f1] flex items-center justify-center shrink-0 ring-2 ring-[#4F46E5]/20`}
    >
      <MdPerson className="text-white size-5" />
    </div>
  );
}

// ─── Sidebar Core Content ──────────────────────────────────────────
function SidebarContent({
  session,
  pathname,
  onNavClick,
  router,
  showCloseButton = false,
}: {
  session: Session | null;
  pathname: string;
  onNavClick?: () => void;
  router: ReturnType<typeof useRouter>;
  showCloseButton?: boolean;
}) {
  const role: Role = session?.user?.userRole || "user";
  const navItems = getNavItems(role);
  const roleConfig = ROLE_CONFIG[role];
  const name = session?.user?.name || "User";
  const email = session?.user?.email || "";

  const handleLogout = async () => {
    const data = await authClient.signOut();
    if (!data?.error) {
      toast.success("Signed out successfully!");
      router.push("/login");
    } else {
      toast.error("Something went wrong, try again.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* ── Brand Header ── */}
      <div className="px-5 pt-6 pb-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group w-fit" onClick={onNavClick}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#4338ca] flex items-center justify-center shadow-md shadow-[#4F46E5]/35 group-hover:shadow-[#4F46E5]/50 transition-shadow duration-300">
            <MdMeetingRoom className="text-white size-5" />
          </div>
          <div className="leading-none">
            <span className="font-extrabold text-slate-900 text-[17px] tracking-tight">
              Space
            </span>
            <span className="font-extrabold text-[17px] tracking-tight text-[#4F46E5]">
              Sync
            </span>
          </div>
        </Link>

        {showCloseButton && (
          <button
            onClick={onNavClick}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 active:scale-95"
            aria-label="Close menu"
          >
            <MdClose className="size-5" />
          </button>
        )}
      </div>

      <div className="mx-4 h-px bg-slate-100" />

      {/* ── User Profile Snapshot ── */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 border border-slate-100 px-3.5 py-3">
          <UserAvatar session={session} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-slate-900 truncate leading-snug">
              {name}
            </p>
            {email && (
              <p className="text-[11px] text-slate-400 truncate leading-snug mt-0.5">
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

      <div className="mx-4 h-px bg-slate-100" />

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] px-3.5 mb-2">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="mx-4 h-px bg-slate-100" />
      <div className="px-3 py-4 flex flex-col gap-1">
        <button
          onClick={() => {
            onNavClick?.();
            handleLogout();
          }}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full group"
        >
          <MdLogout className="size-[18px] text-slate-400 group-hover:text-red-400 transition-colors shrink-0" />
          <span>Sign Out</span>
        </button>
        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all duration-200"
        >
          <span className="text-base leading-none">←</span>
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────
export default function DashboardSidebar({ session }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-slate-100/80 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)] z-30">
        <SidebarContent session={session} pathname={pathname} onNavClick={() => { }} router={router} />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#4338ca] flex items-center justify-center shadow-md shadow-[#4F46E5]/30">
            <MdMeetingRoom className="text-white size-4" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm tracking-tight">
            Space<span className="text-[#4F46E5]">Sync</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <UserAvatar session={session} size="sm" />
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100/80 border border-slate-100 transition-all duration-200 active:scale-95"
            aria-label="Open menu options"
          >
            <MdMenu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-visibility duration-300 ${isOpen ? "visible" : "invisible pointer-events-none"
          }`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-full max-w-[290px] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
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

      <div className="lg:hidden h-[57px]" />
    </>
  );
}