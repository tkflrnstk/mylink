"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  Check, 
  MousePointerClick,
  ExternalLink
} from "lucide-react";

// 소셜 아이콘 인라인 SVG
function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function YoutubeIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15"/>
    </svg>
  );
}

function GithubIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

type ThemeKey = "blue" | "purple" | "dark" | "sunset";

interface ThemeConfig {
  id: ThemeKey;
  name: string;
  dotColor: string;
  bgClass: string;
  cardBgClass: string;
  textColor: string;
  subTextColor: string;
  buttonClass: string;
  badgeClass: string;
  accentColor: string;
}

const THEMES: Record<ThemeKey, ThemeConfig> = {
  blue: {
    id: "blue",
    name: "토스 블루",
    dotColor: "bg-blue-500",
    bgClass: "bg-gradient-to-b from-blue-50/70 via-white to-blue-50/40",
    cardBgClass: "bg-white",
    textColor: "text-slate-900",
    subTextColor: "text-slate-500",
    buttonClass: "bg-white hover:bg-blue-50/60 border-slate-200/80 shadow-xs text-slate-800",
    badgeClass: "bg-blue-100 text-blue-700",
    accentColor: "#3182F6",
  },
  purple: {
    id: "purple",
    name: "네온 퍼플",
    dotColor: "bg-purple-500",
    bgClass: "bg-gradient-to-b from-purple-50/80 via-white to-indigo-50/50",
    cardBgClass: "bg-white",
    textColor: "text-slate-900",
    subTextColor: "text-purple-600/70",
    buttonClass: "bg-white hover:bg-purple-50/70 border-purple-100 shadow-xs text-slate-800",
    badgeClass: "bg-purple-100 text-purple-700",
    accentColor: "#8b5cf6",
  },
  dark: {
    id: "dark",
    name: "미드나잇 다크",
    dotColor: "bg-slate-900",
    bgClass: "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950",
    cardBgClass: "bg-slate-800/90",
    textColor: "text-white",
    subTextColor: "text-slate-400",
    buttonClass: "bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 shadow-xs text-white",
    badgeClass: "bg-slate-700 text-cyan-300",
    accentColor: "#06b6d4",
  },
  sunset: {
    id: "sunset",
    name: "선셋 코랄",
    dotColor: "bg-orange-500",
    bgClass: "bg-gradient-to-b from-orange-50/80 via-white to-rose-50/50",
    cardBgClass: "bg-white",
    textColor: "text-slate-900",
    subTextColor: "text-orange-600/70",
    buttonClass: "bg-white hover:bg-orange-50/60 border-orange-100 shadow-xs text-slate-800",
    badgeClass: "bg-orange-100 text-orange-700",
    accentColor: "#f97316",
  },
};

interface DemoLink {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  badgeColor?: string;
  clicks: number;
}

