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

import { addLinkToFirestore, getFirestoreLinks } from "@/lib/links";

// GET /api/links
export async function GET() {
  try {
    const links = await getFirestoreLinks();
    if (links.length > 0) {
      return NextResponse.json({
        success: true,
        data: links,
        total: links.length,
      });
    }

    // 더미 데이터 폴백
    return NextResponse.json({
      success: true,
      data: MOCK_LINKS,
      total: MOCK_LINKS.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "링크 조회 실패" },
      { status: 500 }
    );
  }
}

// POST /api/links
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, subtitle, description, emoji, badge, badgeBg } = body;

    if (!title || !url) {
      return NextResponse.json(
        { success: false, message: "title과 url은 필수 항목입니다." },
        { status: 400 }
      );
    }

    const docId = await addLinkToFirestore({
      title,
      url,
      subtitle,
      description,
      emoji,
      badge,
      badgeBg,
    });

    return NextResponse.json({
      success: true,
      id: docId,
      message: "링크가 Firestore(users/anonymous/links)에 성공적으로 저장되었습니다.",
    });
  } catch (error: any) {
    console.error("POST /api/links error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "링크 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

