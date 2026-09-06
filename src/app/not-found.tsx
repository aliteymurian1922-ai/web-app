import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="mesh-bg grain relative flex min-h-screen flex-col items-center justify-center px-5 text-center text-white">
      <Logo size={56} />
      <div className="gold-text mt-10 text-7xl font-black">۴۰۴</div>
      <h1 className="mt-4 text-xl font-extrabold">صفحه یا لینک مورد نظر پیدا نشد</h1>
      <p className="mt-2 max-w-sm text-sm text-white/60">ممکن است لینک کارشناس غیرفعال شده باشد. می‌توانید از طریق فرم عمومی نوبت خود را ثبت کنید.</p>
      <Link href="/book" className="mt-8 rounded-2xl bg-gold-400 px-6 py-3 text-sm font-extrabold text-navy-950 transition hover:bg-gold-300">
        رزرو نوبت آنلاین
      </Link>
    </main>
  );
}