export function InteractivePhoneMockup() {
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("blue");
  const [clickAlert, setClickAlert] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [links, setLinks] = useState<DemoLink[]>([
    {
      id: "1",
      title: "인스타그램",
      subtitle: "최신 일상과 디자인 영감 피드",
      icon: InstagramIcon,
      badge: "인기",
      badgeColor: "bg-rose-500 text-white",
      clicks: 842,
    },
    {
      id: "2",
      title: "유튜브 채널",
      subtitle: "매주 업로드되는 브이로그 & IT 리뷰",
      icon: YoutubeIcon,
      badge: "HOT",
      badgeColor: "bg-red-500 text-white",
      clicks: 1240,
    },
    {
      id: "3",
      title: "깃허브 (GitHub)",
      subtitle: "오픈소스 프로젝트 & 개발 로그",
      icon: GithubIcon,
      badge: "NEW",
      badgeColor: "bg-emerald-500 text-white",
      clicks: 531,
    },
    {
      id: "4",
      title: "2026 포트폴리오 웹사이트",
      subtitle: "UI/UX 프로젝트 및 인터랙티브 웹",
      icon: Globe,
      clicks: 915,
    },
  ]);

  const currentTheme = THEMES[activeTheme];

  const handleLinkClick = (id: string, title: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, clicks: l.clicks + 1 } : l))
    );
    setClickAlert(`🎉 '${title}' 클릭! 실시간 통계 +1`);
    setTimeout(() => {
      setClickAlert(null);
    }, 2000);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[420px] mx-auto select-none">
      {/* 배경 블러 네온 효과 */}
      <div className="absolute -top-6 -left-6 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* 상단 테마 변경 스위처 바 */}
      <div className="mb-4 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 shadow-sm flex items-center justify-between gap-1">
        <span className="text-[12px] font-semibold text-slate-500 flex items-center gap-1.5 pl-2">
          <Sparkles size={14} className="text-blue-500" />
          <span>테마 변경</span>
        </span>
        <div className="flex items-center gap-1">
          {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
            const item = THEMES[key];
            const isSelected = activeTheme === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTheme(key)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                <span>{item.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 플로팅 배지 1: 실시간 방문자 */}
      <div className="hidden sm:flex absolute -left-12 top-24 z-20 items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl py-2 px-3 shadow-lg hover:scale-105 transition-transform animate-bounce [animation-duration:3.5s]">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <TrendingUp size={16} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">실시간 통계</p>
          <p className="text-[12px] font-bold text-slate-800">방문자 +1,420명</p>
        </div>
      </div>

      {/* 플로팅 배지 2: 클릭 전환율 */}
      <div className="hidden sm:flex absolute -right-10 bottom-28 z-20 items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl py-2 px-3 shadow-lg hover:scale-105 transition-transform animate-bounce [animation-duration:4s]">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <MousePointerClick size={16} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">클릭 전환율</p>
          <p className="text-[12px] font-bold text-slate-800">48.6% 상승 🚀</p>
        </div>
      </div>

      {/* 스마트폰 본체 프레임 */}
      <div className="relative mx-auto w-full max-w-[340px] rounded-[48px] p-3.5 bg-slate-900 ring-1 ring-slate-800/80 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] transition-all">
        {/* 카메라 다이나믹 아일랜드 */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-24 h-5 bg-slate-950 rounded-full flex items-center justify-end pr-2 gap-1.5 shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800/60" />
        </div>

        {/* 폰 스크린 내부 */}
        <div
          className={`relative rounded-[38px] overflow-hidden ${currentTheme.bgClass} transition-colors duration-300 min-h-[580px] flex flex-col pt-12 pb-6 px-4 shadow-inner`}
        >
          {/* 클릭 알림 토스트 */}
          {clickAlert && (
            <div className="absolute top-14 left-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-semibold py-2 px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <Sparkles size={12} className="text-amber-400" />
              <span>{clickAlert}</span>
            </div>
          )}

          {/* 폰 상단 헤더 & 공유 버튼 */}
          <div className="flex items-center justify-between mb-5 px-1">
            <span className="text-[10px] font-mono tracking-wider opacity-60 font-semibold uppercase">
              mylink.site
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-semibold">복사됨</span>
                </>
              ) : (
                <>
                  <Share2 size={11} className={currentTheme.subTextColor} />
                  <span className={`text-[10px] font-medium ${currentTheme.subTextColor}`}>
                    공유
                  </span>
                </>
              )}
            </button>
          </div>

          {/* 프로필 영역 */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3 group">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <span className="text-3xl select-none">✨</span>
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>

            <h3 className={`text-[17px] font-bold tracking-tight mb-0.5 ${currentTheme.textColor}`}>
              민수 (Minsu)
            </h3>
            <p className={`text-[12px] font-medium mb-2 ${currentTheme.subTextColor}`}>
              @minsu_universe
            </p>
            <p
              className={`text-[11px] leading-relaxed max-w-[240px] px-2 ${
                activeTheme === "dark" ? "text-slate-300" : "text-slate-600"
              }`}
            >
              디자인과 코딩으로 새로운 경험을 만듭니다. 관심 있는 링크를 둘러보세요! 👇
            </p>
          </div>

          {/* 링크 목록 (인터랙티브 버튼) */}
          <div className="flex-1 flex flex-col gap-2.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleLinkClick(link.id, link.title)}
                  className={`w-full p-3 rounded-2xl border transition-all duration-150 flex items-center gap-3 text-left group cursor-pointer active:scale-[0.98] ${currentTheme.buttonClass}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon size={18} className="text-slate-700 dark:text-slate-200" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold truncate">
                        {link.title}
                      </span>
                      {link.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                            link.badgeColor || currentTheme.badgeClass
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[10px] truncate ${
                        activeTheme === "dark" ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {link.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <ExternalLink size={12} className="opacity-40 group-hover:opacity-90 transition-opacity" />
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {link.clicks}회
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 폰 하단 안내 문구 */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-400">
              💡 링크를 클릭해보면 실시간 클릭 수가 올라가요!
            </p>
          </div>

          {/* 폰 하단 홈 바 */}
          <div className="w-28 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-3" />
        </div>
      </div>
    </div>
  );
}
