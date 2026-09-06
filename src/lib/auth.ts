import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE = "hc_admin_session";

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "hosseini1404";
}

function tokenFor(password: string) {
  return createHash("sha256").update(`hc:${password}:clinic-dashboard`).digest("hex");
}

export function verifyPassword(password: string) {
  return password === adminPassword();
}

export async function createSession() {
  const store = await cookies();
  store.set(COOKIE, tokenFor(adminPassword()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated() {
  const store = await cookies();
  return store.get(COOKIE)?.value === tokenFor(adminPassword());
}
