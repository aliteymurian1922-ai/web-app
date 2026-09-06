import Link from "next/link";
import { getAgentStats, getDashboardStats, getLeads } from "@/lib/data";
import { AgentChip, BarChart, Card, DonutChart, PageHeader, StatCard, StatusBadge } from "@/components/dashboard/ui";
import { LEAD_STATUSES, SERVICES, type LeadStatus } from "@/lib/constants";
import { formatJalali, jalaliParts, parseISODate, relativeTime, toFa } from "@/lib/jalali";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  new: "#0ea5e9",
  contacted: "#f59e0b",
  confirmed: "#10b981",
  attended: "#8b5cf6",
  cancelled: "#f43f5e",
};

export default async function DashboardPage() {
  const [stats, agentStats, recent] = await Promise.all([getDashboardStats(), getAgentStats(), getLeads({ limit: 8 })]);

  const trend = stats.prevWeek === 0 ? (stats.week > 0 ? 100 : 0) : Math.round(((stats.week - stats.prevWeek) / stats.prevWeek) * 100);
  const conversion = stats.total === 0 ? 0 : Math.round((stats.confirmed / stats.total) * 100);
  const visitConv = stats.visits === 0 ? 0 : Math.min(100, Math.round((stats.total / stats.visits) * 100));

  const topAgents = agentStats.slice(0, 5);
  const maxAgent = Math.max(1, ...topAgents.map((a) => a.totalLeads));

  return (
    <>
      <PageHeader
        title="داشبورد مدیریت"
        desc={`نمای کلی عملکرد نوبت‌دهی — ${formatJalali(new Date())}`}
        action={
          <Link href="/dashboard/agents" className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-navy-800">
            + کارشناس جدید
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="کل لیدها" value={stats.total} icon="👥" trend={trend} hint={`${toFa(stats.week)} لید در ۷ روز اخیر`} accent="navy" />
        <StatCard label="لیدهای امروز" value={stats.today} icon="⚡" hint={`${toFa(stats.newLeads)} لید در انتظار تماس`} accent="gold" />
        <StatCard label="نرخ تبدیل به نوبت قطعی" value={`${toFa(conversion)}٪`} icon="🎯" hint={`${toFa(stats.confirmed)} نوبت تأیید شده`} accent="emerald" />
        <StatCard label="مراجعات امروز" value={stats.todayAppointments} icon="🗓️" hint={`${toFa(stats.attended)} مراجعه انجام‌شده در کل`} accent="violet" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-navy-950">روند لیدهای ۱۴ روز اخیر</h3>
              <p className="text-xs text-navy-400">تعداد نوبت‌های ثبت‌شده در هر روز</p>
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-navy-950">{toFa(stats.daily.reduce((a, d) => a + d.n, 0))}</div>
              <div className="text-[0.65rem] text-navy-300">لید در این بازه</div>
            </div>
          </div>
          <div className="mt-6">
            <BarChart data={stats.daily.map((d) => d.n)} labels={stats.daily.map((d) => toFa(jalaliParts(parseISODate(d.iso)).day))} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-extrabold text-navy-950">وضعیت لیدها</h3>
          <p className="text-xs text-navy-400">توزیع بر اساس مرحله پیگیری</p>
          <div className="mt-6">
            <DonutChart
              segments={(Object.keys(LEAD_STATUSES) as LeadStatus[]).map((k) => ({
                label: LEAD_STATUSES[k].label,
                value: stats.byStatus.find((s) => s.status === k)?.n ?? 0,
                color: STATUS_COLORS[k],
              }))}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-navy-50 pt-5 text-center">
            <div>
              <div className="text-xl font-black text-navy-950">{toFa(stats.visits)}</div>
              <div className="text-[0.65rem] text-navy-400">بازدید لینک‌ها</div>
            </div>
            <div>
              <div className="text-xl font-black text-navy-950">{toFa(visitConv)}٪</div>
              <div className="text-[0.65rem] text-navy-400">بازدید → ثبت نوبت</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-navy-950">برترین کارشناسان</h3>
            <Link href="/dashboard/agents" className="text-xs font-bold text-gold-600 hover:underline">همه ←</Link>
          </div>
          <ul className="mt-5 space-y-4">
            {topAgents.map((a, i) => (
              <li key={a.id}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[0.65rem] font-black ${i === 0 ? "bg-gold-400 text-navy-950" : "bg-navy-50 text-navy-500"}`}>{toFa(i + 1)}</span>
                    <AgentChip name={a.name} color={a.color} />
                  </div>
                  <span className="font-black tabular-nums text-navy-950">{toFa(a.totalLeads)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-50">
                  <div className="h-full rounded-full" style={{ width: `${(a.totalLeads / maxAgent) * 100}%`, background: a.color ?? "#1b2f57" }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="font-extrabold text-navy-950">پرتقاضاترین خدمات</h3>
          <ul className="mt-5 space-y-3">
            {stats.byService.length === 0 && <li className="text-xs text-navy-300">هنوز داده‌ای ثبت نشده است.</li>}
            {stats.byService.map((s) => {
              const svc = SERVICES.find((x) => x.id === s.service);
              const pct = stats.total ? Math.round((s.n / stats.total) * 100) : 0;
              return (
                <li key={s.service} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-50 text-lg">{svc?.icon ?? "🦷"}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-navy-800">{svc?.title ?? s.service}</span>
                      <span className="text-navy-400">{toFa(s.n)} ({toFa(pct)}٪)</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-50">
                      <div className="h-full rounded-full bg-gradient-to-l from-gold-500 to-gold-300" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 rounded-2xl bg-navy-900 p-4 text-white">
            <div className="text-[0.65rem] text-white/60">مراجعین شهرستانی</div>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-2xl font-black">{toFa(stats.outOfTown)}</span>
              <span className="text-xs text-gold-300">🏠 اسکان رایگان</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-navy-950">آخرین لیدها</h3>
            <Link href="/dashboard/leads" className="text-xs font-bold text-gold-600 hover:underline">همه ←</Link>
          </div>
          <ul className="mt-4 divide-y divide-navy-50">
            {recent.length === 0 && <li className="py-6 text-center text-xs text-navy-300">هنوز لیدی ثبت نشده است.</li>}
            {recent.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-navy-900">{l.fullName}</div>
                  <div className="mt-0.5 text-[0.65rem] text-navy-400">
                    {SERVICES.find((s) => s.id === l.service)?.title} · {l.agentName ?? "وب‌سایت"} · {relativeTime(l.createdAt)}
                  </div>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
