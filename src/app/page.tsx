"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkList } from "@/components/links/link-list";
import { AddLinkDialog } from "@/components/links/add-link-dialog";
import { DeleteConfirmDialog } from "@/components/links/delete-confirm-dialog";
import linksData from "@/data/links.json";
import type { LinkItem, CreateLinkInput } from "@/types/link";
import { useAuth } from "@/context/AuthContext";
import { Dialog } from "@base-ui/react/dialog";

import {
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  subscribeFirestoreLinks,
  migrateLocalLinksToFirestore,
  getLinksCollectionPath,
} from "@/lib/links";

const DEFAULT_LINKS = linksData as LinkItem[];

export default function Home() {
  const { user, userProfile, loading: authLoading, signInWithGoogle, updateProfile } = useAuth();

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);

  // 모달 상태
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetLink, setDeleteTargetLink] = useState<LinkItem | null>(null);

  // 프로필 편집 폼 상태
  const [editName, setEditName] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 로그인 상태 및 user.uid에 따라 Firestore users/{user.uid}/links 실시간 구독
  useEffect(() => {
    if (!user) {
      setLinks([]);
      setIsFirestoreConnected(false);
      return;
    }

    setIsLoadingLinks(true);
    const userId = user.uid;

    // Firestore 실시간 구독 (users/{userId}/links)
    const unsubscribe = subscribeFirestoreLinks(
      userId,
      (firestoreLinks) => {
        setIsFirestoreConnected(true);
        setIsLoadingLinks(false);
        // 개별 사용자는 처음에는 빈 링크 목록으로 시작 (자동 생성 방지)
        setLinks(firestoreLinks);
      },
      (error) => {
        console.error("Firestore 실시간 연동 에러:", error);
        setIsFirestoreConnected(false);
        setIsLoadingLinks(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 프로필 편집 모달 열기
  const handleOpenEditProfile = () => {
    const currentName = user?.email ? user.email.split("@")[0] : (userProfile?.displayName || user?.displayName || "");
    const currentBadge = userProfile?.badge || "✨ 마이링크 회원";
    const currentBio = userProfile?.bio || "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.";

    setEditName(currentName);
    setEditBadge(currentBadge);
    setEditBio(currentBio);
    setIsEditProfileOpen(true);
  };

  // 프로필 저장 (Firestore users/{uid} 문서에 저장)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSavingProfile(true);
      await updateProfile({
        displayName: editName,
        badge: editBadge,
        bio: editBio,
      });
      setIsEditProfileOpen(false);
    } catch (e) {
      console.error("프로필 저장 에러:", e);
      alert("프로필 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 링크 추가 모달 열기
  const handleOpenAddLink = () => {
    setIsLinkDialogOpen(true);
  };

  // 링크 인라인 수정 핸들러 (Firestore users/{user.uid}/links 연동)
  const handleUpdateLink = async (id: string, updatedData: Partial<CreateLinkInput>) => {
    if (!user) return;
    const now = new Date();

    // 1. 화면 즉시 반영 (Optimistic UI)
    setLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedData, updatedat: now, updatedAt: now } : item
      )
    );

    // 2. Firestore 업데이트
    try {
      await updateLinkInFirestore(user.uid, id, updatedData);
    } catch (err) {
      console.error("Firestore 링크 수정 실패:", err);
      throw err;
    }
  };

  // 링크 저장 핸들러 (AddLinkDialog 모달용)
  const handleSaveLink = async (savedLink: LinkItem) => {
    if (!user) return;
    try {
      await addLinkToFirestore(user.uid, {
        title: savedLink.title,
        url: savedLink.url,
        subtitle: savedLink.subtitle,
        description: savedLink.description,
        emoji: savedLink.emoji,
        badge: savedLink.badge,
        badgeBg: savedLink.badgeBg,
      });
    } catch (err) {
      console.error("Firestore 링크 추가 실패:", err);
      alert("링크를 저장하는 중 오류가 발생했습니다.");
    }
  };

  // 링크 삭제 모달 열기
  const handleOpenDeleteModal = (link: LinkItem) => {
    setDeleteTargetLink(link);
    setIsDeleteDialogOpen(true);
  };

  // 링크 삭제 확정 핸들러 (Firebase Firestore users/{user.uid}/links 연동)
  const handleConfirmDelete = async (id: string) => {
    if (!user) return;
    // 1. 화면 즉시 삭제 (Optimistic UI)
    setLinks((prev) => prev.filter((item) => item.id !== id));

    // 2. Firestore 문서 삭제
    try {
      await deleteLinkFromFirestore(user.uid, id);
    } catch (err) {
      console.error("Firestore 링크 삭제 실패:", err);
      throw err;
    }
  };

  if (!isMounted) return null;

  // 인증 상태 로딩 중일 때
  if (authLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 rounded-full border-3 border-tds-border-default border-t-tds-fill-brand animate-spin mb-4" />
        <p className="text-tds-text-secondary text-[14px]">로그인 상태를 확인하는 중입니다...</p>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 1. 로그아웃 상태 화면 (센스있고 심플한 미니멀 로그인 카드)
  // ────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak px-4 py-12 flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-[420px] flex flex-col items-center">

          {/* 비로그인 메인 카드 */}
          <div className="w-full bg-white dark:bg-tds-fill-card rounded-tds-3xl border border-tds-border-default/80 p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.05)] flex flex-col items-center text-center transition-all">
            {/* 센스있는 미니멀 링크 아이콘 뱃지 */}
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-tds-fill-brand flex items-center justify-center mb-6 shadow-sm ring-1 ring-blue-500/10">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>

            {/* 타이틀 */}
            <h1 className="text-[24px] sm:text-[26px] font-bold text-tds-text-primary tracking-tight leading-[1.35] mb-2.5 break-keep">
              나를 표현하는<br />
              가장 간단한 링크
            </h1>

            {/* 서브 설명 */}
            <p className="text-[14px] sm:text-[15px] text-tds-text-secondary leading-relaxed mb-8 break-keep">
              흩어져 있던 SNS, 포트폴리오, 작업물을<br />
              단 하나의 프로필 링크로 모아보세요.
            </p>

            {/* 구글 로그인 액션 버튼 */}
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full h-12 rounded-tds-xl bg-tds-fill-brand hover:bg-tds-blue-600
                         text-white font-semibold text-[15px] flex items-center justify-center gap-3
                         shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shadow-xs">
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

            {/* 하단 심플 가이드 */}
            <p className="mt-4 text-[12px] sm:text-[13px] text-tds-text-disabled">
              별도의 회원가입 없이 간편하게 시작할 수 있어요
            </p>
          </div>

          {/* 심플 카피라이트 */}
          <footer className="mt-8 text-center text-[12px] text-tds-text-disabled">
            © 2026 MyLink · All rights reserved.
          </footer>

        </div>
      </div>
    );
  }

  // displayName은 이메일의 앞부분을 우선 사용
  const currentDisplayName = user.email ? user.email.split("@")[0] : (userProfile?.displayName || user.displayName || "사용자");
  const currentBadge = userProfile?.badge || "✨ 마이링크 회원";
  const currentBio = userProfile?.bio || "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.";
  const firestorePath = getLinksCollectionPath(user.uid);

  return (
    <div className="min-h-screen bg-tds-fill-weak py-4 sm:py-6 px-3 sm:px-4 flex flex-col items-center w-full min-w-0 overflow-x-hidden">

      {/* ── 상단 시연 배너 — 개인화된 경로 users/{user.uid}/links 표시 ── */}
      <div className="w-full max-w-[460px] mb-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2
                      bg-tds-grey-900 text-white px-3.5 sm:px-4 py-2.5 rounded-tds-xl
                      text-[13px] leading-[1.25] min-w-0 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"} shrink-0`} />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold truncate">
              🔥 Firestore 개인화 연동 중
            </span>
            <span className="text-[11px] text-tds-grey-300 font-mono truncate">
              {firestorePath}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-auto">
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

        {/* 프로필 카드 — 로그인된 유저 정보 및 Firestore 경로 명시 */}
        <Card className="w-full min-w-0 overflow-hidden shadow-tds-1">
          <CardContent className="flex flex-col items-center text-center gap-4 sm:gap-5 py-6 sm:py-8 px-4 sm:px-6 min-w-0">

            {/* 아바타: 구글 프로필 사진 또는 이니셜 */}
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={currentDisplayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-tds-xl object-cover shadow-sm border-2 border-white shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-tds-xl bg-tds-bg-brand-weak
                              flex items-center justify-center shrink-0">
                <span className="text-2xl sm:text-3xl font-bold text-tds-text-brand">
                  {currentDisplayName.charAt(0)}
                </span>
              </div>
            )}

            {/* 이름 */}
            <div className="flex flex-col items-center gap-1 max-w-full">
              <h1 className="text-xl sm:text-2xl font-bold leading-[1.30] tracking-[-0.020em]
                             text-tds-text-primary break-words max-w-full">
                {currentDisplayName}
              </h1>
              {user.email && (
                <span className="text-[13px] text-tds-text-secondary truncate max-w-[280px]">
                  {user.email}
                </span>
              )}
            </div>

            {/* 뱃지 */}
            <Badge variant="chip-brand">
              {currentBadge}
            </Badge>

            {/* 유저 Firestore 정보 박스 */}
            <div className="w-full bg-tds-fill-secondary rounded-tds-m p-3 text-left flex flex-col gap-1 border border-tds-border-default/60">
              <div className="flex items-center justify-between text-[11px] text-tds-text-secondary">
                <span className="font-semibold">Firestore 유저 경로</span>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-tds-border-default text-tds-text-primary truncate max-w-[200px]">
                  users/{user.uid}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-tds-text-secondary">
                <span className="font-semibold">링크 컬렉션 경로</span>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-tds-border-default text-tds-blue-600 font-semibold truncate max-w-[200px]">
                  {firestorePath}
                </span>
              </div>
            </div>

            {/* 구분선 */}
            <hr className="w-full border-tds-border-default" />

            {/* 소개글 */}
            <p className="text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em]
                          text-tds-text-secondary text-left w-full break-words min-w-0">
              {currentBio}
            </p>
          </CardContent>
        </Card>

        {/* 링크 섹션 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-1 px-1 mt-2 min-w-0">
          <span className="text-[14px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                           text-tds-text-primary">
            🔗 나의 링크 목록
          </span>
          <span className="text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-disabled">
            {isLoadingLinks ? "동기화 중..." : `총 ${links.length}개 · 클릭 시 이동 →`}
          </span>
        </div>

        {/* 링크 목록 */}
        {isLoadingLinks ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-tds-border-default border-t-tds-fill-brand animate-spin mb-2" />
            <p className="text-[13px] text-tds-text-secondary">링크 목록을 불러오는 중...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="bg-white rounded-tds-xl p-8 text-center border border-dashed border-tds-border-default flex flex-col items-center gap-3">
            <span className="text-3xl">📭</span>
            <p className="text-[14px] font-semibold text-tds-text-primary">아직 등록된 링크가 없습니다.</p>
            <p className="text-[12px] text-tds-text-secondary">상단의 &apos;➕ 링크 추가&apos; 버튼을 눌러 첫 링크를 등록해보세요!</p>
            <button
              onClick={handleOpenAddLink}
              className="mt-2 h-9 px-4 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600 text-white text-[13px] font-semibold transition-all cursor-pointer"
            >
              ➕ 첫 링크 등록하기
            </button>
          </div>
        ) : (
          <LinkList
            links={links}
            onUpdate={handleUpdateLink}
            onDelete={handleOpenDeleteModal}
          />
        )}

        {/* 푸터 */}
        <footer className="text-center text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-disabled py-4 break-words">
          © 2026 {currentDisplayName} · 마이링크 (MyLink)
        </footer>

      </div>

      {/* ── 링크 추가 다이얼로그 모달 ── */}
      <AddLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSaveLink={handleSaveLink}
        editingLink={null}
      />

      {/* ── 링크 삭제 확인 모달 ── */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        link={deleteTargetLink}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeleteTargetLink(null);
        }}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* ── 프로필 편집 모달 (Base UI Dialog 기반) ── */}
      <Dialog.Root open={isEditProfileOpen} onOpenChange={(open) => !open && !isSavingProfile && setIsEditProfileOpen(false)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-tds-overlay-scrim backdrop-blur-sm z-50 transition-opacity" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-white rounded-tds-2xl shadow-tds-3 p-4 sm:p-6 max-h-[90vh] overflow-y-auto min-w-0 outline-none">
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 min-w-0">
                <Dialog.Title className="text-base sm:text-lg font-semibold leading-[1.45] tracking-[-0.010em] text-tds-text-primary truncate">
                  ⚡ 프로필 편집
                </Dialog.Title>
                <button
                  type="button"
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
                    placeholder="예: 🚀 스타트업 개발자"
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
                    placeholder="나를 소개하는 한 마디를 적어보세요."
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
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-tds-border-default mt-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    disabled={isSavingProfile}
                    className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-tds-m bg-tds-fill-secondary
                               hover:bg-tds-grey-200 text-tds-text-primary
                               text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                               transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                               active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-tds-m bg-tds-fill-brand
                               hover:bg-tds-blue-600 text-white
                               text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                               transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                               active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile ? "저장 중..." : "저장 💾"}
                  </button>
                </div>
              </form>
            </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
