import { db } from "@/db";
import { leads } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { LEAD_STATUSES } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as { status?: string; notes?: string };
  const patch: Partial<typeof leads.$inferInsert> = { updatedAt: new Date() };
  if (body.status !== undefined) {
    if (!(body.status in LEAD_STATUSES)) return NextResponse.json({ error: "invalid status" }, { status: 422 });
    patch.status = body.status;
  }
  if (body.notes !== undefined) patch.notes = body.notes;

  const [updated] = await db.update(leads).set(patch).where(eq(leads.id, leadId)).returning();
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(leads).where(eq(leads.id, Number(id)));
  return NextResponse.json({ ok: true });
}
