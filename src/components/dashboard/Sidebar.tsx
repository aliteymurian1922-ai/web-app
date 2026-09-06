"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard", label: "داشبورد", icon: "▦" },
  { href: "/dashboard/leads", label: "لیدها و نوبت‌ها", icon: "☰" },
  { href: "/dashboard/appointments", label: "تقویم مراجعات", icon: "▤" },
  { href: "/dashboard/agents", label: "کارشناسان و لینک‌ها", icon: "◉" },
];

export function Sidebar({ onLogout }: { onLogout: () => Promise<void> }) {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop */}
      <aside className="mesh-bg sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-white/5 p-5 text-white lg:flex">
        <Link href="/dashboard"><Logo size={40} /></Link>
        <nav className="mt-10 space-y-1">
          {NAV.map((n) => {
            const active = n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                  active ? "bg-white/10 text-gold-300 shadow-inner" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`text-base ${active ? "text-gold-300" : "text-white/40"}`}>{n.icon}</span>
                {n.label}
                {active && <span className="mr-auto h-1.5 w-1.5 rounded-full bg-gold-300" />}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-2">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-white/50 transition hover:text-white">
            ↗ مشاهده سایت
          </Link>
          <form action={onLogout}>
            <button className="w-full rounded-xl border border-white/10 px-3.5 py-2.5 text-right text-xs font-semibold text-white/70 transition hover:bg-white/5">
              خروج از پنل
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-navy-100 bg-white/90 backdrop-blur lg:hidden">
        {NAV.map((n) => {
          const active = n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.6rem] font-bold ${active ? "text-navy-900" : "text-navy-300"}`}>
              <span className="text-lg">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
