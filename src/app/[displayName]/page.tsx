"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import NotFound from "@/app/not-found";
import { Card, CardContent } from "@/components/ui/card";
import { LinkList } from "@/components/links/link-list";
import { LinkAvatar } from "@/components/ui/link-avatar";
import { useAuth } from "@/context/AuthContext";
import { useUserProfileByDisplayNameQuery } from "@/hooks/use-user-profile";
import { useLinksQuery, useIncrementLinkClicksMutation } from "@/hooks/use-links";
import { Copy, Check, ExternalLink, ArrowLeft, Share2, LogIn } from "lucide-react";
import { toast } from "sonner";
import type { LinkItem } from "@/types/link";
import type { UserProfile } from "@/types/user";
import { syncUserProfileToFirestore } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    displayName: string;
  }>;
}

export default function UserPublicPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawDisplayName = resolvedParams.displayName || "";
  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim();

  const { user: currentUser, userProfile: currentUserProfile, loading: isAuthLoading, signInWithGoogle } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  // 1. displayName으로 Firestore users 컬렉션에서 유저 검색
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useUserProfileByDisplayNameQuery(decodedDisplayName);

  // 본인 페이지 여부 판단 (로그인된 계정의 uid, email id, displayName 등과 비교)
  const isOwner = Boolean(
    currentUser && (
      currentUser.uid === decodedDisplayName ||
      (currentUser.email && currentUser.email.split("@")[0].toLowerCase() === decodedDisplayName.toLowerCase()) ||
      (currentUserProfile?.displayName && currentUserProfile.displayName.toLowerCase() === decodedDisplayName.toLowerCase()) ||
      (currentUser.displayName && currentUser.displayName.toLowerCase() === decodedDisplayName.toLowerCase()) ||
      (profile && profile.uid === currentUser.uid)
    )
  );

  // 본인인 경우 Firestore 조회가 지연되더라도 즉시 화면을 띄울 수 있는 fallback 프로필
  const fallbackProfile: UserProfile | null = isOwner && currentUser ? {
    uid: currentUser.uid,
    displayName: currentUserProfile?.displayName || (currentUser.email ? currentUser.email.split("@")[0] : (currentUser.displayName || decodedDisplayName)),
    userName: currentUserProfile?.userName || currentUser.displayName || decodedDisplayName,
    email: currentUser.email,
    photoURL: currentUserProfile?.photoURL || currentUser.photoURL,
    badge: currentUserProfile?.badge || "✨ 마이링크 회원",
    bio: currentUserProfile?.bio || "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.",
  } : null;

  // 최종 활성 프로필: Firestore 조회 결과 우선, 본인인 경우 fallback 활용
  const activeProfile = profile || fallbackProfile;

  // 본인인데 Firestore에 프로필 매핑이 없는 경우 백그라운드에서 동기화 자가 복구
  useEffect(() => {
    if (isOwner && currentUser && !profile && !isProfileLoading) {
      syncUserProfileToFirestore(currentUser).catch((err) => {
        console.warn("프로필 자동 복구 동기화 시도 중:", err);
      });
    }
  }, [isOwner, currentUser, profile, isProfileLoading]);

  // 2. 검색된 유저의 uid로 links: users/{userId}/links 컬렉션 조회
  const targetUid = activeProfile?.uid;
  const {
    data: links = [],
    isLoading: isLinksLoading,
  } = useLinksQuery(targetUid);

  // 링크 클릭 수 증가 뮤테이션 (방문자 및 본인 클릭 시 실시간 카운트)
  const incrementClickMutation = useIncrementLinkClicksMutation(targetUid);

  const handleLinkClick = (link: LinkItem) => {
    if (targetUid) {
      incrementClickMutation.mutate(link.id);
    }
  };

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

  // Firestore 보안 규칙 권한 거부(Missing or insufficient permissions) 여부 감지
  const isPermissionError = Boolean(
    profileError && (
      (profileError as any)?.code === "permission-denied" ||
      (profileError as any)?.message?.includes("insufficient permissions") ||
      (profileError as any)?.message?.includes("Missing or insufficient permissions")
    )
  );

  // 로딩 상태 화면 (활성 프로필이 아직 없는 경우에만 로딩 표시)
  if ((isProfileLoading || isAuthLoading) && !activeProfile) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 rounded-full border-3 border-tds-border-default border-t-tds-fill-brand animate-spin mb-4" />
        <p className="text-tds-text-secondary text-[14px]">
          @{decodedDisplayName} 님의 프로필을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // Firebase 콘솔에 보안 규칙이 아직 배포되지 않아 권한 거부가 발생한 경우 친절한 조치 방법 안내
  if (!activeProfile && isPermissionError) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-white rounded-tds-2xl border border-amber-300 p-8 shadow-tds-2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-4">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-tds-text-primary mb-2">Firestore 보안 규칙 게시가 필요합니다</h2>
          <p className="text-[13px] text-tds-text-secondary mb-4 break-keep leading-relaxed">
            원격 Firebase 콘솔의 보안 규칙이 비로그인(시크릿 모드) 방문자의 읽기를 허용하지 않아 접근 권한 오류가 발생했습니다.
          </p>
          <div className="bg-tds-fill-secondary p-3 rounded-tds-m text-left w-full mb-6 text-[12px] text-tds-text-secondary space-y-1.5">
            <p className="font-semibold text-tds-text-primary">💡 해결 방법 (30초 소요):</p>
            <p>
              1.{" "}
              <a
                href="https://console.firebase.google.com/project/my-hylink/firestore/rules"
                target="_blank"
                rel="noreferrer"
                className="text-tds-text-brand underline font-medium hover:text-tds-blue-600"
              >
                Firebase 콘솔 규칙 탭 바로가기 ↗
              </a>
            </p>
            <p>
              2. 프로젝트 루트의 <code className="bg-white px-1 py-0.5 rounded border border-tds-border-default font-mono">firestore.rules</code> 내용 전체 복사 후 붙여넣기
            </p>
            <p>
              3. 우측 상단의 <strong>[게시(Publish)]</strong> 버튼 클릭
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <Link
              href="/"
              className="flex-1 h-10 rounded-tds-m border border-tds-border-default bg-white hover:bg-tds-fill-secondary text-tds-text-primary font-semibold text-[13px] transition-all flex items-center justify-center"
            >
              메인으로 이동
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 h-10 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600 text-white font-semibold text-[13px] transition-all cursor-pointer"
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 비로그인 상태에서 '/사용자' 주소로 잘못 접근한 경우 친절한 로그인 안내 화면 제공
  if (!activeProfile && (decodedDisplayName === "사용자" || !decodedDisplayName) && !currentUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm bg-white rounded-tds-2xl border border-tds-border-default p-8 shadow-tds-2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-tds-fill-brand flex items-center justify-center text-2xl mb-4">
            🔐
          </div>
          <h2 className="text-lg font-bold text-tds-text-primary mb-2">로그인이 필요합니다</h2>
          <p className="text-[13px] text-tds-text-secondary mb-6 break-keep leading-relaxed">
            내 개인 페이지를 확인하고 링크를 관리하려면 Google 계정으로 로그인해 주세요.
          </p>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full h-11 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600 text-white font-semibold text-[14px] transition-all cursor-pointer flex items-center justify-center gap-2 mb-3"
          >
            <LogIn size={16} />
            <span>Google로 로그인</span>
          </button>
          <Link
            href="/"
            className="text-[13px] text-tds-text-secondary hover:text-tds-text-primary underline underline-offset-4"
          >
            메인 페이지로 이동
          </Link>
        </div>
      </div>
    );
  }

  // 3. 프로필이 최종적으로 존재하지 않는 경우 404 페이지로 전환
  if (!activeProfile) {
    return <NotFound />;
  }

  const displayUserName = activeProfile.userName || activeProfile.displayName || "사용자";
  const displayNickName = activeProfile.displayName || decodedDisplayName;

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

            {/* 2. [user name] */}
            <h1 className="text-xl sm:text-2xl font-bold leading-[1.30] tracking-[-0.020em] text-tds-text-primary text-center mb-1">
              {displayUserName}
            </h1>

            {/* 3. [display name] */}
            <div className="inline-flex items-center justify-center px-4 py-0.5 rounded-full bg-tds-fill-secondary/60 text-[13px] sm:text-[14px] text-tds-text-secondary font-medium mb-3.5">
              @{displayNickName}
            </div>

            {/* 4. [자기소개] */}
            {activeProfile.bio && (
              <p className="text-[13px] sm:text-[14px] leading-relaxed text-tds-text-secondary break-keep max-w-[380px] text-center">
                {activeProfile.bio}
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
            <LinkList
              links={links}
              readOnly={true}
              userId={targetUid}
              onLinkClick={handleLinkClick}
            />
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
