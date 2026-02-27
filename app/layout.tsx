import type { Metadata } from "next";
import { Mitr } from "next/font/google";
import "./globals.css";

const mitr = Mitr({
  weight: ["300", "400", "500", "600"],
  subsets: ["thai", "latin"],
  variable: "--font-mitr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ของขวัญพิเศษสำหรับอ้วน 🎓💕",
  description: "วันพิเศษของปุ้มปุ้ยที่รัก สำเร็จการศึกษาแล้ว!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={mitr.className}>{children}</body>
    </html>
  );
}
