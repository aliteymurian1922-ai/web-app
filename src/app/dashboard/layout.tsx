import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { destroySession, isAuthenticated } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

async function logout() {
  "use server";
  await destroySession();
  redirect("/login");
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  if (!(await isAuthenticated())) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#f3f5fa]">
      <Sidebar onLogout={logout} />
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
