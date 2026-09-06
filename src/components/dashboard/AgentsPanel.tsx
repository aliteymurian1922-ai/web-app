"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AgentStats } from "@/lib/data";
import { AGENT_COLORS } from "@/lib/constants";
import { toFa } from "@/lib/jalali";
import { Card } from "@/components/dashboard/ui";

export function AgentsPanel({ agents }: { agents: AgentStats[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", phone: "", role: "کارشناس فروش", color: AGENT_COLORS[3] });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);

  const linkFor = (slug: string) => `${origin}/book/${slug}`;

  async function copy(slug: string) {
    try {
      await navigator.clipboard.writeText(linkFor(slug));
      setCopied(slug);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      prompt("لینک را کپی کنید:", linkFor(slug));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error ?? "خطا");
    setForm({ name: "", slug: "", phone: "", role: "کارشناس فروش", color: AGENT_COLORS[Math.floor(Math.random() * AGENT_COLORS.length)] });
    setShowForm(false);
    startTransition(() => router.refresh());
  }

  async function toggle(id: number, isActive: boolean) {
    await fetch("/api/agents", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive }) });
    startTransition(() => router.refresh());
  }

  const maxLeads = Math.max(1, ...agents.map((a) => a.totalLeads));

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button onClick={() => setShowForm((v) => !v)} className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-navy-800">
          {showForm ? "بستن فرم" : "+ افزودن کارشناس جدید"}
        </button>
      </div>

      {showForm && (
        <Card className="animate-fade-up mb-6 p-6">
          <h3 className="font-extrabold text-navy-950">کارشناس جدید</h3>
          <p className="mt-1 text-xs text-navy-400">پس از ثبت، لینک اختصاصی به‌صورت خودکار ساخته می‌شود.</p>
          <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <L label="نام و نام خانوادگی *">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} placeholder="مثال: نگار احمدی" />
            </L>
            <L label="شناسه لینک (انگلیسی) *">
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                dir="ltr"
                className={`${inp} font-mono`}
                placeholder="negar"
              />
              <span className="mt-1 block truncate text-[0.65rem] text-navy-300" dir="ltr">{origin}/book/{form.slug || "…"}</span>
            </L>
            <L label="شماره تماس">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" className={inp} placeholder="0912…" />
            </L>
            <L label="سمت">
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inp} />
            </L>
            <div className="sm:col-span-2 lg:col-span-3">
              <span className="mb-1.5 block text-xs font-bold text-navy-700">رنگ شناسایی</span>
              <div className="flex gap-2">
                {AGENT_COLORS.map((c) => (
                  <button type="button" key={c} onClick={() => setForm({ ...form, color: c })} className={`h-8 w-8 rounded-full transition ${form.color === c ? "ring-2 ring-navy-900 ring-offset-2" : ""}`} style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="flex items-end justify-end gap-3">
              {error && <span className="text-xs font-bold text-rose-600">{error}</span>}
              <button disabled={saving} className="rounded-xl bg-gradient-to-l from-gold-500 to-gold-300 px-6 py-3 text-sm font-extrabold text-navy-950 disabled:opacity-60">
                {saving ? "در حال ثبت…" : "ثبت کارشناس"}
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => {
          const conv = a.totalLeads ? Math.round((a.confirmed / a.totalLeads) * 100) : 0;
          const visitConv = a.visits ? Math.min(100, Math.round((a.totalLeads / a.visits) * 100)) : 0;
          return (
            <Card key={a.id} className={`relative overflow-hidden p-6 ${!a.isActive ? "opacity-60" : ""}`}>
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl" style={{ background: a.color ?? "#1b2f57" }} />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-black text-white shadow-lg" style={{ background: a.color ?? "#1b2f57" }}>
                    {a.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-extrabold text-navy-950">{a.name}</div>
                    <div className="text-xs text-navy-400" dir="ltr">{a.phone ? toFa(a.phone) : "—"}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggle(a.id, !a.isActive)}
                  className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${a.isActive ? "bg-emerald-50 text-emerald-700" : "bg-navy-50 text-navy-400"}`}
                >
                  {a.isActive ? "● فعال" : "○ غیرفعال"}
                </button>
              </div>

              {/* Unique link */}
              <div className="relative mt-5 rounded-2xl border border-dashed border-navy-200 bg-navy-50/60 p-3">
                <div className="text-[0.6rem] font-bold text-navy-400">لینک اختصاصی نوبت‌دهی</div>
                <div className="mt-1 flex items-center gap-2">
                  <code className="flex-1 truncate text-xs font-semibold text-navy-800" dir="ltr">{origin}/book/{a.slug}</code>
                  <button
                    onClick={() => copy(a.slug)}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-[0.7rem] font-bold transition ${copied === a.slug ? "bg-emerald-500 text-white" : "bg-navy-900 text-white hover:bg-navy-800"}`}
                  >
                    {copied === a.slug ? "کپی شد ✓" : "کپی"}
                  </button>
                  <a href={`/book/${a.slug}`} target="_blank" className="shrink-0 rounded-lg border border-navy-200 px-2.5 py-1.5 text-[0.7rem] font-bold text-navy-700 hover:bg-white">↗</a>
                </div>
              </div>

              <div className="relative mt-5 grid grid-cols-4 gap-2 text-center">
                <Mini label="لید" value={a.totalLeads} />
                <Mini label="این ماه" value={a.monthLeads} />
                <Mini label="قطعی" value={a.confirmed} />
                <Mini label="بازدید" value={a.visits} />
              </div>

              <div className="relative mt-4 space-y-2.5">
                <Bar label="سهم از کل لیدها" pct={Math.round((a.totalLeads / maxLeads) * 100)} color={a.color ?? "#1b2f57"} display={`${toFa(a.totalLeads)}`} />
                <Bar label="نرخ تبدیل به نوبت قطعی" pct={conv} color="#10b981" display={`${toFa(conv)}٪`} />
                <Bar label="بازدید → ثبت" pct={visitConv} color="#c9a24a" display={`${toFa(visitConv)}٪`} />
              </div>

              <a href={`/dashboard/leads?agent=${a.id}`} className="relative mt-5 block text-center text-xs font-bold text-gold-600 hover:underline">
                مشاهده لیدهای {a.name} ←
              </a>
            </Card>
          );
        })}
      </div>
    </>
  );
}

const inp = "w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-900 focus:ring-4 focus:ring-navy-900/10";

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-navy-700">{label}</span>
      {children}
    </label>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-navy-50/70 py-2.5">
      <div className="text-lg font-black tabular-nums text-navy-950">{toFa(value)}</div>
      <div className="text-[0.6rem] text-navy-400">{label}</div>
    </div>
  );
}

function Bar({ label, pct, color, display }: { label: string; pct: number; color: string; display: string }) {
  return (
    <div>
      <div className="flex justify-between text-[0.65rem]">
        <span className="text-navy-400">{label}</span>
        <span className="font-bold text-navy-800">{display}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-navy-50">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
