import { FiCalendar, FiDollarSign, FiHome, FiClock, FiArrowRight, FiBox } from "react-icons/fi";
import Link from "next/link";
import { getAdminBookings } from "@/lib/action/bookings";
import { getAdminRooms } from "@/lib/api/rooms";
import AdminAnalyticsCharts from "./AdminAnalyticsCharts";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type CategoryCode = "co-working" | "meeting-room" | "event-hall" | "studio";
export type CategoryLabel = "Co-working" | "Meeting Room" | "Event Hall" | "Studio";
export type SpaceStatus = "pending" | "approved" | "rejected";

export interface AdminBooking {
    _id: string;
    spaceId: string;
    spaceTitle: string;
    spaceImages: string[];
    userId: string;
    userEmail: string;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: string | number;
    status: BookingStatus;
    createdAt: string | Date;
}

export interface Space {
    _id?: string;
    title: string;
    shortDescription: string;
    fullDescription?: string;
    images: string[];
    categoryCode: CategoryCode;
    category: CategoryLabel;
    location: string;
    hostEmail: string;
    hostName: string;
    city: string;
    pricePerHour: number;
    capacity: number;
    amenities?: string[];
    rating: number;
    reviewCount: number;
    status: SpaceStatus;
    createdAt?: Date;
}

const bookingStatusStyles: Record<BookingStatus, string> = {
    pending: "bg-[#F59E0B]/10 text-[#B45309]",
    confirmed: "bg-[#4F46E5]/10 text-[#4338CA]",
    completed: "bg-[#0D9488]/10 text-[#0F766E]",
    cancelled: "bg-[#EF4444]/10 text-[#B91C1C]",
};

async function AdminDashboardPage() {
    const [bookings, rooms]: [AdminBooking[], Space[]] = await Promise.all([
        getAdminBookings(),
        getAdminRooms(),
    ]);

    // --- Booking stats ---
    const totalBookings = bookings.length;

    const revenueStatuses: BookingStatus[] = ["confirmed", "completed"];
    const totalRevenue = bookings.reduce((sum, b) => {
        if (!revenueStatuses.includes(b.status)) return sum;
        const price = Number(b.totalPrice);
        return sum + (Number.isFinite(price) ? price : 0);
    }, 0);

    // --- Space stats ---
    const totalSpaces = rooms.length;
    const pendingSpaces = rooms.filter((r) => r.status === "pending");
    const pendingSpacesCount = pendingSpaces.length;

    // --- Bookings by status (chart 1) ---
    const statusOrder: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];
    const statusBreakdown = statusOrder
        .map((status) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: bookings.filter((b) => b.status === status).length,
        }))
        .filter((entry) => entry.value > 0);

    // --- Monthly platform revenue (chart 2) ---
    const monthlyRevenueMap = new Map<string, number>();
    bookings.forEach((b) => {
        if (!revenueStatuses.includes(b.status)) return;
        const price = Number(b.totalPrice);
        if (!Number.isFinite(price)) return;

        const d = new Date(b.date);
        const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) ?? 0) + price);
    });

    const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
        .map(([month, total]) => ({ month, total: Number(total.toFixed(2)) }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // --- Top spaces by booking count (chart 3) ---
    const spaceCountMap = new Map<string, { title: string; count: number }>();
    bookings.forEach((b) => {
        const existing = spaceCountMap.get(b.spaceId);
        if (existing) {
            existing.count += 1;
        } else {
            spaceCountMap.set(b.spaceId, { title: b.spaceTitle, count: 1 });
        }
    });

    // --- Spaces by approval status (chart 4) ---
    const spaceStatusOrder: SpaceStatus[] = ["pending", "approved", "rejected"];
    const spaceStatusBreakdown = spaceStatusOrder
        .map((status) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: rooms.filter((r) => r.status === status).length,
        }))
        .filter((entry) => entry.value > 0);

    const topSpaces = Array.from(spaceCountMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((s) => ({ name: s.title, value: s.count }));

    // --- Pending spaces to review, most recent first ---
    const recentPendingSpaces = [...pendingSpaces]
        .sort(
            (a, b) =>
                new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        )
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-neutral-bg px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-neutral-text sm:text-2xl">
                        Overview
                    </h1>
                    <p className="mt-1 text-sm text-neutral-text/60">
                        Platform-wide bookings, revenue and space approvals
                    </p>
                </div>

                {/* Stat cards */}
                <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={<FiDollarSign size={20} />}
                        label="Total revenue"
                        value={`৳${totalRevenue.toFixed(2)}`}
                        accent="text-[#B45309]"
                        bg="bg-[#F59E0B]/10"
                    />
                    <StatCard
                        icon={<FiCalendar size={20} />}
                        label="Total bookings"
                        value={totalBookings.toString()}
                        accent="text-[#4338CA]"
                        bg="bg-[#4F46E5]/10"
                    />
                    <StatCard
                        icon={<FiHome size={20} />}
                        label="Total spaces"
                        value={totalSpaces.toString()}
                        accent="text-[#0F766E]"
                        bg="bg-[#0D9488]/10"
                    />
                    <StatCard
                        icon={<FiClock size={20} />}
                        label="Pending spaces"
                        value={pendingSpacesCount.toString()}
                        accent="text-[#B45309]"
                        bg="bg-[#F59E0B]/10"
                    />
                </div>

                {/* Charts — client component */}
                {totalBookings > 0 ? (
                    <AdminAnalyticsCharts
                        statusBreakdown={statusBreakdown}
                        monthlyRevenue={monthlyRevenue}
                        topSpaces={topSpaces}
                        spaceStatusBreakdown={spaceStatusBreakdown}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-border bg-white py-16 text-center">
                        <FiCalendar size={32} className="mb-3 text-neutral-text/30" />
                        <p className="text-sm font-medium text-neutral-text">No data yet</p>
                        <p className="mt-1 text-sm text-neutral-text/50">
                            Once bookings start coming in, platform analytics will show up here.
                        </p>
                    </div>
                )}

                {/* Pending spaces awaiting approval */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-text/50">
                            Pending spaces
                        </h2>
                        <Link
                            href="/dashboard/admin/approvals"
                            className="flex items-center gap-1 rounded-full bg-[#F59E0B]/10 px-3 py-1.5 text-xs font-medium text-[#B45309] transition hover:bg-[#F59E0B]/15"
                        >
                            Review all <FiArrowRight size={12} />
                        </Link>
                    </div>

                    {recentPendingSpaces.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-border bg-white py-10 text-center">
                            <p className="text-sm text-neutral-text/50">No spaces waiting for approval.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-border overflow-hidden rounded-2xl border border-neutral-border bg-white">
                            {recentPendingSpaces.map((space) => (
                                <div
                                    key={space._id}
                                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-neutral-bg/60"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-bg text-neutral-text/40">
                                            <FiBox size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-neutral-text">
                                                {space.title}
                                            </p>
                                            <p className="truncate text-xs text-neutral-text/50">
                                                {space.hostName} · {space.category} · {space.city}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="shrink-0 whitespace-nowrap rounded-full bg-[#F59E0B]/10 px-3 py-1 text-xs font-medium capitalize text-[#B45309]">
                                        pending
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    accent,
    bg,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent: string;
    bg: string;
}) {
    return (
        <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${accent}`}>
                {icon}
            </div>
            <p className="text-xs text-neutral-text/50">{label}</p>
            <p className="mt-1 text-xl font-semibold text-neutral-text">{value}</p>
        </div>
    );
}

export default AdminDashboardPage;