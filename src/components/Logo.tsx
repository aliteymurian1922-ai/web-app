import { CLINIC } from "@/lib/constants";

type Props = {
  size?: number;
  variant?: "light" | "dark";
  withText?: boolean;
  className?: string;
};

/** لوگوی کلینیک: دندان استیلیزه با ایمپلنت — به سبک لوگوی اصلی (سرمه‌ای / طلایی) */
export function LogoMark({ size = 48, variant = "light" }: { size?: number; variant?: "light" | "dark" }) {
  const ring = variant === "light" ? "#ffffff" : "#1b2f57";
  const gold = "#c9a24a";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <circle cx="50" cy="50" r="46" stroke={ring} strokeWidth="2.5" opacity="0.9" />
      <circle cx="50" cy="50" r="40" stroke={gold} strokeWidth="1" opacity="0.5" />
      {/* Tooth crown */}
      <path
        d="M34 28c-6 0-11 6-11 14 0 7 4 12 6 18 1.5 4 2 12 6 12 3 0 3-6 4-10 1-3 3-3 4 0 1 4 1 10 4 10 4 0 4.5-8 6-12 2-6 6-11 6-18 0-8-5-14-11-14-3 0-5 1.5-7 1.5S37 28 34 28z"
        fill={ring}
      />
      {/* Implant screw (gold) on the right side */}
      <path d="M62 44h9l-1 4h-7zM63 50h7l-1 4h-5zM64 56h5l-1 4h-3zM65 62h3l-1.5 5z" fill={gold} />
      <path d="M60 40h13v3H60z" fill={gold} />
      {/* Highlight swoosh */}
      <path d="M30 40c3-6 8-9 14-9" stroke={gold} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

export function Logo({ size = 44, variant = "light", withText = true, className = "" }: Props) {
  const text = variant === "light" ? "text-white" : "text-navy-900";
  const sub = variant === "light" ? "text-gold-300" : "text-gold-600";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={size} variant={variant} />
      {withText && (
        <div className="leading-tight">
          <div className={`font-extrabold text-[1.05rem] ${text}`}>{CLINIC.doctor}</div>
          <div className={`text-[0.6rem] tracking-[0.22em] font-medium ${sub}`}>{CLINIC.doctorEn}</div>
        </div>
      )}
    </div>
  );
}
