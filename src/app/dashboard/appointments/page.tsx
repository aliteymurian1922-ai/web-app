import { getUpcomingAppointments } from "@/lib/data";
import { AgentChip, Card, EmptyState, PageHeader, StatusBadge } from "@/components/dashboard/ui";
import { SERVICES } from "@/lib/constants";
import { formatJalali, jalaliParts, parseISODate, toFa, toISODate } from "@/lib/jalali";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const appts = await getUpcomingAppointments();
  const today = toISODate(new Date());

  const groups = new Map<string, typeof appts>();
  for (const a of appts) {
    const k = String(a.preferredDate);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(a);
  }

  return (
    <>
      <PageHeader title="تقویم مراجعات" desc="نوبت‌های پیش‌رو بر اساس تاریخ — نوبت‌های لغوشده نمایش داده نمی‌شوند" />

      {groups.size === 0 ? (
        <Card><EmptyState title="نوبت پیش‌رویی وجود ندارد" desc="نوبت‌های جدید پس از ثبت توسط بیماران در اینجا نمایش داده می‌شوند." /></Card>
      ) : (
        <div className="space-y-6">
          {[...groups.entries()].map(([iso, items]) => {
            const p = jalaliParts(parseISODate(iso));
            const isToday = iso === today;
            return (
              <div key={iso} className="grid gap-4 lg:grid-cols-[11rem_1fr]">
                <div className={`flex flex-row items-center gap-4 rounded-3xl p-5 lg:flex-col lg:items-start lg:justify-between ${isToday ? "mesh-bg text-white" : "bg-white card-glow border border-white"}`}>
                  <div>
                    <div className={`text-xs font-bold ${isToday ? "text-gold-300" : "text-navy-400"}`}>{p.weekday}</div>
                    <div className="text-4xl font-black tabular-nums">{toFa(p.day)}</div>
                    <div className={`text-xs ${isToday ? "text-white/70" : "text-navy-400"}`}>{p.month} {toFa(p.year)}</div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-[0.65rem] font-bold ${isToday ? "bg-gold-400 text-navy-950" : "bg-navy-50 text-navy-600"}`}>
                    {isToday ? "امروز" : `${toFa(items.length)} نوبت`}
                  </div>
                </div>

                <Card className="divide-y divide-navy-50 overflow-hidden">
                  {items.map((a) => {
                    const svc = SERVICES.find((s) => s.id === a.service);
                    return (
                      <div key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                        <div className="flex w-20 shrink-0 items-center gap-2">
                          <span className="h-10 w-1 rounded-full" style={{ background: a.agentColor ?? "#b3c2df" }} />
                          <span className="text-lg font-black tabular-nums text-navy-950">{toFa(a.preferredTime)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-navy-900">{a.fullName}</span>
                            <span className="text-xs text-navy-400">{svc?.icon} {svc?.title}</span>
                            {a.needsAccommodation && <span className="rounded-md bg-gold-100 px-1.5 py-0.5 text-[0.6rem] font-bold text-gold-700">🏠 اسکان</span>}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-[0.7rem] text-navy-400">
                            <span dir="ltr">{toFa(a.phone)}</span>
                            {a.city && <span>📍 {a.city}</span>}
                            <AgentChip name={a.agentName} color={a.agentColor} />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={a.status} />
                          <a href={`tel:${a.phone}`} className="grid h-9 w-9 place-items-center rounded-xl bg-navy-50 text-navy-700 transition hover:bg-navy-900 hover:text-white">📞</a>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-center text-[0.65rem] text-navy-300">نمایش نوبت‌ها از {formatJalali(new Date(), { weekday: false })} به بعد</p>
    </>
  );
}
