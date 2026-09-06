import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createSession, isAuthenticated, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) redirect("/login?error=1");
  await createSession();
  redirect("/dashboard");
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAuthenticated()) redirect("/dashboard");
  const { error } = await searchParams;

  return (
    <main className="mesh-bg grain relative flex min-h-screen items-center justify-center overflow-hidden px-5 text-white">
      <div className="grid-pattern absolute inset-0 opacity-50" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo size={56} /></div>
        <form action={login} className="glass animate-fade-up rounded-[2rem] p-8">
          <h1 className="text-xl font-black">ورود به پنل مدیریت</h1>
          <p className="mt-1 text-xs text-white/60">دسترسی ویژه پرسنل کلینیک</p>
          <label className="mt-6 block">
            <span className="mb-1.5 block text-xs font-bold text-white/80">رمز عبور</span>
            <input
              name="password"
              type="password"
              required
              autoFocus
              dir="ltr"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-gold-400 focus:ring-4 focus:ring-gold-400/20"
              placeholder="••••••••"
            />
          </label>
          {error && <div className="mt-3 rounded-xl bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-200">رمز عبور اشتباه است.</div>}
          <button className="mt-6 w-full rounded-xl bg-gradient-to-l from-gold-500 to-gold-300 py-3 text-sm font-extrabold text-navy-950 transition hover:-translate-y-0.5">
            ورود
          </button>
          <p className="mt-5 text-center text-[0.65rem] text-white/40">رمز پیش‌فرض: hosseini1404 (از طریق ADMIN_PASSWORD قابل تغییر)</p>
        </form>
      </div>
    </main>
  );
}
