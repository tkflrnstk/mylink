"use client";

import React, { useState } from "react";
import { 
  Zap, 
  BarChart3, 
  Share2, 
  Check, 
  TrendingUp, 
  Tag, 
  Edit3 
} from "lucide-react";

export function FeaturesBento() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeInlineText, setActiveInlineText] = useState("매주 일요일 저녁 8시 라이브 방송! 🎥");
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 섹션 헤더 */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[13px] font-semibold mb-4 border border-blue-100">
            <Zap size={14} className="text-blue-500" />
            <span>압도적인 편리함</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            복잡한 설정 없이,<br className="sm:hidden" />
            <span className="text-blue-600"> 필요한 모든 것을 한곳에</span>
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
            마이링크가 제공하는 세심한 기능들로 가장 매력적인 프로필을 꾸며보세요.
          </p>
        </div>

        {/* Bento Grid 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Card 1: 인라인 실시간 편집 (7열) */}
          <div className="md:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Edit3 size={20} />
              </div>
              <h3 className="text-[19px] sm:text-[21px] font-bold text-slate-900 mb-2">
                모달 없이 클릭 한 번으로 끝나는 즉시 편집
              </h3>
              <p className="text-[14px] text-slate-600 leading-relaxed max-w-md">
                답답한 설정 모달을 띄울 필요가 없습니다. 이름, 아이디, 소개글을 클릭하고 타이핑 후 Enter만 누르면 그 자리에서 즉시 저장됩니다.
              </p>
            </div>

            {/* 인터랙티브 인라인 데모 박스 */}
            <div className="mt-8 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  실시간 인라인 편집 체험
                </span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                  Enter 누르면 즉시 저장
                </span>
              </div>

              <div className="relative">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={activeInlineText}
                      onChange={(e) => setActiveInlineText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setIsEditing(false);
                      }}
                      onBlur={() => setIsEditing(false)}
                      autoFocus
                      className="w-full h-10 px-3 rounded-xl border-2 border-blue-500 text-[13px] font-semibold text-slate-900 focus:outline-none bg-blue-50/30"
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="h-10 px-3.5 bg-blue-600 text-white rounded-xl text-[12px] font-bold shrink-0 cursor-pointer"
                    >
                      저장
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditing(true)}
                    className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex items-center justify-between cursor-pointer group/box"
                  >
                    <span className="text-[13px] font-semibold text-slate-800">
                      {activeInlineText}
                    </span>
                    <span className="text-[11px] text-blue-500 font-medium opacity-80 group-hover/box:opacity-100 flex items-center gap-1 shrink-0">
                      <Edit3 size={12} />
                      클릭하여 수정
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: 실시간 클릭 & 방문자 통계 (5열) */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-blue-400 flex items-center justify-center mb-5 border border-slate-700">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-[19px] sm:text-[21px] font-bold text-white mb-2">
                어떤 링크가 인기 있는지 실시간 통계 분석
              </h3>
              <p className="text-[14px] text-slate-400 leading-relaxed">
                클릭 수와 방문자 추이를 실시간으로 추적하여 반응이 가장 뜨거운 콘텐츠를 바로 파악할 수 있습니다.
              </p>
            </div>

            {/* 미니 차트 그래픽 */}
            <div className="mt-8 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-slate-400 font-medium">이번 주 누적 클릭</span>
                <span className="text-[12px] font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={13} /> +34.2%
                </span>
              </div>
              <div className="flex items-end gap-2 h-20 pt-2 px-1">
                {[35, 60, 45, 80, 65, 95, 120].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div
                      style={{ height: `${(h / 120) * 100}%` }}
                      className={`w-full rounded-t-md transition-all group-hover:brightness-125 ${
                        i === 6 ? "bg-gradient-to-t from-blue-500 to-cyan-400" : "bg-slate-600"
                      }`}
                    />
                    <span className="text-[9px] text-slate-500 font-mono">
                      {["월", "화", "수", "목", "금", "토", "일"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: 뱃지와 이모지 커스텀 (5열) */}
          <div className="md:col-span-5 bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
                <Tag size={20} />
              </div>
              <h3 className="text-[19px] sm:text-[21px] font-bold text-slate-900 mb-2">
                시선을 사로잡는 뱃지와 감성 이모지
              </h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                강조하고 싶은 링크에 HOT, NEW, 할인 등 맞춤 뱃지를 달고 대표 이모지로 개성을 더해보세요.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1.5 rounded-full bg-rose-500 text-white text-[12px] font-bold shadow-xs flex items-center gap-1">
                <span>🔥</span> HOT
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[12px] font-bold shadow-xs flex items-center gap-1">
                <span>✨</span> NEW
              </span>
              <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-[12px] font-bold shadow-xs flex items-center gap-1">
                <span>⭐️</span> 추천
              </span>
              <span className="px-3 py-1.5 rounded-full bg-purple-600 text-white text-[12px] font-bold shadow-xs flex items-center gap-1">
                <span>🎯</span> 필독
              </span>
              <span className="px-3 py-1.5 rounded-full bg-amber-500 text-white text-[12px] font-bold shadow-xs flex items-center gap-1">
                <span>⚡️</span> 마감임박
              </span>
            </div>
          </div>

          {/* Card 4: 나만의 고유 @URL & 초간편 공유 (7열) */}
          <div className="md:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Share2 size={20} />
              </div>
              <h3 className="text-[19px] sm:text-[21px] font-bold text-slate-900 mb-2">
                기억하기 쉬운 단 하나의 나만의 고유 링크
              </h3>
              <p className="text-[14px] text-slate-600 leading-relaxed max-w-md">
                인스타그램 프로필, 유튜브 소개란, 명함, 이메일 서명 어디든 쏙 들어가는 깔끔한 URL을 제공합니다.
              </p>
            </div>

            {/* URL 복사 바 */}
            <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 pl-2 min-w-0">
                <span className="text-[13px] sm:text-[14px] font-mono font-bold text-slate-800 truncate">
                  https://mylink.site/<span className="text-blue-600">@yourname</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`h-9 px-4 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  copiedUrl
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {copiedUrl ? (
                  <>
                    <Check size={13} />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Share2 size={13} />
                    <span>링크 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
