import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { agents, leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Logo } from "@/components/Logo";
import { CLINIC, SERVICES } from "@/lib/constants";
import { formatJalali, toFa } from "@/lib/jalali";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [row] = await db
    .select({ lead: leads, agentName: agents.name })
    .from(leads)
    .leftJoin(agents, eq(leads.agentId, agents.id))
    .where(eq(leads.trackingCode, code.toUpperCase()))
    .limit(1);
  if (!row) notFound();
  const { lead, agentName } = row;
  const service = SERVICES.find((s) => s.id === lead.service);

  return (
    <main className="mesh-bg grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12 text-white">
      <div className="grid-pattern absolute inset-0 opacity-50" />
      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex justify-center"><Logo size={52} /></div>

        <div className="animate-fade-up overflow-hidden rounded-[2rem] bg-white text-navy-900 shadow-2xl">
          <div className="relative flex flex-col items-center bg-gradient-to-b from-emerald-50 to-white px-6 pt-10 pb-6 text-center">
            <div className="relative">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-emerald-400/40" />
              <div className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-4xl text-white shadow-xl shadow-emerald-500/40">✓</div>
            </div>
            <h1 className="mt-6 text-2xl font-black">نوبت شما با موفقیت ثبت شد</h1>
            <p className="mt-2 text-sm text-navy-400">{lead.fullName} عزیز، همکاران ما به‌زودی برای تأیید نهایی با شما تماس می‌گیرند.</p>
          </div>

          <div className="px-6 pb-8">
            <div className="rounded-2xl border-2 border-dashed border-gold-300 bg-gold-50 p-4 text-center">
              <div className="text-[0.65rem] font-bold text-gold-700">کد رهگیری</div>
              <div className="mt-1 font-mono text-2xl font-black tracking-[0.25em] text-navy-900" dir="ltr">{lead.trackingCode}</div>
            </div>

            <dl className="mt-6 divide-y divide-navy-50 text-sm">
              <Item k="خدمت" v={`${service?.icon ?? ""} ${service?.title ?? lead.service}`} />
              <Item k="تاریخ نوبت" v={formatJalali(lead.preferredDate)} />
              <Item k="ساعت" v={toFa(lead.preferredTime)} />
              <Item k="موبایل" v={toFa(lead.phone)} />
              {lead.needsAccommodation && <Item k="اسکان رایگان" v="درخواست شد 🏠 — هماهنگی توسط تیم ما" />}
              {agentName && <Item k="کارشناس پیگیری" v={agentName} />}
            </dl>

            <div className="mt-6 rounded-2xl bg-navy-50 p-4 text-xs leading-6 text-navy-600">
              <div className="font-bold text-navy-900">📍 آدرس کلینیک</div>
              {CLINIC.address}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/" className="flex-1 rounded-xl bg-navy-900 px-5 py-3 text-center text-sm font-extrabold text-white transition hover:bg-navy-800">
                بازگشت به صفحه اصلی
              </Link>
              <Link href="/book" className="flex-1 rounded-xl border border-navy-100 px-5 py-3 text-center text-sm font-bold text-navy-700 transition hover:bg-navy-50">
                ثبت نوبت دیگر
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-navy-400">{k}</dt>
      <dd className="font-bold text-navy-900">{v}</dd>
    </div>
  );
}
