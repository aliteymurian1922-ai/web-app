import type { ReactNode } from "react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/constants";
import { toFa } from "@/lib/jalali";

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-black text-navy-950 lg:text-3xl">{title}</h1>
        {desc && <p className="mt-1.5 text-sm text-navy-400">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card-glow rounded-3xl border border-white bg-white ${className}`}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  trend,
  accent = "navy",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: string;
  trend?: number;
  accent?: "navy" | "gold" | "emerald" | "violet" | "rose" | "sky";
}) {
  const accents = {
    navy: "from-navy-900 to-navy-700 text-gold-300",
    gold: "from-gold-500 to-gold-300 text-navy-950",
    emerald: "from-emerald-500 to-emerald-400 text-white",
    violet: "from-violet-600 to-violet-400 text-white",
    rose: "from-rose-500 to-rose-400 text-white",
    sky: "from-sky-500 to-sky-400 text-white",
  } as const;
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-navy-400">{label}</div>
          <div className="mt-2 text-3xl font-black tabular-nums text-navy-950">{typeof value === "number" ? toFa(value) : value}</div>
          {hint && <div className="mt-1 text-[0.7rem] text-navy-300">{hint}</div>}
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-xl shadow-lg ${accents[accent]}`}>{icon}</div>
      </div>
      {trend !== undefined && (
        <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {trend >= 0 ? "▲" : "▼"} {toFa(Math.abs(trend))}٪ نسبت به هفته قبل
        </div>
      )}
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = LEAD_STATUSES[status as LeadStatus] ?? LEAD_STATUSES.new;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ring-1 ${s.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function AgentChip({ name, color, slug }: { name: string | null; color: string | null; slug?: string | null }) {
  if (!name) {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-navy-400">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy-50 text-navy-300">🌐</span>
        وب‌سایت (مستقیم)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-navy-800">
      <span className="grid h-7 w-7 place-items-center rounded-lg text-[0.7rem] font-black text-white" style={{ background: color ?? "#1b2f57" }}>
        {name.slice(0, 1)}
      </span>
      <span>
        {name}
        {slug && <span className="mr-1 font-mono text-[0.6rem] text-navy-300" dir="ltr">/{slug}</span>}
      </span>
    </span>
  );
}

/** نمودار میله‌ای ساده و زیبا با SVG */
export function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(1, ...data);
  const w = 100 / data.length;
  return (
    <div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-44 w-full">
        <defs>
          <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c9a24a" />
            <stop offset="100%" stopColor="#1b2f57" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2="100" y1={40 - g * 38} y2={40 - g * 38} stroke="#e6ebf5" strokeWidth="0.2" />
        ))}
        {data.map((v, i) => {
          const h = (v / max) * 36;
          return (
            <g key={i}>
              <rect x={i * w + w * 0.2} y={40 - h - 1} width={w * 0.6} height={h + 1} rx="0.8" fill="url(#barGrad)" opacity={v === 0 ? 0.15 : 0.95} />
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[0.6rem] text-navy-300">
        {labels.map((l, i) => (
          <span key={i} className={i % 2 ? "hidden sm:block" : ""}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = Math.max(1, segments.reduce((a, s) => a + s.value, 0));
  let acc = 0;
  const r = 15.9;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 42 42" className="h-36 w-36 -rotate-90">
        <circle cx="21" cy="21" r={r} fill="none" stroke="#eef2f9" strokeWidth="5" />
        {segments.map((s) => {
          const pct = (s.value / total) * 100;
          const el = (
            <circle
              key={s.label}
              cx="21" cy="21" r={r} fill="none"
              stroke={s.color} strokeWidth="5"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={-acc}
              strokeLinecap="butt"
            />
          );
          acc += pct;
          return el;
        })}
      </svg>
      <ul className="space-y-2 text-xs">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-navy-500">{s.label}</span>
            <span className="mr-auto font-bold tabular-nums text-navy-900">{toFa(s.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-navy-50 text-3xl">📭</div>
      <div className="mt-4 font-extrabold text-navy-900">{title}</div>
      <div className="mt-1 max-w-xs text-xs leading-6 text-navy-400">{desc}</div>
    </div>
  );
}
