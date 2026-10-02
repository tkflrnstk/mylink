import { NextResponse } from "next/server";

// ⚠️ 이 더미 데이터는 PRD(production) 환경에서만 사용됩니다.
// Mock 데이터 - DB나 외부 API로 교체 시 이 부분만 수정
const MOCK_LINKS = [
  {
    id: "1",
    title: "GitHub 코드 저장소",
    subtitle: "@tkflrnstk",
    description: "개발 프로젝트와 오픈소스 코드 모음",
    url: "https://github.com/tkflrnstk",
    emoji: "🐙",
    badge: "코드",
    badgeBg: "bg-[#e60012] text-white",
  },
  {
    id: "2",
    title: "기술 & 항해 블로그",
    subtitle: "blog.nolink.dev",
    description: "공부 기록과 바이브 코딩, 항해 이야기",
    url: "#",
    emoji: "📝",
    badge: "기록",
    badgeBg: "bg-[#3d4f97] text-white",
  },
  {
    id: "3",
    title: "이메일 연락하기",
    subtitle: "contact@example.com",
    description: "프로젝트 제안 및 방명록 문의",
    url: "mailto:contact@example.com",
    emoji: "✉️",
    badge: "문의",
    badgeBg: "bg-[#206479] text-white",
  },
  {
    id: "4",
    title: "LinkedIn 프로필",
    subtitle: "linkedin.com/in/tkflrnstk",
    description: "경력 사항 및 네트워킹",
    url: "https://linkedin.com/in/tkflrnstk",
    emoji: "💼",
    badge: "경력",
    badgeBg: "bg-[#0077b5] text-white",
  },
  {
    id: "5",
    title: "포트폴리오 사이트",
    subtitle: "portfolio.nolink.dev",
    description: "작업물 쇼케이스 및 프로젝트 소개",
    url: "#",
    emoji: "🎨",
    badge: "포폴",
    badgeBg: "bg-[#7c3aed] text-white",
  },
  {
    id: "6",
    title: "YouTube 채널",
    subtitle: "@NoKihun_Dev",
    description: "개발 브이로그 & 항해 영상",
    url: "https://youtube.com/@NoKihun_Dev",
    emoji: "🎬",
    badge: "영상",
    badgeBg: "bg-[#ff0000] text-white",
  },
  {
    id: "7",
    title: "노션 이력서",
    subtitle: "notion.so/nkh-resume",
    description: "항해사 & 개발자 통합 이력서",
    url: "#",
    emoji: "📄",
    badge: "이력서",
    badgeBg: "bg-[#374151] text-white",
  },
  {
    id: "8",
    title: "오픈카카오 채팅",
    subtitle: "open.kakao.com/nkh",
    description: "빠른 문의 및 협업 제안",
    url: "#",
    emoji: "💬",
    badge: "채팅",
    badgeBg: "bg-[#f9e000] text-black",
  },
];

// GET /api/links
export async function GET() {
  // 더미 데이터는 PRD(production) 환경에서만 사용
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json(
      { success: false, message: "Mock 데이터는 PRD 환경에서만 제공됩니다." },
      { status: 404 }
    );
  }

  // 실제 서비스 시: await db.links.findMany() 등으로 교체
  return NextResponse.json({
    success: true,
    data: MOCK_LINKS,
    total: MOCK_LINKS.length,
  });
}
