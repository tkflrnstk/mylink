import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "마이링크 (MyLink) | 나를 표현하는 가장 간단한 프로필 링크",
    template: "%s | 마이링크 (MyLink)",
  },
  description:
    "흩어져 있던 SNS, 포트폴리오, 작업물을 단 하나의 프로필 링크로 모아보세요. 3초 원클릭 시작, 실시간 클릭 통계 및 인라인 편집 제공.",
  keywords: [
    "마이링크",
    "MyLink",
    "프로필 링크",
    "링크트리",
    "멀티링크",
    "인스타 프로필 링크",
    "바이오 링크",
    "포트폴리오 링크",
    "개발자 링크",
    "크리에이터 링크",
  ],
  authors: [{ name: "MyLink" }],
  creator: "MyLink",
  publisher: "MyLink",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "마이링크 (MyLink) | 나를 표현하는 가장 간단한 프로필 링크",
    description:
      "흩어져 있던 SNS, 포트폴리오, 작업물을 단 하나의 프로필 링크로 모아보세요. 3초 원클릭 시작, 실시간 클릭 통계 및 인라인 편집 제공.",
    url: "/",
    siteName: "MyLink",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 (MyLink) | 나를 표현하는 가장 간단한 프로필 링크",
    description:
      "흩어져 있던 SNS, 포트폴리오, 작업물을 단 하나의 프로필 링크로 모아보세요. 3초 원클릭 시작, 실시간 통계 분석 제공.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google259133a38faf5a7b",
    other: {
      "naver-site-verification": "3ca5156a12abef080108bf2db3020401",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-tds-fill-weak text-tds-text-primary">
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
