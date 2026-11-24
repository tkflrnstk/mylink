"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Palette, 
  Check, 
  Link as LinkIcon,
  CheckCircle2,
  Copy
} from "lucide-react";

interface RolePreset {
  id: string;
  name: string;
  icon: string;
  defaultBio: string;
  links: {
    title: string;
    subtitle: string;
    badge?: string;
    emoji: string;
  }[];
}

const PRESETS: RolePreset[] = [
  {
    id: "creator",
    name: "크리에이터",
    icon: "🎨",
    defaultBio: "일상과 유용한 꿀팁을 전하는 크리에이터입니다 ✨",
    links: [
      { title: "인스타그램 릴스", subtitle: "매일 업데이트되는 짧은 영상", badge: "HOT", emoji: "📸" },
      { title: "유튜브 메인 채널", subtitle: "구독자 3.5만 메이커 공간", badge: "추천", emoji: "🎬" },
      { title: "굿즈 공식 스마트스토어", subtitle: "한정 수량 제작 굿즈 판매", emoji: "🛍️" },
    ],
  },
  {
    id: "developer",
    name: "개발자",
    icon: "💻",
    defaultBio: "문제를 해결하는 소프트웨어를 만듭니다 🚀",
    links: [
      { title: "GitHub 프로필", subtitle: "진행 중인 오픈소스 프로젝트", badge: "NEW", emoji: "🐙" },
      { title: "기술 블로그", subtitle: "트러블슈팅과 개발 회고록", badge: "인기", emoji: "📝" },
      { title: "사이드 프로젝트", subtitle: "최근 런칭한 AI 웹 서비스", emoji: "⚡️" },
    ],
  },
  {
    id: "business",
    name: "브랜드·매장",
    icon: "🛍️",
    defaultBio: "따뜻한 공간과 맛있는 커피를 준비합니다 ☕️",
    links: [
      { title: "네이버 지도 & 예약", subtitle: "방문 예약 및 매장 위치 확인", badge: "필수", emoji: "📍" },
      { title: "카카오 채널 1:1 문의", subtitle: "실시간 상담 및 단체 주문", badge: "빠른답변", emoji: "💬" },
      { title: "이달의 신메뉴 안내", subtitle: "시즌 한정 원두 & 베이커리", emoji: "🥐" },
    ],
  },
  {
    id: "freelancer",
    name: "디자이너·프리랜서",
    icon: "💼",
    defaultBio: "브랜드의 가치를 높이는 디자인을 제안합니다 🪄",
    links: [
      { title: "노션 포트폴리오", subtitle: "2026 브랜드 디자인 프로젝트", badge: "BEST", emoji: "📁" },
      { title: "비핸스 (Behance)", subtitle: "상세 UI/UX 및 그래픽 작업물", emoji: "🎨" },
      { title: "외주 의뢰 & 견적 신청", subtitle: "프로젝트 상담 폼 작성하기", badge: "접수중", emoji: "✉️" },
    ],
  },
];

