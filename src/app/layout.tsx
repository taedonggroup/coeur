import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { getPageContent } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPageContent("site");
  return {
    title: { default: site.title, template: `%s — Coeur` },
    description: site.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}

        {/* ga-auto:start — site_auto가 자동 삽입 (GA4: G-JFTZC5TWPS) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-JFTZC5TWPS`}
          strategy="afterInteractive"
        />
        <Script id="ga-auto" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-JFTZC5TWPS');`}
        </Script>
        {/* ga-auto:end */}
        {/* nav-auto:start — 페이지 이동 추적 (site_auto 자동삽입) */}
        <Script
          src={`https://dashboard-beta-eight-76.vercel.app/api/track-js?site=coeur`}
          strategy="afterInteractive"
        />
        {/* nav-auto:end */}
        </body>
    </html>
  );
}
