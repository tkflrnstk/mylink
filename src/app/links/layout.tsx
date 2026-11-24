import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "나의 맞춤 링크 관리",
  description: "등록된 마이링크를 실시간으로 추가, 수정, 삭제하고 관리하세요.",
  keywords: ["링크 관리", "프로필 링크 설정", "MyLink"],
  openGraph: {
    title: "나의 맞춤 링크 관리 | 마이링크",
    description: "등록된 마이링크를 실시간으로 추가, 수정, 삭제하고 관리하세요.",
    url: "/links",
    siteName: "MyLink",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "나의 맞춤 링크 관리 | 마이링크",
    description: "등록된 마이링크를 실시간으로 관리하세요.",
  },
  robots: {
    index: false, // 개인 관리 페이지는 검색엔진 색인 제외
    follow: true,
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