const COLOR_PRESETS = [
  { id: "blue", name: "블루", bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-600" },
  { id: "purple", name: "바이올렛", bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-600" },
  { id: "emerald", name: "에메랄드", bg: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-600" },
  { id: "rose", name: "로즈", bg: "bg-rose-500", border: "border-rose-500", text: "text-rose-600" },
];

interface InteractiveSimulatorProps {
  onStartWithGoogle: () => void;
}

export function InteractiveSimulator({ onStartWithGoogle }: InteractiveSimulatorProps) {
  const [name, setName] = useState("윤서");
  const [selectedPresetId, setSelectedPresetId] = useState("creator");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [copiedLink, setCopiedLink] = useState(false);

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  const activeColorObj = COLOR_PRESETS.find((c) => c.id === selectedColor) || COLOR_PRESETS[0];

  const usernameSlug = name.trim().toLowerCase().replace(/[^a-z0-9가-힣]/gi, "") || "user";

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1800);
  };

  return (
    <section id="simulator" className="w-full py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 섹션 타이틀 */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[13px] font-semibold mb-4 border border-blue-100">
            <Sparkles size={14} className="text-blue-500 animate-spin" />
            <span>직접 만져보는 실시간 체험존</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            로그인하기 전에<br className="sm:hidden" />
            <span className="text-blue-600"> 3초 만에 미리 만들어보세요</span>
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
            이름과 직업을 선택하면 실시간으로 당신만의 프로필 링크가 완성됩니다.
          </p>
        </div>

        {/* 2열 레이아웃: 왼쪽 컨트롤러 / 오른쪽 실시간 프리뷰 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* 컨트롤러 (왼쪽 6열) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Palette size={16} />
              </div>
              <h3 className="text-[17px] font-bold text-slate-900">
                나만의 프로필 설정
              </h3>
            </div>

            {/* 1. 닉네임 입력 */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-slate-700 mb-2">
                1. 표시할 이름 또는 닉네임
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 윤서, 디자이너 민, 카페 온"
                  maxLength={15}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
                <span className="absolute right-3.5 top-3 text-[12px] text-slate-400">
                  {name.length}/15
                </span>
              </div>
            </div>

            {/* 2. 직군 프리셋 선택 */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-slate-700 mb-2">
                2. 나와 가장 어울리는 카테고리
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 shadow-xs"
                          : "border-slate-200/90 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xl">{preset.icon}</span>
                      <div className="min-w-0">
                        <p className={`text-[13px] font-bold ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
                          {preset.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. 테마 컬러 선택 */}
            <div className="mb-8">
              <label className="block text-[13px] font-bold text-slate-700 mb-2">
                3. 포인트 컬러
              </label>
              <div className="flex items-center gap-3">
                {COLOR_PRESETS.map((col) => {
                  const isSelected = selectedColor === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(col.id)}
                      className={`h-9 px-3 rounded-xl flex items-center gap-2 border text-[12px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? `${col.border} bg-slate-50 font-bold text-slate-900 ring-2 ring-blue-100`
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${col.bg}`} />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 시작 버튼 */}
            <button
              type="button"
              onClick={onStartWithGoogle}
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>이 프로필 그대로 3초 만에 시작하기</span>
              <ArrowRight size={16} />
            </button>
            <p className="text-center text-[12px] text-slate-400 mt-2.5">
              별도 가입 없이 Google 계정으로 즉시 무료 시작
            </p>
          </div>

          {/* 실시간 프리뷰 카드 (오른쪽 6열) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* 가상 주소 바 */}
            <div className="w-full max-w-[360px] bg-slate-900 text-white rounded-2xl px-4 py-2.5 mb-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon size={14} className="text-blue-400 shrink-0" />
                <span className="text-[12px] font-mono text-slate-300 truncate">
                  mylink.site/@{usernameSlug}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>주소 복사</span>
                  </>
                )}
              </button>
            </div>

            {/* 프리뷰 카드 본체 */}
            <div className="w-full max-w-[360px] bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl relative overflow-hidden transition-all">
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${activeColorObj.bg}`} />

              <div className="flex flex-col items-center text-center mt-2 mb-6">
                <div className="relative mb-3">
                  <div className={`w-18 h-18 rounded-full p-0.5 ${activeColorObj.bg} shadow-md`}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl select-none">
                      {activePreset.icon}
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                    <CheckCircle2 size={16} className={activeColorObj.text} />
                  </span>
                </div>

                <h4 className="text-[19px] font-extrabold text-slate-900 mb-0.5">
                  {name || "사용자"}
                </h4>
                <p className="text-[12px] font-medium text-slate-400 mb-2">
                  @{usernameSlug}
                </p>
                <p className="text-[12px] text-slate-600 leading-relaxed px-2 break-keep">
                  {activePreset.defaultBio}
                </p>
              </div>

              {/* 실시간 조합된 링크들 */}
              <div className="flex flex-col gap-2.5">
                {activePreset.links.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300/80 transition-all flex items-center gap-3 cursor-default group"
                  >
                    <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                      {link.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-bold text-slate-800 truncate">
                          {link.title}
                        </p>
                        {link.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeColorObj.bg} text-white`}>
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {link.subtitle}
                      </p>
                    </div>
                    <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                ))}
              </div>

              {/* 하단 브랜드 워터마크 */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <span className="text-[11px] font-bold text-slate-400">
                  ⚡️ Powered by MyLink
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
