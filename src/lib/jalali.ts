/** ابزارهای تاریخ شمسی بر پایه Intl (بدون وابستگی خارجی) */

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFa(input: string | number): string {
  return String(input).replace(/\d/g, (d) => faDigits[Number(d)]);
}

export function toEnDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** تبدیل تاریخ میلادی به رشته شمسی کامل: "شنبه ۱۲ مهر ۱۴۰۴" */
export function formatJalali(d: Date | string, opts?: { weekday?: boolean; year?: boolean }): string {
  const date = typeof d === "string" ? parseISODate(d) : d;
  const fmt = new Intl.DateTimeFormat("fa-IR", {
    weekday: opts?.weekday === false ? undefined : "long",
    day: "numeric",
    month: "long",
    year: opts?.year === false ? undefined : "numeric",
  });
  return fmt.format(date);
}

export function jalaliParts(d: Date) {
  const parts = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { weekday: get("weekday"), day: get("day"), month: get("month"), year: get("year") };
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function relativeTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "لحظاتی پیش";
  if (diff < 3600) return `${toFa(Math.floor(diff / 60))} دقیقه پیش`;
  if (diff < 86400) return `${toFa(Math.floor(diff / 3600))} ساعت پیش`;
  if (diff < 86400 * 7) return `${toFa(Math.floor(diff / 86400))} روز پیش`;
  return formatJalali(date, { weekday: false });
}

/** yyyy-mm-dd → Date در منطقه محلی */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** لیست روزهای قابل رزرو (بدون جمعه‌ها) */
export function getBookableDays(count = 14, startOffset = 1) {
  const days: { iso: string; weekday: string; day: string; month: string; isFriday: boolean }[] = [];
  const now = new Date();
  let i = startOffset;
  while (days.length < count) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    i++;
    const isFriday = d.getDay() === 5;
    if (isFriday) continue;
    const p = jalaliParts(d);
    days.push({ iso: toISODate(d), weekday: p.weekday, day: toFa(p.day), month: p.month, isFriday });
  }
  return days;
}

export function formatTime(t: string): string {
  return toFa(t);
}
