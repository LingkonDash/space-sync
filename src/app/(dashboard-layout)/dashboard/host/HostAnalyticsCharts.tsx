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

interface HostAnalyticsChartsProps {
  statusBreakdown: NamedDatum[];
  monthlyEarning: MonthlyDatum[];
  categoryBreakdown: NamedDatum[];
  spaceStatusBreakdown: NamedDatum[];
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Confirmed: "#4F46E5",
  Completed: "#0D9488",
  Cancelled: "#EF4444",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Co-working": "#4F46E5",
  "Meeting Room": "#F59E0B",
  "Event Hall": "#0D9488",
  Studio: "#8B5CF6",
};

const SPACE_STATUS_COLORS: Record<string, string> = {
  Approved: "#0D9488",
  Pending: "#F59E0B",
  Rejected: "#EF4444",
};

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #E2E8F0",
  fontSize: 13,
};

export default function HostAnalyticsCharts({
  statusBreakdown,
  monthlyEarning,
  categoryBreakdown,
  spaceStatusBreakdown,
}: HostAnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Pie chart — bookings by status */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Bookings by status
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          Distribution across your booking lifecycle
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

      {/* Bar chart — monthly earning */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Monthly earning
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          Confirmed &amp; completed booking revenue over time
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyEarning} margin={{ left: -20 }}>
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
                formatter={(value: number) => [`৳${value.toFixed(2)}`, "Earned"]}
              />
              <Bar dataKey="total" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Horizontal bar chart — spaces by category */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Spaces by category
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          How your listings break down by type
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryBreakdown}
              layout="vertical"
              margin={{ left: 10, right: 20 }}
            >
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
                width={90}
              />
              <Tooltip cursor={{ fill: "#F8FAFC" }} contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {categoryBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? "#94A3B8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart — spaces by moderation status */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Spaces by status
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          Approval status of your listings
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
    </div>
  );
}