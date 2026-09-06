export const CLINIC = {
  name: "کلینیک ایمپلنت دکتر حسینی",
  doctor: "دکتر سید محمدرضا حسینی",
  doctorEn: "DR. SEYED MOHAMMADREZA HOSEYNI",
  tagline: "تجربه‌ای حرفه‌ای، درمانی مطمئن",
  address:
    "تهران، شهرک غرب، بلوار فرحزادی، انتهای خیابان حافظی، نرسیده به اتوبان یادگار امام، پلاک ۱۹۶، طبقه دوم",
  phone: "۰۲۱-۸۸۰۰۰۰۰۰",
  hours: "شنبه تا پنج‌شنبه، ۹ صبح تا ۲۰",
};

export const SERVICES = [
  { id: "implant", title: "ایمپلنت", desc: "کاشت دندان با پکیج اختصاصی ۲۲ مرحله‌ای", icon: "🦷", featured: true },
  { id: "laminate", title: "لمینت", desc: "طراحی لبخند با لمینت سرامیکی", icon: "✨" },
  { id: "composite", title: "کامپوزیت ونیر", desc: "زیبایی سریع و بدون تراش", icon: "💎" },
  { id: "bleaching", title: "بلیچینگ", desc: "سفید کردن تخصصی دندان", icon: "🌟" },
  { id: "aligner", title: "الاینر شفاف", desc: "ارتودنسی نامرئی", icon: "😁" },
  { id: "gumlift", title: "لیفت لثه", desc: "اصلاح خط لبخند", icon: "🌿" },
  { id: "scaling", title: "جرم‌گیری", desc: "بهداشت و پیشگیری", icon: "🫧" },
  { id: "restoration", title: "ترمیم دندان", desc: "ترمیم همرنگ دندان", icon: "🔧" },
  { id: "endo", title: "اندو و عصب‌کشی", desc: "درمان ریشه بدون درد", icon: "⚡" },
  { id: "extraction", title: "کشیدن دندان", desc: "جراحی دندان عقل و نهفته", icon: "🩺" },
  { id: "overdenture", title: "اوردنچر", desc: "پروتز متکی بر ایمپلنت", icon: "🦷" },
  { id: "postcrown", title: "پست دندان و روکش", desc: "بازسازی دندان‌های ضعیف", icon: "👑" },
  { id: "consult", title: "مشاوره و ویزیت", desc: "ویزیت و طرح درمان اولیه", icon: "📋" },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

export const PACKAGE_ITEMS = [
  "ویزیت و طرح درمان اولیه با دکتر حسینی",
  "اسکن سه‌بعدی",
  "اسکن Face",
  "اسکن بادی توسط پزشک",
  "طراحی Surgical Guide",
  "بی‌حسی دیجیتال",
  "Quick Sleeper — بی‌حسی دیجیتال برتر",
  "پرینت Surgical Guide",
  "ایمپلنت",
  "اباتمنت",
  "تحویل جعبه فیکسچر قبل از شروع درمان",
  "نظارت مستقیم دکتر حسینی در تمام مراحل",
  "روکش موقت",
  "روکش دائم",
  "تست پایداری ایمپلنت",
  "عکس OPG بعد از درمان",
  "پک دارویی بیمار",
  "لیزر تراپی بعد از درمان",
  "واترجت رایگان جهت نگهداری ایمپلنت",
  "پشتیبانی اختصاصی و Follow Up",
  "کارت گارانتی",
  "موفقیت درمان بالای ۹۸٪",
];

export const PROCESS_STEPS = [
  { title: "پذیرش", items: ["ثبت اطلاعات", "اسکن عکس"] },
  { title: "ویزیت", items: ["ویزیت توسط پزشک", "ثبت درمان"] },
  { title: "پذیرش", items: ["انتظار در بخش پذیرش"] },
  { title: "اسکن دهان", items: ["اسکن کامل دهان"] },
  { title: "شرح درمان توسط دستیار پزشک", items: ["پاسخ به مسائل درمانی و پزشکی"] },
  { title: "مشاور درمان و قرارداد", items: ["مسائل مالی", "عقد قرارداد"] },
  { title: "مالی", items: ["پرداخت نهایی"] },
  { title: "نوبت‌دهی درمان", items: ["تعیین نوبت", "شروع درمان"] },
];

export const TIME_SLOTS = [
  "09:00", "09:45", "10:30", "11:15", "12:00",
  "14:00", "14:45", "15:30", "16:15", "17:00", "17:45", "18:30", "19:15",
];

export const LEAD_STATUSES = {
  new: { label: "جدید", color: "bg-sky-100 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  contacted: { label: "تماس گرفته شد", color: "bg-amber-100 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  confirmed: { label: "تأیید شده", color: "bg-emerald-100 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  attended: { label: "مراجعه کرد", color: "bg-violet-100 text-violet-700 ring-violet-200", dot: "bg-violet-500" },
  cancelled: { label: "لغو شده", color: "bg-rose-100 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
} as const;

export type LeadStatus = keyof typeof LEAD_STATUSES;

export const AGENT_COLORS = ["#1b2a4a", "#c9a24a", "#0f766e", "#7c3aed", "#db2777", "#ea580c", "#2563eb", "#059669"];

export const DEFAULT_AGENTS = [
  { name: "سارا محمدی", slug: "sara", phone: "۰۹۱۲۰۰۰۰۰۰۱", color: "#7c3aed" },
  { name: "علی رضایی", slug: "ali", phone: "۰۹۱۲۰۰۰۰۰۰۲", color: "#0f766e" },
  { name: "مریم کریمی", slug: "maryam", phone: "۰۹۱۲۰۰۰۰۰۰۳", color: "#db2777" },
  { name: "رضا احمدی", slug: "reza", phone: "۰۹۱۲۰۰۰۰۰۰۴", color: "#2563eb" },
];
