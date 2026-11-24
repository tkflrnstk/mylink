"use client";

import React, { useState } from "react";
import { 
  Users, 
  CheckCircle, 
  Sparkles, 
  Camera,
  Code2,
  Store,
  Briefcase
} from "lucide-react";

interface CaseItem {
  id: string;
  category: string;
  icon: typeof Camera;
  title: string;
  description: string;
  highlights: string[];
  sampleProfile: {
    name: string;
    handle: string;
    avatar: string;
    tagline: string;
    topLinks: { label: string; badge: string; count: string }[];
  };
}

const CASES: CaseItem[] = [
  {
    id: "creator",
    category: "크리에이터 & 인플루언서",
    icon: Camera,
    title: "SNS마다 흩어진 콘텐츠를 모아 팬들과 더 가깝게",
    description:
      "인스타그램 바이오의 소중한 한 줄 링크에 유튜브, 틱톡, 협찬 문의, 자체 굿즈 샵까지 빠짐없이 담으세요. 실시간 클릭 통계로 팬들이 가장 좋아하는 콘텐츠를 즉시 알 수 있습니다.",
    highlights: [
      "인스타그램 프로필 링크 하나로 모든 채널 연결",
      "신규 영상 및 공구 링크에 'HOT/공구마감' 뱃지 적용",
      "클릭 수 분석으로 협찬 제안서 데이터 구축",
    ],
    sampleProfile: {
      name: "유진의 데일리 룸",
      handle: "@yujin_daily",
      avatar: "🌸",
      tagline: "따뜻한 일상과 홈카페 레시피를 전합니다 ☕️",
      topLinks: [
        { label: "유튜브: 홈카페 브이로그 보러가기", badge: "HOT", count: "3.4k" },
        { label: "직접 제작한 텀블러 & 머그컵 공구", badge: "한정수량", count: "1.8k" },
        { label: "비즈니스 및 광고 협업 문의하기", badge: "공식", count: "420" },
      ],
    },
  },
  {
    id: "developer",
    category: "개발자 & 테크 메이커",
    icon: Code2,
    title: "기술 블로그, 깃허브, 프로젝트를 한 번에 브랜딩",
    description:
      "취업 이력서, 커피챗 제안, 개발 블로그, 오픈소스 리포지토리를 깔끔하게 정리해보세요. 미니멀하고 테크 친화적인 감성으로 당신의 기술 스택을 돋보이게 만듭니다.",
    highlights: [
      "최신 사이드 프로젝트에 'NEW' 뱃지로 주목도 극대화",
      "GitHub, Velog, LinkedIn을 단일 URL로 스마트하게 공유",
      "채용 담당자가 한눈에 보기 편한 직관적인 모바일 뷰",
    ],
    sampleProfile: {
      name: "김개발 (Dev Kim)",
      handle: "@dev_kim_kr",
      avatar: "⚡️",
      tagline: "웹 풀스택 개발자 · 세상에 유용한 서비스를 만듭니다",
      topLinks: [
        { label: "GitHub 오픈소스 프로젝트 모음", badge: "NEW", count: "890" },
        { label: "기술 블로그: Next.js 트러블슈팅", badge: "인기글", count: "2.1k" },
        { label: "2026 경력 기술서 & 이력서 (PDF)", badge: "업데이트", count: "650" },
      ],
    },
  },
  {
    id: "business",
    category: "소상공인 & 로컬 브랜드",
    icon: Store,
    title: "예약, 매장 위치, 공지사항을 손님들에게 손쉽게 안내",
    description:
      "인스타 프로필 링크를 누른 손님이 바로 네이버 예약, 카카오톡 1:1 상담, 오시는 길 지도로 이동할 수 있도록 안내하세요. 고객 이탈률을 획기적으로 낮춥니다.",
    highlights: [
      "네이버 예약 및 지도 다이렉트 연동으로 예약률 증가",
      "시즌 신메뉴, 휴무일 공지를 상단 뱃지로 강조",
      "카카오톡 채널 상담 링크로 원클릭 고객 응대",
    ],
    sampleProfile: {
      name: "카페 로스터리 성수",
      handle: "@cafe_seongsu",
      avatar: "☕️",
      tagline: "성수동 스페셜티 커피 & 수제 디저트 전문점",
      topLinks: [
        { label: "네이버 스마트플레이스 예약 & 길찾기", badge: "필수", count: "4.2k" },
        { label: "카카오 채널 1:1 홀케이크 예약 문의", badge: "주문가능", count: "1.9k" },
        { label: "스마트스토어 당일 로스팅 원두 구매", badge: "무료배송", count: "1.3k" },
      ],
    },
  },
  {
    id: "freelancer",
    category: "디자이너 & 프리랜서",
    icon: Briefcase,
    title: "포트폴리오와 외주 의뢰 폼을 프로페셔널하게",
    description:
      "비핸스, 노션 포트폴리오, 구글 폼 외주 접수를 정돈된 프로필로 보여주세요. 클라이언트에게 신뢰감을 주는 가장 정돈된 첫인상을 선물합니다.",
    highlights: [
      "노션 포트폴리오와 비핸스 프로젝트를 한눈에 전달",
      "작업 가능 일정 및 외주 견적서 폼 즉시 연결",
      "모바일과 데스크톱 어디서나 깔끔한 반응형 레이아웃",
    ],
    sampleProfile: {
      name: "스튜디오 미르 (디자이너)",
      handle: "@studio_mir",
      avatar: "🪄",
      tagline: "브랜드 아이덴티티 & UI/UX 디자인 에이전시",
      topLinks: [
        { label: "2026 브랜드 디자인 노션 포트폴리오", badge: "BEST", count: "1.5k" },
        { label: "신규 프로젝트 의뢰 & 견적 신청서", badge: "접수중", count: "720" },
        { label: "비핸스 (Behance) 상세 작업 케이스", badge: "디자인", count: "980" },
      ],
    },
  },
];

