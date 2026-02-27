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
  description: "วันพิเศษของปุ้มปุ้ยที่รัก สำเร็จการศึกษาแล้ว! เก่งที่สุดเลยนะคับอ้วน",
  metadataBase: new URL("https://nextjs-boilerplate-ppnnoots-projects.vercel.app"),
  openGraph: {
    title: "ของขวัญพิเศษสำหรับอ้วน 🎓💕",
    description: "วันพิเศษของปุ้มปุ้ยที่รัก สำเร็จการศึกษาแล้ว!",
    url: "https://nextjs-boilerplate-ppnnoots-projects.vercel.app",
    siteName: "GradGift For You",
    locale: "th_TH",
    type: "website",
  },
  themeColor: "#ff85b1",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={mitr.className}>{children}</body>
    </html>
  );
}
