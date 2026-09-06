"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES, TIME_SLOTS, CLINIC } from "@/lib/constants";
import { toFa } from "@/lib/jalali";

export type BookableDay = { iso: string; weekday: string; day: string; month: string };

type AgentInfo = { name: string; slug: string; color: string | null } | null;

type Props = {
  agent: AgentInfo;
  days: BookableDay[];
  initialService?: string;
  initialAccommodation?: boolean;
};

const STEPS = ["انتخاب خدمت", "زمان نوبت", "اطلاعات شما", "تأیید نهایی"];

export function BookingWizard({ agent, days, initialService, initialAccommodation }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [service, setService] = useState<string>(initialService ?? "");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [isOutOfTown, setIsOutOfTown] = useState(Boolean(initialAccommodation));
  const [needsAccommodation, setNeedsAccommodation] = useState(Boolean(initialAccommodation));
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedService = useMemo(() => SERVICES.find((s) => s.id === service), [service]);
  const selectedDay = useMemo(() => days.find((d) => d.iso === date), [days, date]);

  const canNext = [
    Boolean(service),
    Boolean(date && time),
    fullName.trim().length >= 3 && /^0?9\d{9}$/.test(phone.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, "")),
    true,
  ][step];

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          service,
          preferredDate: date,
          preferredTime: time,
          city,
          isOutOfTown,
          needsAccommodation,
          notes,
          agentSlug: agent?.slug ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ثبت نوبت");
      router.push(`/book/success/${data.trackingCode}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطای ناشناخته");
      setLoading(false);
    }
  }

  return (
    <div className="card-glow overflow-hidden rounded-[2rem] border border-white bg-white">
      {/* Stepper */}
      <div className="border-b border-navy-50 bg-gradient-to-l from-navy-50/60 to-white px-6 py-5">
        <ol className="flex items-center justify-between gap-2">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-3 last:flex-none">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-all ${
                      done
                        ? "bg-emerald-500 text-white"
                        : active
                          ? "bg-navy-900 text-gold-300 shadow-[0_0_0_5px_rgba(27,47,87,0.12)]"
                          : "bg-navy-50 text-navy-300"
                    }`}
                  >
                    {done ? "✓" : toFa(i + 1)}
                  </div>
                  <span className={`hidden text-xs font-semibold sm:block ${active ? "text-navy-900" : "text-navy-300"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 rounded-full ${done ? "bg-emerald-400" : "bg-navy-100"}`} />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="p-6 sm:p-8">
        {/* STEP 0 — Service */}
        {step === 0 && (
          <div className="animate-fade-up">
            <h2 className="text-xl font-black text-navy-950">چه خدمتی نیاز دارید؟</h2>
            <p className="mt-1 text-sm text-navy-400">یکی از خدمات زیر را انتخاب کنید. در صورت عدم اطمینان «مشاوره و ویزیت» را بزنید.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SERVICES.map((s) => {
                const on = service === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setService(s.id)}
                    className={`group relative rounded-2xl border p-4 text-right transition-all ${
                      on ? "border-navy-900 bg-navy-900 text-white shadow-lg" : "border-navy-100 bg-white hover:border-gold-400 hover:shadow-md"
                    }`}
                  >
                    {"featured" in s && s.featured && (
                      <span className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${on ? "bg-gold-400 text-navy-950" : "bg-gold-100 text-gold-700"}`}>پرطرفدار</span>
                    )}
                    <div className="text-2xl">{s.icon}</div>
                    <div className="mt-2 text-sm font-extrabold">{s.title}</div>
                    <div className={`mt-0.5 text-[0.7rem] leading-5 ${on ? "text-white/60" : "text-navy-400"}`}>{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1 — Date & time */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="text-xl font-black text-navy-950">چه زمانی برایتان مناسب است؟</h2>
            <p className="mt-1 text-sm text-navy-400">روز و ساعت پیشنهادی خود را انتخاب کنید. تیم ما برای هماهنگی نهایی با شما تماس می‌گیرد.</p>

            <div className="scrollbar-thin -mx-2 mt-6 flex gap-2.5 overflow-x-auto px-2 pb-3">
              {days.map((d) => {
                const on = date === d.iso;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => setDate(d.iso)}
                    className={`flex w-[4.6rem] shrink-0 flex-col items-center rounded-2xl border py-3 transition-all ${
                      on ? "border-navy-900 bg-navy-900 text-white shadow-lg" : "border-navy-100 bg-white hover:border-gold-400"
                    }`}
                  >
                    <span className={`text-[0.65rem] ${on ? "text-gold-300" : "text-navy-400"}`}>{d.weekday}</span>
                    <span className="mt-1 text-2xl font-black">{d.day}</span>
                    <span className={`text-[0.65rem] ${on ? "text-white/70" : "text-navy-400"}`}>{d.month}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="mb-3 text-sm font-bold text-navy-800">ساعت نوبت</div>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-7">
                {TIME_SLOTS.map((t) => {
                  const on = time === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={!date}
                      onClick={() => setTime(t)}
                      className={`rounded-xl border py-2.5 text-sm font-bold tabular-nums transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                        on ? "border-gold-500 bg-gold-400 text-navy-950 shadow-md" : "border-navy-100 bg-white hover:border-gold-400"
                      }`}
                    >
                      {toFa(t)}
                    </button>
                  );
                })}
              </div>
              {!date && <p className="mt-2 text-xs text-navy-300">ابتدا روز را انتخاب کنید.</p>}
            </div>
          </div>
        )}

        {/* STEP 2 — Info */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h2 className="text-xl font-black text-navy-950">اطلاعات تماس شما</h2>
            <p className="mt-1 text-sm text-navy-400">برای هماهنگی نوبت به این اطلاعات نیاز داریم. اطلاعات شما نزد ما محفوظ است.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="نام و نام خانوادگی *">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: علی محمدی" className={inputCls} />
              </Field>
              <Field label="شماره موبایل *">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" dir="ltr" placeholder="0912 123 4567" className={`${inputCls} text-left`} />
              </Field>
              <Field label="شهر محل سکونت">
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="تهران" className={inputCls} />
              </Field>
              <Field label="توضیحات (اختیاری)">
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثلاً: دندان جلو، سابقه بیماری…" className={inputCls} />
              </Field>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Toggle
                on={isOutOfTown}
                onChange={(v) => {
                  setIsOutOfTown(v);
                  if (!v) setNeedsAccommodation(false);
                }}
                title="از شهرستان مراجعه می‌کنم"
                desc="مراجعین شهرستانی از خدمات ویژه بهره‌مند می‌شوند"
                icon="🧳"
              />
              <Toggle
                on={needsAccommodation}
                disabled={!isOutOfTown}
                onChange={setNeedsAccommodation}
                title="نیاز به اسکان رایگان دارم"
                desc="اقامت رایگان در نزدیکی کلینیک"
                icon="🏠"
              />
            </div>
          </div>
        )}

        {/* STEP 3 — Review */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 className="text-xl font-black text-navy-950">بررسی و تأیید نهایی</h2>
            <p className="mt-1 text-sm text-navy-400">لطفاً اطلاعات زیر را بررسی کنید و در صورت صحت، ثبت نوبت را بزنید.</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-navy-100">
              <Row k="خدمت" v={`${selectedService?.icon ?? ""} ${selectedService?.title ?? ""}`} />
              <Row k="زمان نوبت" v={selectedDay ? `${selectedDay.weekday} ${selectedDay.day} ${selectedDay.month} — ساعت ${toFa(time)}` : ""} />
              <Row k="نام" v={fullName} />
              <Row k="موبایل" v={toFa(phone)} />
              {city && <Row k="شهر" v={city} />}
              {isOutOfTown && <Row k="شهرستانی" v={needsAccommodation ? "بله — با درخواست اسکان رایگان 🏠" : "بله"} />}
              {notes && <Row k="توضیحات" v={notes} />}
              {agent && <Row k="کارشناس شما" v={agent.name} />}
            </div>
            <div className="mt-5 rounded-2xl bg-navy-50 p-4 text-xs leading-6 text-navy-600">
              📍 {CLINIC.address}
            </div>
            {error && <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-navy-50 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className="rounded-xl px-5 py-3 text-sm font-bold text-navy-500 transition hover:bg-navy-50 disabled:invisible"
          >
            → مرحله قبل
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="rounded-xl bg-navy-900 px-7 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              مرحله بعد ←
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-gold-500 to-gold-300 px-8 py-3 text-sm font-extrabold text-navy-950 shadow-[0_10px_30px_-10px_rgba(201,162,74,0.9)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" />}
              ثبت نهایی نوبت
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-navy-200 focus:border-navy-900 focus:ring-4 focus:ring-navy-900/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-navy-700">{label}</span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-navy-50 px-4 py-3 text-sm last:border-b-0 odd:bg-navy-50/40">
      <span className="text-navy-400">{k}</span>
      <span className="font-bold text-navy-900">{v}</span>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  title,
  desc,
  icon,
  disabled,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  title: string;
  desc: string;
  icon: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-right transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
        on ? "border-gold-500 bg-gold-50" : "border-navy-100 bg-white hover:border-gold-300"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-extrabold text-navy-900">{title}</span>
        <span className="block text-[0.7rem] text-navy-400">{desc}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-gold-500" : "bg-navy-100"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-0.5" : "left-[1.4rem]"}`} />
      </span>
    </button>
  );
}
