import { FiCalendar, FiDollarSign, FiClock, FiBox, FiArrowRight, FiHome } from "react-icons/fi";
import Link from "next/link";
import { getHostBookings } from "@/lib/action/bookings";
import HostAnalyticsCharts from "./HostAnalyticsCharts";
import { manageValidator } from "@/utils/manageValidator";
import { Booking, BookingStatus } from "@/types/bookings";
import { CategoryLabel, Space, SpaceStatus } from "@/types/space";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-[#F59E0B]/15 text-[#F59E0B]",
  confirmed: "bg-[#4F46E5]/15 text-[#4F46E5]",
  completed: "bg-[#0D9488]/15 text-[#0D9488]",
  cancelled: "bg-red-500/10 text-red-600",
};

async function HostDashboardPage() {
  const bookings: Booking[] = await getHostBookings();
  const { role, canManage, roomData } = await manageValidator();
  const spaces: Space[] = roomData ?? [];

  // --- Core stats ---
  const totalBookings = bookings.length;
  const totalSpaces = spaces.length;

  // "Earning" = money actually secured — confirmed or completed bookings.
  // Pending bookings aren't counted yet, cancelled never counts.
  const earningStatuses: BookingStatus[] = ["confirmed", "completed"];
  const totalEarning = bookings.reduce((sum, b) => {
    if (!earningStatuses.includes(b.status)) return sum;
    const price = Number(b.totalPrice);
    return sum + (Number.isFinite(price) ? price : 0);
  }, 0);

  const upcomingCount = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  ).length;

  // --- Bookings by status (chart 1) ---
  const statusOrder: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];
  const statusBreakdown = statusOrder
    .map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: bookings.filter((b) => b.status === status).length,
    }))
    .filter((entry) => entry.value > 0);

  // --- Monthly earning trend (chart 2) ---
  const monthlyEarningMap = new Map<string, number>();

  bookings.forEach((b) => {
    if (!earningStatuses.includes(b.status)) return;
    const price = Number(b.totalPrice);
    if (!Number.isFinite(price)) return;

    const d = new Date(b.date);
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthlyEarningMap.set(key, (monthlyEarningMap.get(key) ?? 0) + price);
  });

  const monthlyEarning = Array.from(monthlyEarningMap.entries())
    .map(([month, total]) => ({ month, total: Number(total.toFixed(2)) }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // --- Spaces by category (chart 3) ---
  const categoryLabels: CategoryLabel[] = ["Co-working", "Meeting Room", "Event Hall", "Studio"];
  const categoryBreakdown = categoryLabels
    .map((label) => ({
      name: label,
      value: spaces.filter((s) => s.category === label).length,
    }))
    .filter((entry) => entry.value > 0);

  // --- Spaces by status (chart 4) ---
  const spaceStatusOrder: SpaceStatus[] = ["approved", "pending", "rejected"];
  const spaceStatusBreakdown = spaceStatusOrder
    .map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: spaces.filter((s) => s.status === status).length,
    }))
    .filter((entry) => entry.value > 0);

  // --- Recent bookings ---
  const recentBookings = [...bookings].slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-bg px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-text sm:text-2xl">
            Overview
          </h1>
          <p className="mt-1 text-sm text-neutral-text/60">
            A quick look at your spaces, bookings and earnings
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FiDollarSign size={20} />}
            label="Total earning"
            value={`৳${totalEarning.toFixed(2)}`}
            accent="text-[#F59E0B]"
            bg="bg-[#F59E0B]/10"
          />
          <StatCard
            icon={<FiCalendar size={20} />}
            label="Total bookings"
            value={totalBookings.toString()}
            accent="text-[#4F46E5]"
            bg="bg-[#4F46E5]/10"
          />
          <StatCard
            icon={<FiHome size={20} />}
            label="Your spaces"
            value={totalSpaces.toString()}
            accent="text-[#0D9488]"
            bg="bg-[#0D9488]/10"
          />
          <StatCard
            icon={<FiClock size={20} />}
            label="Upcoming"
            value={upcomingCount.toString()}
            accent="text-neutral-text"
            bg="bg-neutral-text/5"
          />
        </div>

        {/* Charts — client component */}
        {totalBookings > 0 || totalSpaces > 0 ? (
          <HostAnalyticsCharts
            statusBreakdown={statusBreakdown}
            monthlyEarning={monthlyEarning}
            categoryBreakdown={categoryBreakdown}
            spaceStatusBreakdown={spaceStatusBreakdown}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-border bg-white py-16 text-center">
            <FiCalendar size={32} className="mb-3 text-neutral-text/30" />
            <p className="text-sm font-medium text-neutral-text">No data yet</p>
            <p className="mt-1 text-sm text-neutral-text/50">
              List a space and get your first booking to see analytics here.
            </p>
          </div>
        )}

        {/* Recent bookings */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-text/50">
              Recent bookings
            </h2>
            <Link
              href="/dashboard/host/bookings"
              className="flex items-center gap-1 rounded-full bg-[#4F46E5]/10 px-3 py-1.5 text-xs font-medium text-[#4F46E5] transition hover:bg-[#4F46E5]/15"
            >
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-border bg-white py-10 text-center">
              <p className="text-sm text-neutral-text/50">No recent bookings yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-border overflow-hidden rounded-2xl border border-neutral-border bg-white">
              {recentBookings.map((booking) => {
                const price = Number(booking.totalPrice);
                return (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-neutral-bg/60"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-bg text-neutral-text/40">
                        <FiBox size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-text">
                          {booking.spaceTitle}
                        </p>
                        <p className="text-xs text-neutral-text/50">
                          ৳{Number.isFinite(price) ? price.toFixed(2) : booking.totalPrice} fee
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/host/bookings"
            className="group flex items-center justify-between rounded-2xl border border-neutral-border bg-white p-5 shadow-sm transition hover:border-[#4F46E5]/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                <FiCalendar size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-text">Manage bookings</p>
                <p className="text-xs text-neutral-text/50">Review and update booking status</p>
              </div>
            </div>
            <FiArrowRight
              size={16}
              className="shrink-0 text-neutral-text/30 transition group-hover:translate-x-0.5 group-hover:text-[#4F46E5]"
            />
          </Link>

          <Link
            href="/dashboard/items/manage"
            className="group flex items-center justify-between rounded-2xl border border-neutral-border bg-white p-5 shadow-sm transition hover:border-[#0D9488]/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D9488]/10 text-[#0D9488]">
                <FiHome size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-text">Manage spaces</p>
                <p className="text-xs text-neutral-text/50">Edit, add or remove your listings</p>
              </div>
            </div>
            <FiArrowRight
              size={16}
              className="shrink-0 text-neutral-text/30 transition group-hover:translate-x-0.5 group-hover:text-[#0D9488]"
            />
          </Link>
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

export default HostDashboardPage;