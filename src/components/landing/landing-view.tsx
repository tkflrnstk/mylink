"use client";

import React from "react";
import { 
  Sparkles, 
  ChevronRight, 
  Star, 
  Zap, 
  ArrowRight
} from "lucide-react";
import { InteractivePhoneMockup } from "./phone-mockup";
import { InteractiveSimulator } from "./simulator";
import { FeaturesBento } from "./features-bento";
import { UseCases } from "./use-cases";
import { FaqSection } from "./faq-section";

interface LandingViewProps {
  onSignInWithGoogle: () => void;
}

export function LandingView({ onSignInWithGoogle }: LandingViewProps) {
  const scrollToSimulator = () => {
    const el = document.getElementById("simulator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col bg-white overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* ────────────────────────────────────────────────────────
          1. HERO SECTION (히어로 섹션)
          ──────────────────────────────────────────────────────── */}
      <section className="relative w-full pt-8 sm:pt-16 pb-16 sm:pb-24 overflow-hidden">
        {/* 부드러운 배경 앰비언트 글로우 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-100/60 via-purple-50/40 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
        <div className="absolute top-40 right-[-100px] w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* 왼쪽 카피 & CTA (7열) */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* 상단 뱃지 */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[13px] font-semibold mb-6 border border-blue-200/60 shadow-2xs hover:bg-blue-100/70 transition-colors">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                <span>나만의 감성 프로필 링크 서비스 · MyLink</span>
                <ChevronRight size={13} className="text-blue-500" />
              </div>

              {/* 메인 타이틀 */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.18] mb-6 break-keep">
                흩어져 있던 나의 모든 세상,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                  단 하나의 링크
                </span>
                로 모아보세요
              </h1>

              {/* 서브 카피 */}
              <p className="text-[15px] sm:text-[18px] text-slate-600 leading-relaxed mb-8 max-w-xl break-keep">
                인스타그램, 유튜브, 블로그, 포트폴리오까지.<br className="hidden sm:inline" />
                클릭 몇 번으로 프로필을 완성하고, 실시간 방문자 통계로 반응을 확인하세요.
              </p>

              {/* CTA 버튼 그룹 */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-8">
                <button
                  type="button"
                  onClick={onSignInWithGoogle}
                  className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                             text-white font-bold text-[16px] flex items-center justify-center gap-3
                             shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-150 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shadow-xs shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <span>Google로 3초 만에 시작하기</span>
                </button>

                <button
                  type="button"
                  onClick={scrollToSimulator}
                  className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98]
                             text-slate-700 font-semibold text-[15px] flex items-center justify-center gap-2
                             transition-all cursor-pointer"
                >
                  <Sparkles size={16} className="text-blue-600" />
                  <span>미리 체험해보기</span>
                </button>
              </div>

              {/* 신뢰 지표 & 소셜 프루프 */}
              <div className="flex items-center gap-3 pt-2 text-slate-500 text-[13px]">
                <div className="flex -space-x-1.5">
                  <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                    윤
                  </div>
                  <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                    민
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                    서
                  </div>
                  <div className="w-7 h-7 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                    진
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-700 ml-1">4.9점</span>
                  <span className="text-slate-400">· 크리에이터 및 개발자 추천</span>
                </div>
              </div>

            </div>

            {/* 오른쪽 인터랙티브 스마트폰 목업 (5열) */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractivePhoneMockup />
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          2. STATS BAR (핵심 수치 통계 바)
          ──────────────────────────────────────────────────────── */}
      <section className="w-full border-y border-slate-100 bg-slate-50/50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                3초
              </span>
              <span className="text-[13px] text-slate-500 font-medium mt-1">
                원클릭 간편 시작
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
                150,000+
              </span>
              <span className="text-[13px] text-slate-500 font-medium mt-1">
                누적 링크 클릭 연결
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                실시간
              </span>
              <span className="text-[13px] text-slate-500 font-medium mt-1">
                방문자 및 클릭수 집계
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                100%
              </span>
              <span className="text-[13px] text-slate-500 font-medium mt-1">
                평생 무료 기본 제공
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          3. INTERACTIVE SIMULATOR (3초 만에 내 링크 시뮬레이터)
          ──────────────────────────────────────────────────────── */}
      <InteractiveSimulator onStartWithGoogle={onSignInWithGoogle} />

      {/* ────────────────────────────────────────────────────────
          4. BENTO GRID FEATURES (핵심 기능 그리드)
          ──────────────────────────────────────────────────────── */}
      <FeaturesBento />

      {/* ────────────────────────────────────────────────────────
          5. USE CASES (누가 마이링크를 쓰나요?)
          ──────────────────────────────────────────────────────── */}
      <UseCases />

      {/* ────────────────────────────────────────────────────────
          6. FAQ (자주 묻는 질문 아코디언)
          ──────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ────────────────────────────────────────────────────────
          7. BOTTOM CTA SECTION (하단 강력한 전환 배너)
          ──────────────────────────────────────────────────────── */}
      <section className="w-full py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* 네온 배경 장식 */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[12px] font-semibold mb-6 border border-blue-400/30">
            <Zap size={13} />
            <span>지금 바로 무료로 시작해보세요</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            나를 표현하는 가장 간단한 링크,<br />
            지금 3초 만에 만들어보세요
          </h2>

          <p className="text-[15px] sm:text-[17px] text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            복잡한 절차 없이 Google 계정으로 즉시 로그인하고,<br className="hidden sm:inline" />
            세상에 단 하나뿐인 나만의 프로필 페이지를 공개하세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onSignInWithGoogle}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-[16px] flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shadow-xs shrink-0">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <span>Google 계정으로 3초 만에 시작하기</span>
            </button>
          </div>

          <p className="mt-4 text-[12px] text-slate-400">
            신용카드 등록 없음 · 완전 무료 제공 · 언제든 탈퇴 가능
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          8. MODERN FOOTER (모던 푸터)
          ──────────────────────────────────────────────────────── */}
      <footer className="w-full bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                M
              </div>
              <span className="text-[16px] font-bold text-white tracking-tight">
                마이링크 (MyLink)
              </span>
            </div>
            <p className="text-[12px] text-slate-500">
              나를 표현하는 가장 간단하고 아름다운 프로필 링크
            </p>
          </div>

          <div className="flex items-center gap-6 text-[13px]">
            <span className="hover:text-white transition-colors cursor-pointer">
              이용약관
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              개인정보처리방침
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              고객지원
            </span>
          </div>

          <p className="text-[12px] text-slate-500">
            © 2026 MyLink. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
