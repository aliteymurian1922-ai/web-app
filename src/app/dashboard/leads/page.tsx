import Link from "next/link";
import { getAllAgents, getLeads } from "@/lib/data";
import { Card, PageHeader } from "@/components/dashboard/ui";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/constants";
import { toFa } from "@/lib/jalali";

export const dynamic = "force-dynamic";

type SP = Promise<{ status?: string; agent?: string; q?: string }>;

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const agentId = sp.agent ? Number(sp.agent) : undefined;
  const [leads, agents, all] = await Promise.all([
    getLeads({ status: sp.status, agentId, q: sp.q }),
    getAllAgents(),
    getLeads({ agentId, q: sp.q }),
  ]);

  const counts: Record<string, number> = { all: all.length };
  for (const l of all) counts[l.status] = (counts[l.status] ?? 0) + 1;

  const buildHref = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status: sp.status, agent: sp.agent, q: sp.q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return `/dashboard/leads${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader title="لیدها و نوبت‌ها" desc="مدیریت و پیگیری تمام نوبت‌های ثبت‌شده از لینک کارشناسان و وب‌سایت" />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-navy-50 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-thin flex gap-1.5 overflow-x-auto">
            {(["all", ...Object.keys(LEAD_STATUSES)] as ("all" | LeadStatus)[]).map((k) => {
              const active = (sp.status ?? "all") === k;
              return (
                <Link
                  key={k}
                  href={buildHref({ status: k === "all" ? undefined : k })}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${active ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-500 hover:bg-navy-100"}`}
                >
                  {k === "all" ? "همه" : LEAD_STATUSES[k].label}
                  <span className={`mr-1.5 tabular-nums ${active ? "text-gold-300" : "text-navy-300"}`}>{toFa(counts[k] ?? 0)}</span>
                </Link>
              );
            })}
          </div>

          <form className="flex gap-2" action="/dashboard/leads">
            {sp.status && <input type="hidden" name="status" value={sp.status} />}
            <select name="agent" defaultValue={sp.agent ?? ""} className="rounded-xl border border-navy-100 bg-white px-3 py-2 text-xs font-semibold text-navy-700 outline-none">
              <option value="">همه منابع</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <input name="q" defaultValue={sp.q ?? ""} placeholder="جستجو نام / موبایل / کد" className="w-48 rounded-xl border border-navy-100 px-3 py-2 text-xs outline-none focus:border-navy-900" />
            <button className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white">اعمال</button>
          </form>
        </div>

        <LeadsTable leads={leads} />
      </Card>
    </>
  );
}
