"use client";

import React, { useState, useEffect } from "react";

interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  emoji: string;
  badge: string;
  badgeBg: string;
}

interface ProfileData {
  name: string;
  badge: string;
  bio: string;
  theme: "nintendo" | "ocean" | "neobrutal";
  links: LinkItem[];
}

const DEFAULT_PROFILE: ProfileData = {
  name: "노기훈",
  badge: "⚓ 정부 항해사 & 💻 개발자",
  bio: "🌊 바다 위에서는 안전한 항로를 이끄는 정부 항해사, 코드 위에서는 바이브 코딩으로 새로운 가능성을 개척하는 개발자 노기훈입니다.",
  theme: "nintendo",
  links: [
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
  ],
};

const LOCAL_STORAGE_KEY = "mylink_demo_profile_v1";

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 임시 편집 폼 상태
  const [editName, setEditName] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editTheme, setEditTheme] = useState<"nintendo" | "ocean" | "neobrutal">("nintendo");

  // 1. 마운트 시 LocalStorage에서 읽어오기
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      }
    } catch (e) {
      console.error("LocalStorage load error:", e);
    }
  }, []);

  // 2. 편집 모달 열기
  const handleOpenEdit = () => {
    setEditName(profile.name);
    setEditBadge(profile.badge);
    setEditBio(profile.bio);
    setEditTheme(profile.theme);
    setIsEditOpen(true);
  };

  // 3. LocalStorage에 저장하기
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProfileData = {
      ...profile,
      name: editName,
      badge: editBadge,
      bio: editBio,
      theme: editTheme,
    };
    setProfile(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("LocalStorage save error:", err);
    }
    setIsEditOpen(false);
  };

  // 4. LocalStorage 데이터 초기화 (초기 상태 복원)
  const handleResetData = () => {
    if (confirm("프로필 데이터를 기본값으로 초기화하시겠습니까?")) {
      setProfile(DEFAULT_PROFILE);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      setIsEditOpen(false);
    }
  };

  if (!isMounted) return null; // Hydration 방지

  // 테마별 스타일 분기
  const isNintendo = profile.theme === "nintendo";
  const isOcean = profile.theme === "ocean";
  const isNeobrutal = profile.theme === "neobrutal";

  return (
    <div
      className={`min-h-screen font-sans p-4 sm:p-8 flex flex-col items-center justify-center select-none overflow-x-hidden transition-colors duration-300 ${
        isNintendo
          ? "bg-[#7a8aba] text-[#21242e]"
          : isOcean
          ? "bg-[#0a1f3d] text-white"
          : "bg-[#E0F2FE] text-slate-900"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          시연 제어용 상단 플로팅 배너 (LocalStorage 시연 버튼)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[460px] mb-3 flex items-center justify-between bg-black/80 text-white p-2.5 rounded-lg shadow-lg border border-white/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">💾 LocalStorage 연동 시연 중</span>
        </div>
        <button
          onClick={handleOpenEdit}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-3 py-1 rounded shadow-xs cursor-pointer transition-transform hover:scale-105"
        >
          ⚡ 프로필 편집
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CHASSIS / CONTAINER
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[460px] flex flex-col gap-3">
        
        {/* 상단 헤더 / 브랜드 알약 뱃지 */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="bg-white rounded-full px-3 py-1 border-2 border-[#e60012] flex items-center shadow-xs shrink-0">
            <span className="text-[#e60012] font-black italic tracking-tighter text-sm">
              MyLink
            </span>
            <span className="text-[10px] font-bold text-[#21242e] ml-1 uppercase">
              .kr
            </span>
          </div>
          <div className="text-[11px] font-bold opacity-80">
            테마: <span className="uppercase font-black text-yellow-300">{profile.theme}</span>
          </div>
        </div>

        {/* 닌텐도 커맨드 슬래브 탭 바 */}
        <div className="carbon-halftone border-2 border-[#21242e] px-3 py-2 flex items-center justify-between shadow-sm rounded-xs">
          <div className="flex items-center gap-4 text-xs font-bold text-[#e48600]">
            <span className="text-[#e48600] font-black border-b-2 border-[#e48600]">프로필</span>
            <span className="text-white/70">링크 ({profile.links.length})</span>
          </div>
          <div className="bevel-button-amber px-2 py-0.5 text-[10px] font-bold text-[#21242e]">
            로컬 저장됨
          </div>
        </div>

        {/* 메인 프로필 카드 (닌텐도 입체 메탈 / 오션 / 네오브루탈) */}
        <div
          className={`p-5 sm:p-6 rounded-xs flex flex-col items-center text-center shadow-md relative border-2 ${
            isNintendo
              ? "bevel-plate bg-[#8ba1d4] border-[#3d4f97]"
              : isOcean
              ? "bg-white/10 backdrop-blur-md border-white/20 text-white"
              : "bg-[#FDE047] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black"
          }`}
        >
          {/* 아바타 */}
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-[#206479] border-3 border-[#21242e] rounded-2xl flex items-center justify-center shadow-md group hover:scale-105 transition-transform">
              <span className="text-3xl font-black text-white">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#ecab37] border-2 border-[#21242e] w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-sm">
              ⚓
            </div>
          </div>

          {/* 이름 */}
          <h1 className="text-2xl font-black tracking-tight mb-2">
            {profile.name}
          </h1>

          {/* 뱃지 */}
          <div className="mb-4">
            <span className="bg-white border border-[#21242e] px-3 py-1 text-xs font-bold text-[#21242e] shadow-xs rounded-full">
              {profile.badge}
            </span>
          </div>

          {/* 소개글 */}
          <div
            className={`w-full p-3 rounded-xs text-xs font-bold leading-relaxed text-left ${
              isNintendo
                ? "bevel-inset bg-[#dedede] text-[#21242e]"
                : isOcean
                ? "bg-white/10 border border-white/10 text-blue-100"
                : "bg-white border-2 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <p>{profile.bio}</p>
          </div>
        </div>

        {/* 링크 바로가기 리스트 */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <span className="text-[#e60012]">●</span> 링크 바로가기 ({profile.links.length})
            </span>
            <span className="text-[10px] font-bold opacity-75">
              클릭 시 이동 ➔
            </span>
          </div>

          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`p-3 rounded-xs flex items-center justify-between gap-3 transition-colors group cursor-pointer border-2 shadow-sm ${
                isNintendo
                  ? "bevel-plate-raised bg-[#8ba1d4] border-[#3d4f97] hover:bg-white"
                  : isOcean
                  ? "bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white"
                  : "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FEF08A] text-black"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-[#dedede] border-2 border-[#21242e] rounded-xs flex items-center justify-center text-xl shrink-0 group-hover:bg-[#ecab37] transition-colors text-black">
                  {link.emoji}
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black group-hover:text-[#e60012] transition-colors truncate">
                      {link.title}
                    </span>
                    <span className={`${link.badgeBg} text-[9px] font-bold px-1.5 py-0.2 rounded-xs shrink-0`}>
                      {link.badge}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold opacity-70 truncate mt-0.5">
                    {link.description}
                  </div>
                </div>
              </div>

              <div className="w-6 h-6 bevel-button-orange rounded-xs flex items-center justify-center text-[10px] font-black shrink-0 group-hover:scale-110 transition-transform">
                ▶
              </div>
            </a>
          ))}
        </div>

        {/* 푸터 */}
        <div className="carbon-halftone border-2 border-[#21242e] p-3 rounded-xs text-white flex items-center justify-between text-[10px] font-bold shadow-sm mt-2">
          <div className="text-[#9fbee7]">
            © 2026 {profile.name} · 마이링크 (LocalStorage Demo)
          </div>
          <div className="bevel-button-amber px-2 py-0.5 text-[9px] text-[#21242e]">
            로컬 전용
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          시연용 프로필 편집 팝업 모달 (LocalStorage 조작)
      ───────────────────────────────────────────────────────────── */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#8ba1d4] border-4 border-[#21242e] p-5 rounded-lg max-w-md w-full shadow-2xl text-[#21242e]">
            <div className="flex items-center justify-between border-b-2 border-[#21242e] pb-2 mb-4">
              <h2 className="text-base font-black flex items-center gap-1.5">
                <span>⚡ LocalStorage 데이터 실시간 편집</span>
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="bg-[#e60012] text-white font-black px-2 py-0.5 text-xs rounded border border-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3 text-xs font-bold">
              <div>
                <label className="block mb-1 text-[11px]">이름:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border-2 border-[#21242e] p-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-[11px]">뱃지 라벨:</label>
                <input
                  type="text"
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  className="w-full bg-white border-2 border-[#21242e] p-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-[11px]">소개글:</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-white border-2 border-[#21242e] p-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-[11px]">테마 선택:</label>
                <select
                  value={editTheme}
                  onChange={(e) => setEditTheme(e.target.value as any)}
                  className="w-full bg-white border-2 border-[#21242e] p-2 text-xs focus:outline-none font-bold"
                >
                  <option value="nintendo">🎮 닌텐도 레트로 메탈 테마</option>
                  <option value="ocean">🌊 오션 블루 글라스 테마</option>
                  <option value="neobrutal">⚡ 네오브루탈리즘 팝 테마</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#3d4f97]">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="bg-zinc-300 hover:bg-zinc-400 text-black px-3 py-1.5 rounded border border-black text-xs font-bold cursor-pointer"
                >
                  초기화
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="bg-white text-black px-3 py-1.5 rounded border border-black text-xs font-bold cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bevel-button-orange px-4 py-1.5 text-xs font-black uppercase cursor-pointer"
                  >
                    LocalStorage에 저장 💾
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
