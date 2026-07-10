import type { IconType } from "react-icons";

interface StatCardProps {
  icon: IconType;
  value: string;
  label: string;
}

export default function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-neutral-border)] bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-[var(--color-neutral-text)]">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}