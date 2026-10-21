"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import NotFound from "@/app/not-found";
import { Card, CardContent } from "@/components/ui/card";
import { LinkList } from "@/components/links/link-list";
import { LinkAvatar } from "@/components/ui/link-avatar";
import { useAuth } from "@/context/AuthContext";
import { useUserProfileByDisplayNameQuery } from "@/hooks/use-user-profile";
import { useLinksQuery } from "@/hooks/use-links";
import { Copy, Check, ExternalLink, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{
    displayName: string;
  }>;
}

export default function UserPublicPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawDisplayName = resolvedParams.displayName;
  const decodedDisplayName = decodeURIComponent(rawDisplayName);

  const { user: currentUser } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  // 1. displayName으로 Firestore users 컬렉션에서 유저 검색
  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetched: isProfileFetched,
  } = useUserProfileByDisplayNameQuery(decodedDisplayName);

  // 2. 검색된 유저의 uid로 links: users/{userId}/links 컬렉션 조회
  const {
    data: links = [],
    isLoading: isLinksLoading,
  } = useLinksQuery(profile?.uid);

  // 페이지 URL 복사 핸들러
  const handleCopyPageUrl = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success("프로필 페이지 링크가 복사되었습니다!", { duration: 1500 });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  // 로딩 상태 화면
  if (isProfileLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 rounded-full border-3 border-tds-border-default border-t-tds-fill-brand animate-spin mb-4" />
        <p className="text-tds-text-secondary text-[14px]">
          @{decodedDisplayName} 님의 프로필을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // 3. username이 없거나 등록되지 않은 유저인 경우 404 페이지로 전환
  if (!profile || !profile.userName) {
    return <NotFound />;
  }

  // 본인 페이지 여부 확인
  const isOwner = currentUser && profile && currentUser.uid === profile.uid;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak py-6 sm:py-10 px-3 sm:px-4 flex flex-col items-center w-full min-w-0 overflow-x-hidden">
      <div className="w-full max-w-[460px] flex flex-col gap-4 min-w-0">

        {/* 상단 네비게이션 & 공유 바 */}
        <div className="flex items-center justify-between gap-2 px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-tds-text-secondary hover:text-tds-text-primary transition-colors py-1 px-2 rounded-tds-m hover:bg-tds-fill-secondary"
          >
            <ArrowLeft size={16} />
            <span>메인으로</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyPageUrl}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-tds-text-primary bg-white hover:bg-tds-fill-secondary border border-tds-border-default/80 px-2.5 py-1.5 rounded-tds-m shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check size={13} className="text-emerald-600" />
                <span className="text-emerald-600">복사 완료</span>
              </>
            ) : (
              <>
                <Share2 size={13} className="text-tds-text-secondary" />
                <span>공유하기</span>
              </>
            )}
          </button>
        </div>

        {/* 본인 페이지인 경우 표시되는 바로가기 배너 */}
        {isOwner && (
          <div className="flex items-center justify-between gap-2 bg-tds-bg-brand-weak border border-tds-border-focused/40 rounded-tds-xl px-3.5 py-2.5 text-[13px] text-tds-text-brand shadow-xs">
            <span className="font-semibold truncate">
              👋 회원님의 공개 페이지입니다.
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-tds-fill-brand hover:bg-tds-blue-600 text-white text-[12px] font-semibold shrink-0 transition-colors shadow-2xs"
            >
              <span>링크 편집</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        )}

        {/* ── 프로필 카드 ── */}
        <Card className="w-full min-w-0 overflow-hidden shadow-tds-1 border border-tds-border-default/80 bg-white">
          <CardContent className="flex flex-col items-center justify-center text-center py-7 sm:py-9 px-6 sm:px-8 min-w-0">

            {/* 1. [프로필 사진] 동기화된 "LINK" 원형 아바타 */}
            <div className="flex items-center justify-center mb-3.5">
              <LinkAvatar size="lg" />
            </div>

            {/* 2. [user name] "홍길동" */}
            <h1 className="text-xl sm:text-2xl font-bold leading-[1.30] tracking-[-0.020em] text-tds-text-primary text-center mb-1">
              {profile.userName}
            </h1>

            {/* 3. [display name] "@tkflrnstk" */}
            <div className="inline-flex items-center justify-center px-4 py-0.5 rounded-full bg-tds-fill-secondary/60 text-[13px] sm:text-[14px] text-tds-text-secondary font-medium mb-3.5">
              @{profile.displayName}
            </div>

            {/* 4. [자기소개] */}
            {profile.bio && (
              <p className="text-[13px] sm:text-[14px] leading-relaxed text-tds-text-secondary break-keep max-w-[380px] text-center">
                {profile.bio}
              </p>
            )}

          </CardContent>
        </Card>

        {/* ── 링크 목록 섹션 (users/{userId}/links) ── */}
        <div className="flex flex-col gap-2 mt-2 min-w-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[14px] sm:text-[15px] font-semibold text-tds-text-primary">
              🔗 링크 목록
            </span>
            <span className="text-[12px] text-tds-text-disabled font-medium">
              총 {links.length}개
            </span>
          </div>

          {isLinksLoading ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-tds-xl border border-tds-border-default/80">
              <div className="w-7 h-7 rounded-full border-2 border-tds-border-default border-t-tds-fill-brand animate-spin mb-2" />
              <p className="text-tds-text-secondary text-[12px]">링크 목록을 불러오는 중...</p>
            </div>
          ) : (
            <LinkList links={links} readOnly={true} />
          )}
        </div>

        {/* ── 푸터 ── */}
        <footer className="mt-8 mb-4 text-center flex flex-col items-center gap-1.5 text-[12px] text-tds-text-disabled">
          <Link
            href="/"
            className="font-semibold text-tds-text-secondary hover:text-tds-text-brand transition-colors inline-flex items-center gap-1"
          >
            <span>🔗 나만의 MyLink 만들기</span>
          </Link>
          <span>© 2026 MyLink · All rights reserved.</span>
        </footer>

      </div>
    </div>
  );
}
