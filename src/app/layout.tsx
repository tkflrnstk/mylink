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

export const metadata: Metadata = {
  title: "마이링크 (MyLink) | 나만의 맞춤 링크 관리",
  description: "Google 계정으로 로그인하여 나만의 맞춤 링크를 생성하고 실시간으로 관리할 수 있는 MyLink 서비스입니다.",
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
