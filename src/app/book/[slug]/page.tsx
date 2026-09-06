import { BookingShell } from "@/components/booking/BookingShell";
import { ensureSeed, getAgentBySlug, recordVisit } from "@/lib/data";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type SP = Promise<{ service?: string; accommodation?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  return { title: agent ? `رزرو نوبت — کارشناس ${agent.name}` : "رزرو نوبت آنلاین" };
}

export default async function AgentBookPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { slug } = await params;
  await ensureSeed();
  const agent = await getAgentBySlug(slug);
  if (!agent || !agent.isActive) notFound();

  const sp = await searchParams;
  const h = await headers();
  await recordVisit(agent.id, h.get("user-agent"));

  return <BookingShell agent={agent} initialService={sp.service} initialAccommodation={sp.accommodation === "1"} />;
}
