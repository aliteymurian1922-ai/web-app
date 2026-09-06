import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Logo, LogoMark } from "@/components/Logo";
import { CLINIC, PACKAGE_ITEMS, PROCESS_STEPS, SERVICES } from "@/lib/constants";
import { toFa } from "@/lib/jalali";

export const dynamic = "force-static";

const STATS = [
  { value: "۹۸٪+", label: "موفقیت درمان ایمپلنت" },
  { value: "۲۲", label: "مرحله در پکیج اختصاصی" },
  { value: "۱۰۰٪", label: "نظارت مستقیم پزشک" },
  { value: "رایگان", label: "اسکان مراجعین شهرستانی" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <SiteHeader />

      {/* ───── HERO ───── */}
      <section className="mesh-bg grain relative overflow-hidden pb-24 pt-32 text-white lg:pb-32 lg:pt-40">
        <div className="grid-pattern absolute inset-0 opacity-60" />
        <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-navy-400/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-medium text-gold-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-gold-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-300" />
              </span>
              نوبت‌دهی آنلاین ۲۴ ساعته فعال است
            </div>

            <h1 className="animate-fade-up delay-1 mt-6 text-[clamp(2.2rem,5.5vw,4rem)] font-black leading-[1.2]">
              شما فقط یک ایمپلنت
              <br />
              <span className="gold-text">دریافت نمی‌کنید…</span>
            </h1>
            <p className="animate-fade-up delay-2 mt-6 max-w-xl text-base leading-8 text-white/70 lg:text-lg">
              شما یک مسیر درمان کامل، از اولین ویزیت تا پایان درمان دریافت می‌کنید. با
              پکیج اختصاصی ۲۲ مرحله‌ای، بی‌حسی دیجیتال، گاید جراحی سه‌بعدی و نظارت
              مستقیم {CLINIC.doctor} در تمام مراحل.
            </p>

            <div className="animate-fade-up delay-3 mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-l from-gold-500 via-gold-400 to-gold-300 px-7 py-4 text-base font-extrabold text-navy-950 shadow-[0_16px_50px_-12px_rgba(201,162,74,0.9)] transition hover:-translate-y-0.5"
              >
                <span>رزرو نوبت مشاوره رایگان</span>
                <svg className="h-5 w-5 transition group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <a
                href="#package"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                مشاهده پکیج ایمپلنت
              </a>
            </div>

            <div className="animate-fade-up delay-4 mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="gold-text text-2xl font-black lg:text-3xl">{s.value}</div>
                  <div className="mt-1 text-xs text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up delay-2 relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-gold-500/30 via-transparent to-navy-300/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <Image
                src="/images/hero-clinic.jpg"
                alt="کلینیک ایمپلنت دکتر حسینی"
                width={1024}
                height={768}
                priority
                className="h-[26rem] w-full object-cover lg:h-[34rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 right-5 left-5">
                <div className="glass flex items-center gap-4 rounded-2xl p-4">
                  <LogoMark size={44} />
                  <div>
                    <div className="text-sm font-bold">{CLINIC.doctor}</div>
                    <div className="text-xs text-white/60">{CLINIC.tagline}</div>
                  </div>
                  <div className="mr-auto flex items-center gap-1 text-gold-300">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-float absolute -right-6 top-10 hidden rounded-2xl bg-white p-4 text-navy-900 shadow-2xl lg:block">
              <div className="text-[0.65rem] text-navy-400">بی‌حسی دیجیتال</div>
              <div className="text-sm font-extrabold">Quick Sleeper</div>
              <div className="mt-1 text-[0.65rem] text-emerald-600">✓ بدون درد</div>
            </div>
            <div className="animate-float absolute -left-6 bottom-28 hidden rounded-2xl bg-white p-4 text-navy-900 shadow-2xl lg:block [animation-delay:1.5s]">
              <div className="text-[0.65rem] text-navy-400">گارانتی</div>
              <div className="text-sm font-extrabold">کارت گارانتی رسمی</div>
            </div>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 right-0 w-full text-[#f6f7fb]" viewBox="0 0 1440 80" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 80V40c240-40 480-40 720 0s480 40 720 0v40z" />
        </svg>
      </section>

      {/* ───── SERVICES ───── */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHeading eyebrow="خدمات ما" title="طیف کامل خدمات دندانپزشکی" desc="از ایمپلنت تخصصی تا زیبایی لبخند — همه زیر یک سقف و با بالاترین استانداردها" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.filter((s) => s.id !== "consult").map((s, i) => (
            <Link
              key={s.id}
              href={`/book?service=${s.id}`}
              className={`group relative overflow-hidden rounded-3xl border p-6 transition hover:-translate-y-1 ${
                "featured" in s && s.featured
                  ? "mesh-bg border-navy-800 text-white shadow-xl sm:col-span-2 lg:row-span-2"
                  : "card-glow border-white bg-white text-navy-900 hover:shadow-xl"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {"featured" in s && s.featured ? (
                <div className="flex h-full flex-col">
                  <div className="text-4xl">{s.icon}</div>
                  <h3 className="mt-5 text-2xl font-black">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{s.desc}</p>
                  <ul className="mt-6 space-y-2 text-sm text-white/80">
                    {["اسکن سه‌بعدی و Surgical Guide", "بی‌حسی دیجیتال Quick Sleeper", "کارت گارانتی و Follow Up", "موفقیت درمان بالای ۹۸٪"].map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-400/20 text-gold-300">✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-gold-400 px-4 py-2.5 text-sm font-bold text-navy-950 transition group-hover:gap-3">
                      رزرو مشاوره ایمپلنت ←
                    </span>
                  </div>
                  <Image src="/images/implant-tech.jpg" alt="" width={400} height={300} className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full object-cover opacity-30 blur-[1px] transition group-hover:opacity-50" />
                </div>
              ) : (
                <>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-50 text-2xl transition group-hover:bg-gold-100">{s.icon}</div>
                  <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
                  <p className="mt-1 text-sm text-navy-400">{s.desc}</p>
                  <div className="mt-4 text-xs font-bold text-gold-600 opacity-0 transition group-hover:opacity-100">رزرو نوبت ←</div>
                </>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ───── PACKAGE ───── */}
      <section id="package" className="relative overflow-hidden bg-white py-24">
        <div className="dot-pattern absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="پکیج اختصاصی ایمپلنت" title="۲۲ مرحله؛ یک مسیر درمان کامل" desc="همه خدماتی که برای یک درمان دقیق، مطمئن و حرفه‌ای دریافت می‌کنید." />
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGE_ITEMS.map((item, i) => (
              <div key={item} className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white/80 p-4 backdrop-blur transition hover:border-gold-300 hover:shadow-lg">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 font-black text-gold-300 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                  {toFa(String(i + 1).padStart(2, "0"))}
                </div>
                <div className="text-sm font-semibold leading-6 text-navy-800">{item}</div>
              </div>
            ))}
          </div>
          <div className="mesh-bg mt-10 flex flex-col items-center justify-between gap-6 rounded-3xl border border-gold-500/30 p-8 text-white md:flex-row">
            <div className="flex items-center gap-5">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-400/15 text-3xl">👑</div>
              <div>
                <div className="text-xl font-black lg:text-2xl">شما فقط یک ایمپلنت دریافت نمی‌کنید…</div>
                <div className="mt-1 text-sm text-white/70">شما یک مسیر درمان کامل، از اولین ویزیت تا پایان درمان دریافت می‌کنید.</div>
              </div>
            </div>
            <Link href="/book?service=implant" className="shrink-0 rounded-2xl bg-gold-400 px-6 py-3.5 text-sm font-extrabold text-navy-950 transition hover:bg-gold-300">
              شروع مسیر درمان
            </Link>
          </div>
        </div>
      </section>

      {/* ───── PROCESS ───── */}
      <section id="process" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHeading eyebrow="فرآیند نوبت‌دهی و درمان" title="مسیر شفاف شما از پذیرش تا درمان" />
        <div className="relative mt-16">
          <div className="absolute right-0 left-0 top-7 hidden h-px bg-gradient-to-l from-transparent via-navy-200 to-transparent lg:block" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="relative grid h-14 w-14 place-items-center rounded-full border-2 border-navy-100 bg-white font-black text-navy-900 shadow-lg">
                  <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-navy-900 text-[0.65rem] text-white">{toFa(i + 1)}</span>
                  <span className="text-gold-500">●</span>
                </div>
                <div className="mt-5 text-sm font-extrabold text-navy-900">{step.title}</div>
                <ul className="mt-2 space-y-1 text-[0.72rem] text-navy-400">
                  {step.items.map((it) => (
                    <li key={it}>✓ {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── ACCOMMODATION ───── */}
      <section id="accommodation" className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="mesh-bg grain relative grid overflow-hidden rounded-[2.5rem] text-white lg:grid-cols-2">
          <div className="relative p-10 lg:p-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-xs font-bold text-gold-200">🏠 خبر خوب برای مراجعین شهرستانی</div>
            <h2 className="mt-6 text-3xl font-black leading-snug lg:text-4xl">اسکان رایگان در نزدیکی کلینیک</h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/70">
              اگر از شهرهای مختلف برای درمان به کلینیک دکتر حسینی مراجعه می‌کنید، برای رفاه و آسایش شما امکان اسکان رایگان
              در نزدیکی کلینیک فراهم شده است. کافیست هنگام ثبت نوبت گزینه «نیاز به اسکان» را انتخاب کنید.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              {["📍 فاصله کوتاه تا کلینیک", "🛏️ اقامت راحت و تمیز", "🧳 هماهنگی کامل توسط تیم ما", "📞 پشتیبانی اختصاصی"].map((t) => (
                <div key={t} className="glass rounded-xl px-4 py-3">{t}</div>
              ))}
            </div>
            <Link href="/book?accommodation=1" className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-navy-950 transition hover:bg-gold-100">
              رزرو نوبت با اسکان
            </Link>
          </div>
          <div className="relative min-h-[18rem]">
            <Image src="/images/accommodation.jpg" alt="اسکان رایگان" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-navy-950/60 lg:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      {/* ───── CONTACT / FOOTER ───── */}
      <footer id="contact" className="bg-navy-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-3 lg:px-8">
          <div>
            <Logo size={52} />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">{CLINIC.tagline}. مرکز تخصصی ایمپلنت و زیبایی با جدیدترین تکنولوژی‌های روز دنیا.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gold-300">آدرس کلینیک</h4>
            <p className="mt-3 text-sm leading-7 text-white/70">{CLINIC.address}</p>
            <p className="mt-3 text-sm text-white/70">ساعت کاری: {CLINIC.hours}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gold-300">رزرو سریع</h4>
            <p className="mt-3 text-sm leading-7 text-white/70">همین حالا نوبت مشاوره رایگان خود را رزرو کنید. تیم ما در کمتر از ۲۴ ساعت با شما تماس می‌گیرد.</p>
            <Link href="/book" className="mt-5 inline-flex rounded-xl bg-gold-400 px-5 py-3 text-sm font-extrabold text-navy-950 transition hover:bg-gold-300">
              رزرو نوبت آنلاین
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
          © {toFa(new Date().getFullYear())} {CLINIC.name} — تمامی حقوق محفوظ است.
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-3 text-xs font-bold tracking-wide text-gold-600">
        <span className="h-px w-8 bg-gold-400" />
        {eyebrow}
        <span className="h-px w-8 bg-gold-400" />
      </div>
      <h2 className="mt-4 text-3xl font-black text-navy-950 lg:text-4xl">{title}</h2>
      {desc && <p className="mt-4 text-base leading-7 text-navy-400">{desc}</p>}
    </div>
  );
}
