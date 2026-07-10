"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { HiOutlineMenu, HiOutlineX, HiChevronDown } from "react-icons/hi";
import { FiUser, FiGrid, FiLogOut } from "react-icons/fi";

// import { authClient } from "@/lib/core/client"; // adjust path to match your better-auth client export
import logo from "@/images/spaceSyncLogo.svg";
import type { SessionUser } from "@/types/auth";

interface NavLink {
    label: string;
    href: string;
}

const PUBLIC_LINKS: NavLink[] = [
    { label: "Explore", href: "/explore" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const USER_LINKS: NavLink[] = [{ label: "My Bookings", href: "/dashboard/bookings" }];

const HOST_LINKS: NavLink[] = [
    { label: "Add Space", href: "/items/add" },
    { label: "Manage Spaces", href: "/items/manage" },
];

function getRoleLinks(role: SessionUser["role"]): NavLink[] {
    if (role === "host" || role === "admin") {
        return [...USER_LINKS, ...HOST_LINKS];
    }
    return USER_LINKS;
}

// Treats "/" as exact-match only, everything else as prefix-match
// so /dashboard/bookings/123 still highlights "My Bookings"
function isActiveLink(pathname: string, href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavbarClientProps {
    user: SessionUser | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const navRef = useRef<HTMLElement | null>(null);
    const mobileMenuRef = useRef<HTMLDivElement | null>(null);
    const profileMenuRef = useRef<HTMLDivElement | null>(null);
    const profileWrapperRef = useRef<HTMLDivElement | null>(null);

    const navLinks = user ? [...PUBLIC_LINKS, ...getRoleLinks(user.role)] : PUBLIC_LINKS;
    const dashboardHref = user ? `/dashboard/${user.role}` : "/dashboard";

    // Entrance animation
    useEffect(() => {
        if (!navRef.current) return;
        gsap.fromTo(
            navRef.current,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        );
    }, []);

    // Mobile menu slide animation
    useEffect(() => {
        if (!mobileMenuRef.current) return;
        if (mobileOpen) {
            gsap.to(mobileMenuRef.current, {
                x: 0,
                duration: 0.4,
                ease: "power3.out",
            });
        } else {
            gsap.to(mobileMenuRef.current, {
                x: "100%",
                duration: 0.35,
                ease: "power2.in",
            });
        }
    }, [mobileOpen]);

    // Profile dropdown animation
    useEffect(() => {
        if (!profileMenuRef.current) return;
        if (profileOpen) {
            gsap.fromTo(
                profileMenuRef.current,
                { opacity: 0, y: -8, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
            );
        }
    }, [profileOpen]);

    // Close profile dropdown / mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [pathname]);

    // Close profile dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileWrapperRef.current &&
                !profileWrapperRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleSignOut() {
        console.log("signout clicked");
        return;
        // await authClient.signOut();
        setProfileOpen(false);
        router.push("/");
        router.refresh();
    }

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo} alt="SpaceSync logo" className="h-8 w-auto" priority />
                    <h1 className="text-xl font-bold tracking-tight">
                        <span className="text-[#0B1238]">Space</span>
                        <span className="text-[#4F46E5]">Sync</span>
                    </h1>
                </Link>

                {/* Desktop links - Boxed and Rounded */}
                <div className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => {
                        const active = isActiveLink(pathname, link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                    active 
                                        ? "bg-indigo-50 text-indigo-600" 
                                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side: auth area (desktop) */}
                <div className="hidden items-center gap-4 md:flex">
                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                    isActiveLink(pathname, "/login")
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                }`}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <div ref={profileWrapperRef} className="relative">
                            <button
                                onClick={() => setProfileOpen((prev) => !prev)}
                                className={`flex items-center gap-1.5 rounded-full border-2 py-0.5 pl-0.5 pr-2 transition-colors ${
                                    profileOpen
                                        ? "border-indigo-400"
                                        : "border-slate-200 hover:border-indigo-400"
                                }`}
                                aria-label="Open profile menu"
                            >
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                        <FiUser className="h-4 w-4" />
                                    </div>
                                )}
                                <HiChevronDown
                                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                                        profileOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {profileOpen && (
                                <div
                                    ref={profileMenuRef}
                                    className="absolute right-0 mt-3 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
                                >
                                    <div className="border-b border-slate-100 px-3 py-2">
                                        <p className="truncate text-sm font-medium text-slate-800">{user.name}</p>
                                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                                    </div>

                                    <Link
                                        href={dashboardHref}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                                            isActiveLink(pathname, dashboardHref)
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <FiGrid className="h-4 w-4" />
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/profile"
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                                            isActiveLink(pathname, "/profile")
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <FiUser className="h-4 w-4" />
                                        Profile
                                    </Link>

                                    <button
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <FiLogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="text-slate-700 md:hidden"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                >
                    <HiOutlineMenu className="h-7 w-7" />
                </button>
            </div>

            {/* Mobile slide-in menu */}
            <div
                ref={mobileMenuRef}
                className="fixed top-0 right-0 z-50 h-screen w-72 translate-x-full bg-white shadow-xl md:hidden"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <span className="font-semibold text-slate-800">Menu</span>
                    <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                        <HiOutlineX className="h-6 w-6 text-slate-700" />
                    </button>
                </div>

                {user && (
                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <FiUser className="h-5 w-5" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">{user.name}</p>
                            <p className="truncate text-xs text-slate-500">{user.email}</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-1 px-3 py-4">
                    {navLinks.map((link) => {
                        const active = isActiveLink(pathname, link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                    active
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {user && (
                        <>
                            <Link
                                href={dashboardHref}
                                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                    isActiveLink(pathname, dashboardHref)
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/profile"
                                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                    isActiveLink(pathname, "/profile")
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                Profile
                            </Link>
                        </>
                    )}
                </div>

                <div className="mt-auto border-t border-slate-100 px-5 py-4">
                    {!user ? (
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/login"
                                className="rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
                            >
                                Register
                            </Link>
                        </div>
                    ) : (
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                        >
                            <FiLogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile overlay backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </nav>
    );
}