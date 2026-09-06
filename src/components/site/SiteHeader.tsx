import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteHeader({ bookHref = "/book" }: { bookHref?: string }) {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" aria-label="صفحه اصلی">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          <a href="#services" className="transition hover:text-gold-300">خدمات</a>
          <a href="#package" className="transition hover:text-gold-300">پکیج ایمپلنت</a>
          <a href="#process" className="transition hover:text-gold-300">فرآیند درمان</a>
          <a href="#accommodation" className="transition hover:text-gold-300">اسکان رایگان</a>
          <a href="#contact" className="transition hover:text-gold-300">تماس</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden rounded-full px-4 py-2 text-xs font-medium text-white/70 transition hover:text-white sm:block"
          >
            ورود پرسنل
          </Link>
          <Link
            href={bookHref}
            className="rounded-full bg-gradient-to-l from-gold-500 to-gold-300 px-5 py-2.5 text-sm font-bold text-navy-950 shadow-[0_8px_30px_-8px_rgba(201,162,74,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(201,162,74,0.9)]"
          >
            رزرو نوبت
          </Link>
        </div>
      </div>
    </header>
  );
}
