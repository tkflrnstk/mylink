"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ChevronRight,
  Anchor,
  Code2,
  Sparkles,
  Settings2,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  emoji: string;
  badge: string;
}

interface ProfileData {
  name: string;
  badge: string;
  bio: string;
  theme: "toss" | "nintendo" | "ocean";
  links: LinkItem[];
}

const DEFAULT_PROFILE: ProfileData = {
  name: "노기훈",
  badge: "정부 항해사 & 개발자",
  bio: "바다 위에서는 안전한 항로를 이끄는 정부 항해사, 코드 위에서는 바이브 코딩으로 새로운 가능성을 개척하는 개발자입니다.",
  theme: "toss",
  links: [
    {
      id: "1",
      title: "GitHub 코드 저장소",
      subtitle: "github.com/tkflrnstk",
      description: "개발 프로젝트와 오픈소스 코드 모음",
      url: "https://github.com/tkflrnstk",
      emoji: "🐙",
      badge: "GitHub",
    },
    {
      id: "2",
      title: "기술 & 항해 블로그",
      subtitle: "blog.nolink.dev",
      description: "공부 기록과 바이브 코딩, 항해 이야기",
      url: "#",
      emoji: "📝",
      badge: "Tech Blog",
    },
    {
      id: "3",
      title: "이메일 연락하기",
      subtitle: "contact@example.com",
      description: "프로젝트 제안 및 협업 문의",
      url: "mailto:contact@example.com",
      emoji: "✉️",
      badge: "Contact",
    },
  ],
};

const LOCAL_STORAGE_KEY = "mylink_toss_profile_v1";

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 편집 폼 상태
  const [editName, setEditName] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      }
    } catch (e) {
      console.error("LocalStorage load error:", e);
    }
  }, []);

  const handleOpenEdit = () => {
    setEditName(profile.name);
    setEditBadge(profile.badge);
    setEditBio(profile.bio);
    setIsEditOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProfileData = {
      ...profile,
      name: editName,
      badge: editBadge,
      bio: editBio,
    };
    setProfile(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("LocalStorage save error:", err);
    }
    setIsEditOpen(false);
  };

  const handleResetData = () => {
    if (confirm("프로필 데이터를 기본값으로 초기화하시겠습니까?")) {
      setProfile(DEFAULT_PROFILE);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      setIsEditOpen(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
      
      {/* ─────────────────────────────────────────────────────────────
          시연용 컨트롤러 상단 배너 (TDS 스타일)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[440px] mb-4 flex items-center justify-between bg-white border border-[#E5E8EB] px-4 py-2.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3182F6] animate-pulse" />
          <span className="font-semibold text-[#4E5968]">토스 디자인 시스템 (TDS)</span>
        </div>
        <button
          onClick={handleOpenEdit}
          className="flex items-center gap-1.5 bg-[#E8F3FF] hover:bg-[#D4E8FF] text-[#3182F6] font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>프로필 편집</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN PROFILE CONTAINER (Max 440px)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[440px] flex flex-col gap-3">
        
        {/* 프로필 카드 (TDS Card) */}
        <Card className="p-6 sm:p-7 rounded-3xl border border-[#E5E8EB] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
          
          {/* 아바타 */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3182F6] to-[#68A6FF] flex items-center justify-center text-white shadow-md">
              <span className="text-3xl font-bold select-none">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 bg-[#3182F6] border-2 border-white w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm">
              <Anchor className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 이름 & 공식 인증 마크 */}
          <div className="flex items-center gap-1.5 mb-2">
            <h1 className="text-2xl font-bold text-[#191F28] tracking-tight">
              {profile.name}
            </h1>
            <CheckCircle2 className="w-5 h-5 text-[#3182F6] fill-[#3182F6] stroke-white" />
          </div>

          {/* 뱃지 */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold rounded-full bg-[#E8F3FF] text-[#3182F6]">
              {profile.badge}
            </Badge>
          </div>

          {/* 소개글 */}
          <div className="w-full bg-[#F9FAFB] border border-[#E5E8EB] p-3.5 rounded-2xl text-sm text-[#4E5968] leading-relaxed">
            <p>{profile.bio}</p>
          </div>
        </Card>

        {/* 링크 목록 섹션 */}
        <div className="flex flex-col gap-2.5 mt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#8B95A1] uppercase tracking-wider">
              링크 바로가기 ({profile.links.length})
            </span>
          </div>

          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="toss-press group flex items-center justify-between p-4 bg-white border border-[#E5E8EB] hover:border-[#3182F6]/40 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* 이모지 아이콘 서클 */}
                <div className="w-11 h-11 rounded-2xl bg-[#F2F4F6] group-hover:bg-[#E8F3FF] flex items-center justify-center text-xl shrink-0 transition-colors">
                  {link.emoji}
                </div>
                {/* 텍스트 설명 */}
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-[#191F28] group-hover:text-[#3182F6] transition-colors truncate">
                      {link.title}
                    </span>
                  </div>
                  <div className="text-xs text-[#8B95A1] truncate mt-0.5">
                    {link.description}
                  </div>
                </div>
              </div>

              {/* 오른쪽 이동 셰브론 아이콘 */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#B0B8C1] group-hover:text-[#3182F6] group-hover:translate-x-0.5 transition-all shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
            </a>
          ))}
        </div>

        {/* 푸터 */}
        <div className="text-center py-6 text-xs text-[#8B95A1]">
          © 2026 {profile.name} · 마이링크 (Toss Design System)
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          시연용 프로필 편집 모달 (TDS 스타일)
      ───────────────────────────────────────────────────────────── */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E8EB] p-6 rounded-3xl max-w-sm w-full shadow-2xl text-[#191F28] animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E8EB] pb-3 mb-4">
              <h2 className="text-base font-bold text-[#191F28]">
                프로필 정보 수정
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-[#8B95A1] hover:text-[#191F28] p-1 rounded-full hover:bg-[#F2F4F6] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5 text-xs font-semibold">
              <div>
                <label className="block mb-1.5 text-[#4E5968]">이름</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E8EB] focus:border-[#3182F6] rounded-xl p-3 text-sm text-[#191F28] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[#4E5968]">직업 / 뱃지 라벨</label>
                <input
                  type="text"
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E8EB] focus:border-[#3182F6] rounded-xl p-3 text-sm text-[#191F28] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[#4E5968]">소개글</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#F9FAFB] border border-[#E5E8EB] focus:border-[#3182F6] rounded-xl p-3 text-sm text-[#191F28] focus:outline-none transition-colors leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#E5E8EB]">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="flex items-center gap-1 text-xs text-[#8B95A1] hover:text-[#E63946] px-2 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>초기화</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bg-[#3182F6] hover:bg-[#1B64DA] text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                  >
                    저장하기
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