export function UseCases() {
  const [activeTab, setActiveTab] = useState(CASES[0].id);
  const currentCase = CASES.find((c) => c.id === activeTab) || CASES[0];

  return (
    <section className="w-full py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 헤더 */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[13px] font-semibold mb-4 border border-blue-100">
            <Users size={14} className="text-blue-500" />
            <span>누구나 쉬운 활용</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            이미 다양한 분야의 사람들이<br className="sm:hidden" />
            <span className="text-blue-600"> 마이링크로 연결되고 있어요</span>
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
            나의 활동 분야에 맞게 최적화된 프로필 링크를 디자인해보세요.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-12 no-scrollbar">
          {CASES.map((item) => {
            const isSelected = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`h-11 px-4 sm:px-5 rounded-2xl text-[13px] sm:text-[14px] font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <Icon size={16} />
                <span>{item.category.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* 탭 콘텐츠 카드 */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 왼쪽 설명 */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-600 mb-3 bg-blue-50 px-2.5 py-1 rounded-full w-fit">
              <Sparkles size={13} />
              <span>{currentCase.category}</span>
            </div>
            <h3 className="text-[20px] sm:text-[24px] font-extrabold text-slate-900 mb-3 leading-snug">
              {currentCase.title}
            </h3>
            <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed mb-6">
              {currentCase.description}
            </p>

            <div className="flex flex-col gap-2.5 mb-6">
              {currentCase.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-[13px] sm:text-[14px] text-slate-700 font-medium">
                    {h}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 실제 프로필 예시 카드 */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                LIVE PREVIEW
              </span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                실제 적용 예시
              </span>
            </div>

            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl mb-2 border border-slate-200">
                {currentCase.sampleProfile.avatar}
              </div>
              <h4 className="text-[16px] font-bold text-slate-900">
                {currentCase.sampleProfile.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium mb-1">
                {currentCase.sampleProfile.handle}
              </p>
              <p className="text-[11px] text-slate-600 leading-tight">
                {currentCase.sampleProfile.tagline}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {currentCase.sampleProfile.topLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between gap-2 shadow-2xs hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[12px] font-bold text-slate-800 truncate">
                      {link.label}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 shrink-0">
                      {link.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {link.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
