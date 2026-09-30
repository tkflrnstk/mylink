"use client";

import React from "react";

export default function Home() {
  const links = [
    {
      title: "GitHub 코드 저장소",
      subtitle: "@tkflrnstk",
      description: "개발 프로젝트와 오픈소스 코드 모음",
      url: "https://github.com/tkflrnstk",
      emoji: "🐙",
      badge: "코드",
      badgeBg: "bg-[#e60012] text-white",
    },
    {
      title: "기술 & 항해 블로그",
      subtitle: "blog.nolink.dev",
      description: "공부 기록과 바이브 코딩, 항해 이야기",
      url: "#",
      emoji: "📝",
      badge: "기록",
      badgeBg: "bg-[#3d4f97] text-white",
    },
    {
      title: "이메일 연락하기",
      subtitle: "contact@example.com",
      description: "프로젝트 제안 및 방명록 문의",
      url: "mailto:contact@example.com",
      emoji: "✉️",
      badge: "문의",
      badgeBg: "bg-[#206479] text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-4 sm:p-8 flex flex-col items-center justify-center select-none overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          MYLINK MAIN CHASSIS (깔끔한 레트로 콘솔 메탈 섀시, Max 460px)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[460px] flex flex-col gap-3">

        {/* 1. 상단 마스트헤드 (알약 로고 & 환영 뱃지) */}
        <div className="flex items-center justify-between gap-2 px-1">
          {/* 닌텐도 스타일 알약 브랜드 뱃지 */}
          <div className="bg-white rounded-full px-3 py-1 border-2 border-[#e60012] flex items-center shadow-xs shrink-0">
            <span className="text-[#e60012] font-black italic tracking-tighter text-sm">
              MyLink
            </span>
            <span className="text-[10px] font-bold text-[#21242e] ml-1 uppercase">
              .kr
            </span>
          </div>

          {/* 환영 라벨 뱃지 */}
          <div className="bg-[#8ba1d4] border border-[#3d4f97] px-2.5 py-1 rounded-xs text-[11px] font-bold text-[#21242e] flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>온라인 (접속 중)</span>
          </div>
        </div>

        {/* 2. 상단 카본 커맨드 탭 바 (100% 한국어) */}
        <div className="carbon-halftone border-2 border-[#21242e] px-3 py-2 flex items-center justify-between shadow-sm rounded-xs">
          <div className="flex items-center gap-4 text-xs font-bold text-[#e48600]">
            <span className="text-[#e48600] font-black border-b-2 border-[#e48600]">프로필</span>
            <span className="text-white/70 hover:text-white transition-colors cursor-pointer">링크 모음</span>
            <span className="text-white/70 hover:text-white transition-colors cursor-pointer">소개</span>
          </div>
          <div className="bevel-button-amber px-2 py-0.5 text-[10px] font-bold text-[#21242e]">
            ver 2026
          </div>
        </div>

        {/* 3. 중앙 프로필 히어로 카드 (닌텐도 입체 메탈 플레이트) */}
        <div className="bevel-plate bg-[#8ba1d4] p-5 sm:p-6 rounded-xs flex flex-col items-center text-center shadow-md relative border-2 border-[#3d4f97]">
          
          {/* 프로필 아바타 */}
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-[#206479] border-3 border-[#21242e] rounded-2xl flex items-center justify-center shadow-md group hover:scale-105 transition-transform">
              <span className="text-3xl font-black text-white">
                노
              </span>
            </div>
            {/* 항해사 닻 뱃지 */}
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#ecab37] border-2 border-[#21242e] w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-sm">
              ⚓
            </div>
          </div>

          {/* 이름 */}
          <h1 className="text-2xl font-black text-[#21242e] tracking-tight mb-2">
            노기훈
          </h1>

          {/* 뱃지 모음 */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
            <span className="bg-white border border-[#21242e] px-2.5 py-0.5 text-xs font-bold text-[#21242e] shadow-xs">
              ⚓ 정부 항해사
            </span>
            <span className="bg-[#3d4f97] border border-[#21242e] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
              💻 개발자
            </span>
            <span className="bg-[#ecab37] border border-[#21242e] px-2.5 py-0.5 text-xs font-bold text-[#21242e] shadow-xs">
              ✨ 바이브 코딩
            </span>
          </div>

          {/* 한국어 소개글 (깔끔한 인셋 플레이트) */}
          <div className="w-full bevel-inset bg-[#dedede] p-3 rounded-xs text-xs font-bold text-[#21242e] leading-relaxed text-left">
            <p>
              🌊 바다 위에서는 안전한 항로를 이끄는 <span className="text-[#e60012]">정부 항해사</span>이자,
              코드 위에서는 바이브 코딩으로 새로운 가능성을 개척하는 <span className="text-[#3d4f97]">개발자</span> 노기훈입니다.
            </p>
          </div>
        </div>

        {/* 4. 주요 링크 목록 (닌텐도 입체 버튼 카드) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-[#21242e] uppercase tracking-wider flex items-center gap-1">
              <span className="text-[#e60012]">●</span> 링크 바로가기
            </span>
            <span className="text-[10px] font-bold text-[#3d4f97]">
              클릭 시 이동 ➔
            </span>
          </div>

          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bevel-plate-raised bg-[#8ba1d4] p-3 rounded-xs flex items-center justify-between gap-3 hover:bg-white transition-colors group cursor-pointer border-2 border-[#3d4f97] shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* 이모지 아이콘 박스 */}
                <div className="w-10 h-10 bg-[#dedede] border-2 border-[#21242e] rounded-xs flex items-center justify-center text-xl shrink-0 group-hover:bg-[#ecab37] transition-colors">
                  {link.emoji}
                </div>
                {/* 텍스트 설명 */}
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#21242e] group-hover:text-[#e60012] transition-colors truncate">
                      {link.title}
                    </span>
                    <span className={`${link.badgeBg} text-[9px] font-bold px-1.5 py-0.2 rounded-xs shrink-0`}>
                      {link.badge}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#60619c] truncate mt-0.5">
                    {link.description}
                  </div>
                </div>
              </div>

              {/* 오른쪽 주황색 전진 버튼 */}
              <div className="w-6 h-6 bevel-button-orange rounded-xs flex items-center justify-center text-[10px] font-black shrink-0 group-hover:scale-110 transition-transform">
                ▶
              </div>
            </a>
          ))}
        </div>

        {/* 5. 하단 카본 푸터 */}
        <div className="carbon-halftone border-2 border-[#21242e] p-3 rounded-xs text-white flex items-center justify-between text-[10px] font-bold shadow-sm mt-2">
          <div className="text-[#9fbee7]">
            © 2026 노기훈 · 마이링크 (MyLink)
          </div>
          <div className="bevel-button-amber px-2 py-0.5 text-[9px] text-[#21242e]">
            한국어 버전
          </div>
        </div>

      </div>

    </div>
  );
}
