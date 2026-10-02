/**
 * /p/[slug] 더미 페이지에서 사용하는 페이지 콘텐츠 데이터.
 * slug → 상세 정보 매핑
 */
export const PAGE_DATA: Record<
  string,
  {
    emoji: string;
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    color: string; // 포인트 색상 (Toss Blue 계열 또는 브랜드 색)
    body: string;
  }
> = {
  github: {
    emoji: "🐙",
    title: "GitHub 코드 저장소",
    subtitle: "@tkflrnstk",
    description: "개발 프로젝트와 오픈소스 코드 모음",
    badge: "코드",
    color: "#1B64DA",
    body: "항해사이자 개발자로서 작업한 프로젝트와 오픈소스 기여 내역을 확인할 수 있습니다. 바이브 코딩 철학을 담은 레포지토리들을 자유롭게 둘러보세요.",
  },
  blog: {
    emoji: "📝",
    title: "기술 & 항해 블로그",
    subtitle: "blog.nolink.dev",
    description: "공부 기록과 바이브 코딩, 항해 이야기",
    badge: "기록",
    color: "#3182F6",
    body: "개발 학습 기록, 바이브 코딩 에세이, 그리고 바다 위 항해 이야기까지. 두 세계를 오가는 노기훈의 생각을 담은 글들을 만나보세요.",
  },
  contact: {
    emoji: "✉️",
    title: "이메일 연락하기",
    subtitle: "contact@example.com",
    description: "프로젝트 제안 및 방명록 문의",
    badge: "문의",
    color: "#206479",
    body: "프로젝트 협업 제안, 강연 요청, 또는 단순한 안부 인사까지 환영합니다. 메일로 연락 주시면 빠르게 답변 드리겠습니다.",
  },
  linkedin: {
    emoji: "💼",
    title: "LinkedIn 프로필",
    subtitle: "linkedin.com/in/tkflrnstk",
    description: "경력 사항 및 네트워킹",
    badge: "경력",
    color: "#0077b5",
    body: "정부 항해사 면허 취득부터 개발자로의 전환까지, 커리어 여정과 주요 프로젝트 경험을 확인하고 네트워크를 이어가세요.",
  },
  portfolio: {
    emoji: "🎨",
    title: "포트폴리오 사이트",
    subtitle: "portfolio.nolink.dev",
    description: "작업물 쇼케이스 및 프로젝트 소개",
    badge: "포폴",
    color: "#7c3aed",
    body: "기획부터 배포까지 직접 진행한 프로젝트들을 소개합니다. 디자인 시스템, 웹 앱, 사이드 프로젝트 등 다양한 작업물을 한눈에 확인하세요.",
  },
  youtube: {
    emoji: "🎬",
    title: "YouTube 채널",
    subtitle: "@NoKihun_Dev",
    description: "개발 브이로그 & 항해 영상",
    badge: "영상",
    color: "#ff0000",
    body: "개발하는 과정을 그대로 담은 코딩 브이로그와 실제 항해 현장 영상을 업로드합니다. 구독하고 함께 성장해요.",
  },
};
