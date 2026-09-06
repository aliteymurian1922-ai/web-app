import { BookingShell } from "@/components/booking/BookingShell";
import { recordVisit } from "@/lib/data";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "رزرو نوبت آنلاین" };

type SP = Promise<{ service?: string; accommodation?: string }>;

export default async function BookPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const h = await headers();
  await recordVisit(null, h.get("user-agent"));
  return <BookingShell agent={null} initialService={sp.service} initialAccommodation={sp.accommodation === "1"} />;
}
