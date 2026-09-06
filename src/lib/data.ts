import { db } from "@/db";
import { agents, leads, linkVisits } from "@/db/schema";
import { DEFAULT_AGENTS } from "@/lib/constants";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { toISODate } from "@/lib/jalali";

/** اگر هیچ کارشناسی وجود نداشت، کارشناسان پیش‌فرض ساخته می‌شوند */
export async function ensureSeed() {
  const [{ value }] = await db.select({ value: count() }).from(agents);
  if (value === 0) {
    await db.insert(agents).values(DEFAULT_AGENTS).onConflictDoNothing();
  }
}

export async function getAgentBySlug(slug: string) {
  const [agent] = await db.select().from(agents).where(eq(agents.slug, slug)).limit(1);
  return agent ?? null;
}

export async function recordVisit(agentId: number | null, userAgent: string | null) {
  try {
    await db.insert(linkVisits).values({ agentId, userAgent });
  } catch {
    /* بازدید غیر بحرانی است */
  }
}

export async function getAllAgents() {
  await ensureSeed();
  return db.select().from(agents).orderBy(agents.createdAt);
}

export type AgentStats = {
  id: number;
  name: string;
  slug: string;
  phone: string | null;
  color: string | null;
  isActive: boolean;
  createdAt: Date;
  totalLeads: number;
  confirmed: number;
  attended: number;
  cancelled: number;
  visits: number;
  monthLeads: number;
};

export async function getAgentStats(): Promise<AgentStats[]> {
  await ensureSeed();
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const rows = await db
    .select({
      id: agents.id,
      name: agents.name,
      slug: agents.slug,
      phone: agents.phone,
      color: agents.color,
      isActive: agents.isActive,
      createdAt: agents.createdAt,
      totalLeads: sql<number>`(select count(*) from ${leads} where ${leads.agentId} = ${agents.id})`.mapWith(Number),
      confirmed: sql<number>`(select count(*) from ${leads} where ${leads.agentId} = ${agents.id} and ${leads.status} in ('confirmed','attended'))`.mapWith(Number),
      attended: sql<number>`(select count(*) from ${leads} where ${leads.agentId} = ${agents.id} and ${leads.status} = 'attended')`.mapWith(Number),
      cancelled: sql<number>`(select count(*) from ${leads} where ${leads.agentId} = ${agents.id} and ${leads.status} = 'cancelled')`.mapWith(Number),
      visits: sql<number>`(select count(*) from ${linkVisits} where ${linkVisits.agentId} = ${agents.id})`.mapWith(Number),
      monthLeads: sql<number>`(select count(*) from ${leads} where ${leads.agentId} = ${agents.id} and ${leads.createdAt} >= ${monthAgo.toISOString()})`.mapWith(Number),
    })
    .from(agents)
    .orderBy(desc(sql`(select count(*) from ${leads} where ${leads.agentId} = ${agents.id})`), agents.createdAt);

  return rows;
}

export type LeadWithAgent = typeof leads.$inferSelect & {
  agentName: string | null;
  agentColor: string | null;
  agentSlug: string | null;
};

export async function getLeads(filters?: { status?: string; agentId?: number; q?: string; limit?: number }) {
  const conds = [];
  if (filters?.status && filters.status !== "all") conds.push(eq(leads.status, filters.status));
  if (filters?.agentId) conds.push(eq(leads.agentId, filters.agentId));
  if (filters?.q) {
    const q = `%${filters.q}%`;
    conds.push(sql`(${leads.fullName} ilike ${q} or ${leads.phone} ilike ${q} or ${leads.trackingCode} ilike ${q})`);
  }

  const rows = await db
    .select({
      lead: leads,
      agentName: agents.name,
      agentColor: agents.color,
      agentSlug: agents.slug,
    })
    .from(leads)
    .leftJoin(agents, eq(leads.agentId, agents.id))
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(leads.createdAt))
    .limit(filters?.limit ?? 500);

  return rows.map((r) => ({ ...r.lead, agentName: r.agentName, agentColor: r.agentColor, agentSlug: r.agentSlug })) as LeadWithAgent[];
}

export async function getUpcomingAppointments(days = 14) {
  const today = toISODate(new Date());
  const rows = await db
    .select({ lead: leads, agentName: agents.name, agentColor: agents.color, agentSlug: agents.slug })
    .from(leads)
    .leftJoin(agents, eq(leads.agentId, agents.id))
    .where(and(gte(leads.preferredDate, today), sql`${leads.status} <> 'cancelled'`))
    .orderBy(leads.preferredDate, leads.preferredTime)
    .limit(days * 20);
  return rows.map((r) => ({ ...r.lead, agentName: r.agentName, agentColor: r.agentColor, agentSlug: r.agentSlug })) as LeadWithAgent[];
}

export async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(todayStart);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const prevWeek = new Date(weekAgo);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const todayIso = toISODate(now);

  const [totals] = await db
    .select({
      total: count(),
      today: sql<number>`count(*) filter (where ${leads.createdAt} >= ${todayStart.toISOString()})`.mapWith(Number),
      week: sql<number>`count(*) filter (where ${leads.createdAt} >= ${weekAgo.toISOString()})`.mapWith(Number),
      prevWeek: sql<number>`count(*) filter (where ${leads.createdAt} >= ${prevWeek.toISOString()} and ${leads.createdAt} < ${weekAgo.toISOString()})`.mapWith(Number),
      confirmed: sql<number>`count(*) filter (where ${leads.status} in ('confirmed','attended'))`.mapWith(Number),
      attended: sql<number>`count(*) filter (where ${leads.status} = 'attended')`.mapWith(Number),
      cancelled: sql<number>`count(*) filter (where ${leads.status} = 'cancelled')`.mapWith(Number),
      newLeads: sql<number>`count(*) filter (where ${leads.status} = 'new')`.mapWith(Number),
      todayAppointments: sql<number>`count(*) filter (where ${leads.preferredDate} = ${todayIso} and ${leads.status} <> 'cancelled')`.mapWith(Number),
      outOfTown: sql<number>`count(*) filter (where ${leads.isOutOfTown} = true)`.mapWith(Number),
      implant: sql<number>`count(*) filter (where ${leads.service} = 'implant')`.mapWith(Number),
    })
    .from(leads);

  const [visitTotals] = await db.select({ total: count() }).from(linkVisits);

  // ۱۴ روز اخیر
  const dailyRaw = await db
    .select({
      day: sql<string>`to_char(${leads.createdAt} at time zone 'Asia/Tehran', 'YYYY-MM-DD')`,
      n: count(),
    })
    .from(leads)
    .where(gte(leads.createdAt, new Date(todayStart.getTime() - 13 * 86400000)))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  const daily: { iso: string; n: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(todayStart.getTime() - i * 86400000);
    const iso = toISODate(d);
    daily.push({ iso, n: Number(dailyRaw.find((r) => r.day === iso)?.n ?? 0) });
  }

  const byService = await db
    .select({ service: leads.service, n: count() })
    .from(leads)
    .groupBy(leads.service)
    .orderBy(desc(count()))
    .limit(6);

  const byStatus = await db.select({ status: leads.status, n: count() }).from(leads).groupBy(leads.status);

  return {
    ...totals,
    visits: visitTotals.total,
    daily,
    byService: byService.map((s) => ({ service: s.service, n: Number(s.n) })),
    byStatus: byStatus.map((s) => ({ status: s.status, n: Number(s.n) })),
  };
}

export function generateTrackingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "HC-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
