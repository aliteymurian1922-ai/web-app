import Link from "next/link";
import { Logo, LogoMark } from "@/components/Logo";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { CLINIC } from "@/lib/constants";
import { getBookableDays } from "@/lib/jalali";
import type { Agent } from "@/db/schema";

type Props = {
  agent: Agent | null;
  initialService?: string;
  initialAccommodation?: boolean;
};

export function BookingShell({ agent, initialService, initialAccommodation }: Props) {
  const days = getBookableDays(14);
  const initials = agent ? agent.name.trim().slice(0, 1) : "";

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      {/* Top band */}
      <div className="mesh-bg grain relative overflow-hidden pb-36 pt-6 text-white">
        <div className="grid-pattern absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link href="/"><Logo /></Link>
          <Link href="/" className="text-xs text-white/60 transition hover:text-white">بازگشت به سایت ←</Link>
        </div>
        <div className="relative mx-auto mt-12 max-w-6xl px-5 text-center lg:px-8">
          <h1 className="text-3xl font-black lg:text-4xl">رزرو نوبت آنلاین</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/65">
            در کمتر از یک دقیقه نوبت مشاوره خود را با {CLINIC.doctor} ثبت کنید. تیم ما برای هماهنگی نهایی با شما تماس خواهد گرفت.
          </p>
        </div>
      </div>

      <div className="relative mx-auto -mt-28 grid max-w-6xl gap-6 px-5 pb-20 lg:grid-cols-[1fr_20rem] lg:px-8">
        <BookingWizard
          agent={agent ? { name: agent.name, slug: agent.slug, color: agent.color } : null}
          days={days}
          initialService={initialService}
          initialAccommodation={initialAccommodation}
        />

        <aside className="space-y-4">
          {agent && (
            <div className="card-glow rounded-3xl border border-white bg-white p-5">
              <div className="text-[0.65rem] font-bold text-gold-600">کارشناس اختصاصی شما</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-black text-white shadow-lg" style={{ background: agent.color ?? "#1b2f57" }}>
                  {initials}
                </div>
                <div>
                  <div className="font-extrabold text-navy-900">{agent.name}</div>
                  <div className="text-xs text-navy-400">{agent.role ?? "کارشناس فروش"}</div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-6 text-navy-400">
                این لینک اختصاصی توسط {agent.name} برای شما ارسال شده است. پس از ثبت نوبت، ایشان پیگیری هماهنگی را انجام می‌دهند.
              </p>
            </div>
          )}

          <div className="card-glow rounded-3xl border border-white bg-white p-5">
            <div className="flex items-center gap-3">
              <LogoMark size={40} variant="dark" />
              <div>
                <div className="text-sm font-extrabold text-navy-900">{CLINIC.doctor}</div>
                <div className="text-[0.65rem] text-navy-400">{CLINIC.tagline}</div>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-xs text-navy-600">
              <li className="flex gap-2"><span>📍</span><span className="leading-6">{CLINIC.address}</span></li>
              <li className="flex gap-2"><span>🕘</span><span>{CLINIC.hours}</span></li>
            </ul>
          </div>

          <div className="rounded-3xl bg-navy-900 p-5 text-white">
            <div className="text-sm font-extrabold">چرا کلینیک دکتر حسینی؟</div>
            <ul className="mt-4 space-y-2.5 text-xs text-white/75">
              {["پکیج اختصاصی ۲۲ مرحله‌ای ایمپلنت", "بی‌حسی دیجیتال Quick Sleeper", "اسکن سه‌بعدی و گاید جراحی", "کارت گارانتی و پشتیبانی Follow Up", "اسکان رایگان مراجعین شهرستانی"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="text-gold-300">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
