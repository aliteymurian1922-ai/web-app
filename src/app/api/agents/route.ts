import { db } from "@/db";
import { agents } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { AGENT_COLORS } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { name?: string; slug?: string; phone?: string; role?: string; color?: string };
  const name = String(body.name ?? "").trim();
  let slug = slugify(String(body.slug ?? ""));
  if (name.length < 2) return NextResponse.json({ error: "نام کارشناس را وارد کنید" }, { status: 422 });
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: "شناسه لینک باید فقط حروف انگلیسی، عدد و خط تیره باشد" }, { status: 422 });

  const [exists] = await db.select({ id: agents.id }).from(agents).where(eq(agents.slug, slug)).limit(1);
  if (exists) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;

  const [created] = await db
    .insert(agents)
    .values({
      name,
      slug,
      phone: body.phone?.trim() || null,
      role: body.role?.trim() || "کارشناس فروش",
      color: body.color && /^#[0-9a-f]{6}$/i.test(body.color) ? body.color : AGENT_COLORS[Math.floor(Math.random() * AGENT_COLORS.length)],
    })
    .returning();
  return NextResponse.json({ ok: true, agent: created });
}

export async function PATCH(req: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { id?: number; isActive?: boolean };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const [updated] = await db.update(agents).set({ isActive: Boolean(body.isActive) }).where(eq(agents.id, body.id)).returning();
  return NextResponse.json({ ok: true, agent: updated });
}
