import { db } from "@/db";
import { agents, leads } from "@/db/schema";
import { SERVICES, TIME_SLOTS } from "@/lib/constants";
import { generateTrackingCode } from "@/lib/data";
import { toEnDigits } from "@/lib/jalali";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const phone = toEnDigits(String(body.phone ?? "")).replace(/\D/g, "");
  const service = String(body.service ?? "");
  const preferredDate = String(body.preferredDate ?? "");
  const preferredTime = String(body.preferredTime ?? "");
  const city = String(body.city ?? "").trim() || null;
  const isOutOfTown = Boolean(body.isOutOfTown);
  const needsAccommodation = isOutOfTown && Boolean(body.needsAccommodation);
  const notes = String(body.notes ?? "").trim() || null;
  const agentSlug = body.agentSlug ? String(body.agentSlug) : null;

  if (fullName.length < 3) return NextResponse.json({ error: "نام و نام خانوادگی را کامل وارد کنید" }, { status: 422 });
  if (!/^09\d{9}$/.test(phone)) return NextResponse.json({ error: "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷)" }, { status: 422 });
  if (!SERVICES.some((s) => s.id === service)) return NextResponse.json({ error: "خدمت انتخاب‌شده معتبر نیست" }, { status: 422 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) return NextResponse.json({ error: "تاریخ نوبت را انتخاب کنید" }, { status: 422 });
  if (!TIME_SLOTS.includes(preferredTime)) return NextResponse.json({ error: "ساعت نوبت را انتخاب کنید" }, { status: 422 });

  let agentId: number | null = null;
  if (agentSlug) {
    const [agent] = await db.select({ id: agents.id, isActive: agents.isActive }).from(agents).where(eq(agents.slug, agentSlug)).limit(1);
    if (agent) agentId = agent.id;
  }

  // تلاش برای کد رهگیری یکتا
  for (let attempt = 0; attempt < 5; attempt++) {
    const trackingCode = generateTrackingCode();
    try {
      const [created] = await db
        .insert(leads)
        .values({
          trackingCode,
          agentId,
          source: agentId ? "agent" : "website",
          fullName,
          phone,
          service,
          preferredDate,
          preferredTime,
          city,
          isOutOfTown,
          needsAccommodation,
          notes,
        })
        .returning({ id: leads.id, trackingCode: leads.trackingCode });
      return NextResponse.json({ ok: true, trackingCode: created.trackingCode });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (!msg.includes("unique") && !msg.includes("duplicate")) {
        console.error(e);
        return NextResponse.json({ error: "خطا در ثبت نوبت. لطفاً دوباره تلاش کنید" }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ error: "خطا در تولید کد رهگیری" }, { status: 500 });
}
