import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "실시간 링크 분석 & 통계",
  description: "내 마이링크의 방문자 수, 링크별 클릭 수, 인기 콘텐츠 순위를 실시간 대시보드로 분석하세요.",
  keywords: ["링크 통계", "방문자 분석", "클릭률", "마이링크 대시보드", "MyLink Stats"],
  openGraph: {
    title: "실시간 링크 분석 & 통계 | 마이링크",
    description: "내 마이링크의 방문자 수와 링크별 클릭 수를 실시간 차트로 확인하세요.",
    url: "/stats",
    siteName: "MyLink",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "실시간 링크 분석 & 통계 | 마이링크",
    description: "내 마이링크의 방문자 수와 링크별 클릭 수를 실시간 차트로 확인하세요.",
  },
  robots: {
    index: false, // 개인 계정 대시보드는 검색엔진 색인 제외
    follow: true,
  },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
