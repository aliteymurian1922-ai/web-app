"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadWithAgent } from "@/lib/data";
import { LEAD_STATUSES, SERVICES, type LeadStatus } from "@/lib/constants";
import { formatJalali, relativeTime, toFa } from "@/lib/jalali";
import { AgentChip, EmptyState, StatusBadge } from "@/components/dashboard/ui";

export function LeadsTable({ leads }: { leads: LeadWithAgent[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<LeadWithAgent | null>(null);
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function updateStatus(id: number, status: LeadStatus) {
    setBusyId(id);
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setBusyId(null);
    if (selected?.id === id) setSelected({ ...selected, status });
    startTransition(() => router.refresh());
  }

  async function remove(id: number) {
    if (!confirm("این لید حذف شود؟")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setSelected(null);
    startTransition(() => router.refresh());
  }

  if (leads.length === 0) return <EmptyState title="لیدی پیدا نشد" desc="با تغییر فیلترها یا اشتراک‌گذاری لینک کارشناسان، لیدهای جدید اینجا نمایش داده می‌شوند." />;

  return (
    <>
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[56rem] text-sm">
          <thead>
            <tr className="border-b border-navy-50 text-right text-[0.7rem] text-navy-400">
              <th className="px-5 py-3 font-semibold">بیمار</th>
              <th className="px-3 py-3 font-semibold">خدمت</th>
              <th className="px-3 py-3 font-semibold">زمان نوبت</th>
              <th className="px-3 py-3 font-semibold">منبع / کارشناس</th>
              <th className="px-3 py-3 font-semibold">وضعیت</th>
              <th className="px-3 py-3 font-semibold">ثبت</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className={pending ? "opacity-60" : ""}>
            {leads.map((l) => {
              const svc = SERVICES.find((s) => s.id === l.service);
              return (
                <tr key={l.id} onClick={() => setSelected(l)} className="cursor-pointer border-b border-navy-50/70 transition hover:bg-navy-50/40">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-navy-900">{l.fullName}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[0.7rem] text-navy-400">
                      <span dir="ltr" className="tabular-nums">{toFa(l.phone)}</span>
                      {l.isOutOfTown && <span className="rounded-md bg-gold-100 px-1.5 py-0.5 text-[0.6rem] font-bold text-gold-700">{l.needsAccommodation ? "🏠 اسکان" : "شهرستان"}</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-navy-800">
                    <span className="ml-1">{svc?.icon}</span>
                    {svc?.title ?? l.service}
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="text-navy-800">{formatJalali(l.preferredDate, { year: false })}</div>
                    <div className="text-[0.7rem] text-navy-400">ساعت {toFa(l.preferredTime)}</div>
                  </td>
                  <td className="px-3 py-3.5"><AgentChip name={l.agentName} color={l.agentColor} /></td>
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={l.status}
                      disabled={busyId === l.id}
                      onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                      className={`rounded-lg border-0 px-2.5 py-1.5 text-[0.7rem] font-bold outline-none ring-1 ${LEAD_STATUSES[l.status as LeadStatus]?.color ?? ""}`}
                    >
                      {(Object.keys(LEAD_STATUSES) as LeadStatus[]).map((k) => (
                        <option key={k} value={k}>{LEAD_STATUSES[k].label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3.5 text-[0.7rem] text-navy-400">{relativeTime(l.createdAt)}</td>
                  <td className="px-5 py-3.5 text-left">
                    <span className="font-mono text-[0.65rem] text-navy-300" dir="ltr">{l.trackingCode}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-start bg-navy-950/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="animate-fade-up h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[0.65rem] font-bold text-gold-600">جزئیات لید</div>
                <h3 className="mt-1 text-xl font-black text-navy-950">{selected.fullName}</h3>
                <div className="mt-1 font-mono text-xs text-navy-300" dir="ltr">{selected.trackingCode}</div>
              </div>
              <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-xl bg-navy-50 text-navy-500 hover:bg-navy-100">✕</button>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <StatusBadge status={selected.status} />
              {selected.isOutOfTown && <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[0.7rem] font-bold text-gold-700">{selected.needsAccommodation ? "🏠 نیاز به اسکان" : "🧳 شهرستانی"}</span>}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <a href={`tel:${selected.phone}`} className="rounded-xl bg-navy-900 py-3 text-center text-sm font-bold text-white transition hover:bg-navy-800">📞 تماس</a>
              <a href={`sms:${selected.phone}`} className="rounded-xl border border-navy-100 py-3 text-center text-sm font-bold text-navy-800 transition hover:bg-navy-50">💬 پیامک</a>
            </div>

            <dl className="mt-6 divide-y divide-navy-50 text-sm">
              <D k="موبایل" v={toFa(selected.phone)} />
              <D k="خدمت" v={SERVICES.find((s) => s.id === selected.service)?.title ?? selected.service} />
              <D k="تاریخ نوبت" v={formatJalali(selected.preferredDate)} />
              <D k="ساعت" v={toFa(selected.preferredTime)} />
              {selected.city && <D k="شهر" v={selected.city} />}
              <D k="منبع" v={selected.agentName ? `کارشناس ${selected.agentName}` : "وب‌سایت (مستقیم)"} />
              <D k="زمان ثبت" v={formatJalali(selected.createdAt)} />
              {selected.notes && <D k="توضیحات" v={selected.notes} />}
            </dl>

            <div className="mt-6">
              <div className="mb-2 text-xs font-bold text-navy-700">تغییر وضعیت</div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(LEAD_STATUSES) as LeadStatus[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => updateStatus(selected.id, k)}
                    disabled={busyId === selected.id}
                    className={`rounded-xl px-3 py-2.5 text-xs font-bold ring-1 transition ${selected.status === k ? LEAD_STATUSES[k].color + " ring-2" : "bg-white text-navy-500 ring-navy-100 hover:bg-navy-50"}`}
                  >
                    {LEAD_STATUSES[k].label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => remove(selected.id)} className="mt-8 w-full rounded-xl py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50">
              حذف این لید
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function D({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-navy-400">{k}</dt>
      <dd className="text-left font-bold text-navy-900">{v}</dd>
    </div>
  );
}
