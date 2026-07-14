"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface NamedDatum {
  name: string;
  value: number;
}

interface MonthlyDatum {
  month: string;
  total: number;
}

interface AdminAnalyticsChartsProps {
  statusBreakdown: NamedDatum[];
  monthlyRevenue: MonthlyDatum[];
  topSpaces: NamedDatum[];
  spaceStatusBreakdown: NamedDatum[];
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Confirmed: "#4F46E5",
  Completed: "#0D9488",
  Cancelled: "#EF4444",
};

const SPACE_STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Approved: "#0D9488",
  Rejected: "#EF4444",
};

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #E2E8F0",
  fontSize: 13,
};

export default function AdminAnalyticsCharts({
  statusBreakdown,
  monthlyRevenue,
  topSpaces,
  spaceStatusBreakdown,
}: AdminAnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Pie chart — bookings by status */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Bookings by status
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          Platform-wide booking lifecycle distribution
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {statusBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#94A3B8"} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: "#0F172A" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart — spaces by approval status */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Spaces by approval status
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          How many spaces are pending, approved or rejected
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spaceStatusBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {spaceStatusBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={SPACE_STATUS_COLORS[entry.name] ?? "#94A3B8"} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: "#0F172A" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar chart — monthly platform revenue */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Monthly revenue
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          Confirmed &amp; completed bookings across all hosts
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#0F172A" }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#0F172A" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `৳${v}`}
              />
              <Tooltip
                cursor={{ fill: "#F8FAFC" }}
                contentStyle={tooltipStyle}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              />
              <Bar dataKey="total" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Horizontal bar chart — top spaces by bookings */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Top spaces
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          Most-booked spaces across the platform
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSpaces} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#0F172A" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#0F172A" }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip cursor={{ fill: "#F8FAFC" }} contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#0D9488" radius={[0, 6, 6, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}