import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CLINIC } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${CLINIC.name} | نوبت‌دهی آنلاین`,
    template: `%s | ${CLINIC.name}`,
  },
  description: `رزرو آنلاین نوبت ویزیت و مشاوره ایمپلنت با ${CLINIC.doctor} — شهرک غرب، تهران. پکیج اختصاصی ایمپلنت با موفقیت بالای ۹۸٪.`,
  keywords: ["ایمپلنت", "دکتر حسینی", "کلینیک دندانپزشکی", "شهرک غرب", "نوبت آنلاین", "لمینت"],
};

export const viewport: Viewport = {
  themeColor: "#0c1a36",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f6f7fb] text-navy-900 antialiased">{children}</body>
    </html>
  );
}
