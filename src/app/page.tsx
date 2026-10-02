"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkList } from "@/components/links/link-list";
import { AddLinkDialog } from "@/components/links/add-link-dialog";
import linksData from "@/data/links.json";
import type { LinkItem } from "@/types/link";

/* ── 타입 ─────────────────────────────────────────────── */
interface ProfileData {
  name: string;
  badge: string;
  bio: string;
}

/* ── 기본 프로필 및 기본 링크 ────────────────────────── */
const DEFAULT_PROFILE: ProfileData = {
  name: "노기훈",
  badge: "⚓ 정부 항해사 & 💻 개발자",
  bio: "🌊 바다 위에서는 안전한 항로를 이끄는 정부 항해사이자, 코드 위에서는 바이브 코딩으로 새로운 가능성을 개척하는 개발자입니다.",
};

const DEFAULT_LINKS = linksData as LinkItem[];
const LOCAL_STORAGE_PROFILE_KEY = "mylink_demo_profile_v1";
const LOCAL_STORAGE_LINKS_KEY = "mylink_demo_links_v1";

/* ── 메인 컴포넌트 ────────────────────────────────────── */
export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_LINKS);
  const [isMounted, setIsMounted] = useState(false);

  // 모달 상태
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // 프로필 편집 폼 상태
  const [editName, setEditName] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    setIsMounted(true);
    try {
      // 프로필 로드
      const savedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      }

      // 링크 목록 로드
      const savedLinks = localStorage.getItem(LOCAL_STORAGE_LINKS_KEY);
      if (savedLinks) {
        setLinks(JSON.parse(savedLinks));
      } else {
        localStorage.setItem(LOCAL_STORAGE_LINKS_KEY, JSON.stringify(DEFAULT_LINKS));
      }
    } catch (e) {
      console.error("LocalStorage load error:", e);
    }
  }, []);

  const handleOpenEditProfile = () => {
    setEditName(profile.name);
    setEditBadge(profile.badge);
    setEditBio(profile.bio);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProfileData = { name: editName, badge: editBadge, bio: editBio };
    setProfile(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
    setIsEditProfileOpen(false);
  };

  const handleResetProfile = () => {
    if (confirm("프로필과 링크를 초기값으로 되돌릴게요.")) {
      setProfile(DEFAULT_PROFILE);
      setLinks(DEFAULT_LINKS);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem(LOCAL_STORAGE_LINKS_KEY, JSON.stringify(DEFAULT_LINKS));
      setIsEditProfileOpen(false);
    }
  };

  // 링크 추가 모달 열기
  const handleOpenAddLink = () => {
    setEditingLink(null);
    setIsLinkDialogOpen(true);
  };

  // 링크 수정 모달 열기
  const handleOpenEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setIsLinkDialogOpen(true);
  };

  // 링크 저장 핸들러 (추가 및 수정 공통)
  const handleSaveLink = (savedLink: LinkItem) => {
    let updatedLinks: LinkItem[];
    const exists = links.some((item) => item.id === savedLink.id);

    if (exists) {
      // 수정
      updatedLinks = links.map((item) => (item.id === savedLink.id ? savedLink : item));
    } else {
      // 추가
      updatedLinks = [savedLink, ...links];
    }

    setLinks(updatedLinks);
    try {
      localStorage.setItem(LOCAL_STORAGE_LINKS_KEY, JSON.stringify(updatedLinks));
    } catch (e) {
      console.error("LocalStorage save links error:", e);
    }
  };

  // 링크 삭제 핸들러
  const handleDeleteLink = (id: string) => {
    if (confirm("이 링크를 삭제할까요?")) {
      const updatedLinks = links.filter((item) => item.id !== id);
      setLinks(updatedLinks);
      try {
        localStorage.setItem(LOCAL_STORAGE_LINKS_KEY, JSON.stringify(updatedLinks));
      } catch (e) {
        console.error("LocalStorage delete link error:", e);
      }
    }
  };

  if (!isMounted) return null;

  return (
    /* TDS fill-weak (grey-50) 배경 */
    <div className="min-h-screen bg-tds-fill-weak py-4 sm:py-6 px-3 sm:px-4 flex flex-col items-center w-full min-w-0 overflow-x-hidden">

      {/* ── 시연 배너 — radius-tds-xl (16px) ── */}
      <div className="w-full max-w-[460px] mb-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2
                      bg-tds-grey-900 text-white px-3.5 sm:px-4 py-2.5 rounded-tds-xl
                      text-[13px] leading-[1.25] min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-semibold truncate">💾 LocalStorage 시연 중</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* 단 하나의 ➕ 링크 추가 버튼 유지 */}
          <button
            onClick={handleOpenAddLink}
            className="h-8 px-3 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600
                       active:scale-[0.98] text-white text-[13px] font-semibold
                       transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                       cursor-pointer shrink-0"
          >
            ➕ 링크 추가
          </button>
          <button
            onClick={handleOpenEditProfile}
            className="h-8 px-3 rounded-tds-m bg-tds-grey-800 hover:bg-tds-grey-700
                       active:scale-[0.98] text-white text-[13px] font-semibold
                       transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                       cursor-pointer shrink-0"
          >
            ⚡ 프로필 편집
          </button>
        </div>
      </div>

      {/* ── 메인 컨테이너 ── */}
      <div className="w-full max-w-[460px] flex flex-col gap-4 min-w-0">

        {/* 프로필 카드 — shadcn/ui Card (TDS radius-xl 16px, shadow-tds-1) */}
        <Card className="w-full min-w-0 overflow-hidden">
          <CardContent className="flex flex-col items-center text-center gap-4 sm:gap-5 py-6 sm:py-8 px-4 sm:px-6 min-w-0">

            {/* 아바타 — radius-tds-xl (16px), blue-50 배경 */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-tds-xl bg-tds-bg-brand-weak
                            flex items-center justify-center shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-tds-text-brand">
                {profile.name.charAt(0)}
              </span>
            </div>

            {/* 이름 — TDS h2: 24px / Bold(700) / leading-[1.30] / tracking-[-0.020em] */}
            <h1 className="text-xl sm:text-2xl font-bold leading-[1.30] tracking-[-0.020em]
                           text-tds-text-primary break-words max-w-full">
              {profile.name}
            </h1>

            {/* 뱃지 — TDS chip-brand: radius-full, blue-50 bg, blue-500 text */}
            <Badge variant="chip-brand">
              {profile.badge}
            </Badge>

            {/* 구분선 — border-default (grey-200) */}
            <hr className="w-full border-tds-border-default" />

            {/* 소개글 — TDS body-2: 15px / Regular / leading-[1.50] / tracking-[-0.005em] */}
            <p className="text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em]
                          text-tds-text-secondary text-left w-full break-words min-w-0">
              {profile.bio}
            </p>
          </CardContent>
        </Card>

        {/* 링크 섹션 헤더 (중단부 중복 추가 버튼 제거) */}
        <div className="flex flex-wrap items-center justify-between gap-1 px-1 mt-2 min-w-0">
          {/* label-m: 15px/600 */}
          <span className="text-[14px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                           text-tds-text-primary">
            🔗 링크 바로가기
          </span>
          {/* body-3: 13px / text-disabled */}
          <span className="text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-disabled">
            총 {links.length}개 · 클릭 시 이동 →
          </span>
        </div>

        {/* 링크 목록 — LinkList (각 카드별 수정/삭제 기능 지원) */}
        <LinkList
          links={links}
          onEdit={handleOpenEditLink}
          onDelete={handleDeleteLink}
        />

        {/* 푸터 — body-3: 13px / text-disabled */}
        <footer className="text-center text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-disabled py-4 break-words">
          © 2026 {profile.name} · 마이링크 (MyLink)
        </footer>

      </div>

      {/* ── 링크 추가/수정 다이얼로그 모달 ── */}
      <AddLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSaveLink={handleSaveLink}
        editingLink={editingLink}
      />

      {/* ── 프로필 편집 모달 ──
          shadcn/ui Card + TDS radius-tds-2xl (20px) + shadow-tds-3
      ─── */}
      {isEditProfileOpen && (
        <div
          className="fixed inset-0 bg-tds-overlay-scrim backdrop-blur-sm z-50
                     flex items-center justify-center p-3 sm:p-4 min-w-0"
          onClick={(e) => e.target === e.currentTarget && setIsEditProfileOpen(false)}
        >
          {/* TDS dialog: radius-2xl (20px), shadow-tds-3, 24px inner padding */}
          <div className="w-full max-w-md bg-white rounded-tds-2xl shadow-tds-3 p-4 sm:p-6 max-h-[90vh] overflow-y-auto min-w-0">

            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 min-w-0">
              {/* title-1: 18px/600 */}
              <h2 className="text-base sm:text-lg font-semibold leading-[1.45] tracking-[-0.010em]
                             text-tds-text-primary truncate">
                ⚡ 프로필 편집
              </h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-tds-s
                           text-tds-text-disabled hover:text-tds-text-primary
                           hover:bg-tds-fill-secondary
                           transition-colors duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                           cursor-pointer text-lg shrink-0"
              >
                ✕
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5 sm:gap-4 min-w-0">

              <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
                  이름
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="h-11 sm:h-12 w-full rounded-tds-m border border-tds-border-default
                             bg-tds-fill-secondary px-3.5 sm:px-4
                             text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                             placeholder:text-tds-text-disabled
                             focus:outline-none focus:bg-white
                             focus:border-tds-border-focused focus:ring-2
                             focus:ring-tds-border-focused/20
                             transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] min-w-0"
                />
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
                  뱃지 라벨
                </label>
                <input
                  type="text"
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  required
                  className="h-11 sm:h-12 w-full rounded-tds-m border border-tds-border-default
                             bg-tds-fill-secondary px-3.5 sm:px-4
                             text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                             placeholder:text-tds-text-disabled
                             focus:outline-none focus:bg-white
                             focus:border-tds-border-focused focus:ring-2
                             focus:ring-tds-border-focused/20
                             transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] min-w-0"
                />
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
                  소개글
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-tds-m border border-tds-border-default
                             bg-tds-fill-secondary px-3.5 sm:px-4 py-2.5 sm:py-3
                             text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                             placeholder:text-tds-text-disabled
                             focus:outline-none focus:bg-white
                             focus:border-tds-border-focused focus:ring-2
                             focus:ring-tds-border-focused/20
                             transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                             resize-none min-w-0"
                />
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center justify-between pt-4
                              border-t border-tds-border-default mt-2 min-w-0">
                <button
                  type="button"
                  onClick={handleResetProfile}
                  className="text-[13px] font-semibold leading-[1.25]
                             text-tds-text-disabled hover:text-tds-text-secondary
                             transition-colors duration-[120ms] cursor-pointer shrink-0"
                >
                  데이터 초기화
                </button>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-tds-m bg-tds-fill-secondary
                               hover:bg-tds-grey-200 text-tds-text-primary
                               text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                               transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                               active:scale-[0.98] cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-tds-m bg-tds-fill-brand
                               hover:bg-tds-blue-600 text-white
                               text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                               transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                               active:scale-[0.98] cursor-pointer"
                  >
                    저장 💾
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
