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

interface StatusDatum {
  name: string;
  value: number;
}

interface MonthlyDatum {
  month: string;
  total: number;
}

interface BookingAnalyticsChartsProps {
  statusBreakdown: StatusDatum[];
  monthlySpending: MonthlyDatum[];
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Confirmed: "#4F46E5",
  Completed: "#0D9488",
  Cancelled: "#EF4444",
};

export default function BookingAnalyticsCharts({
  statusBreakdown,
  monthlySpending,
}: BookingAnalyticsChartsProps) {
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
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name] ?? "#94A3B8"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                }}
              />
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

      {/* Bar chart — monthly spending */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-neutral-text">
          Monthly spending
        </h2>
        <p className="mb-4 text-xs text-neutral-text/50">
          Total booking spend over time
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySpending} margin={{ left: -20 }}>
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
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                }}
                formatter={(value: number) => [`৳${value.toFixed(2)}`, "Spent"]}
              />
              <Bar dataKey="total" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}