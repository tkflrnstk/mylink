"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkAvatar } from "@/components/ui/link-avatar";
import { Pencil } from "lucide-react";
import { LinkList } from "@/components/links/link-list";
import { AddLinkDialog } from "@/components/links/add-link-dialog";
import { DeleteConfirmDialog } from "@/components/links/delete-confirm-dialog";
import linksData from "@/data/links.json";
import type { LinkItem, CreateLinkInput } from "@/types/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { checkDisplayNameAvailable } from "@/lib/auth";
import { getLinksCollectionPath } from "@/lib/links";
import {
  useLinksQuery,
  useAddLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
} from "@/hooks/use-links";
import {
  useUserProfileQuery,
  useUpdateUserProfileMutation,
  useCheckDisplayNameMutation,
} from "@/hooks/use-user-profile";
import { LandingView } from "@/components/landing/landing-view";

const DEFAULT_LINKS = linksData as LinkItem[];

export default function Home() {
  const { user, userProfile, loading: authLoading, signInWithGoogle, updateProfile } = useAuth();

  const [isMounted, setIsMounted] = useState(false);

  // TanStack Query 훅 연동 (링크 목록 조회/뮤테이션 및 프로필 쿼리/낙관적 뮤테이션)
  const {
    data: links = [],
    isLoading: isLoadingLinks,
    isSuccess: isFirestoreConnected,
  } = useLinksQuery(user?.uid);
  const { data: profileQueryData } = useUserProfileQuery(user?.uid);
  const addLinkMutation = useAddLinkMutation(user?.uid);
  const updateLinkMutation = useUpdateLinkMutation(user?.uid);
  const deleteLinkMutation = useDeleteLinkMutation(user?.uid);
  const updateUserProfileMutation = useUpdateUserProfileMutation(user?.uid);
  const checkDisplayNameMutation = useCheckDisplayNameMutation(user?.uid);

  // 모달 상태 (링크 추가 및 삭제만 유지, 프로필 편집은 인라인으로 전환)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetLink, setDeleteTargetLink] = useState<LinkItem | null>(null);

  // 인라인 편집 활성 필드: 'userName' | 'displayName' | 'bio' | null
  const [editingField, setEditingField] = useState<"userName" | "displayName" | "bio" | null>(null);

  // 인라인 입력 임시 값들
  const [inlineUserName, setInlineUserName] = useState("");
  const [inlineDisplayName, setInlineDisplayName] = useState("");
  const [inlineBio, setInlineBio] = useState("");

  // Display Name 중복 에러 상태
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);

  // 개별 필드 업데이트 진행 중 여부 및 중복 실행 방지 Ref
  const [isUpdatingField, setIsUpdatingField] = useState(false);
  const isSavingRef = React.useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── 1. User Name 인라인 편집 (클릭 시 입력창 -> Enter 누르면 즉시 저장) ──
  const handleStartEditUserName = () => {
    const currentUName = userProfile?.userName || user?.displayName || "홍길동";
    setInlineUserName(currentUName);
    setEditingField("userName");
  };

  const handleSaveUserName = async () => {
    if (!user || isSavingRef.current) return;
    const trimmed = inlineUserName.trim();
    const currentUName = (userProfile?.userName || user?.displayName || "홍길동").trim();

    if (!trimmed || trimmed === currentUName) {
      setEditingField(null);
      return;
    }

    try {
      isSavingRef.current = true;
      setIsUpdatingField(true);
      setEditingField(null); // 즉각적인 UI 반영을 위해 인라인 편집창 바로 닫기 (낙관적 캐시가 화면 채움)
      await updateUserProfileMutation.mutateAsync({ userName: trimmed });
      await updateProfile({ userName: trimmed });
    } catch (err) {
      console.error("User Name 저장 실패:", err);
    } finally {
      setIsUpdatingField(false);
      isSavingRef.current = false;
    }
  };

  // ── 2. Display Name 인라인 편집 (클릭 시 입력창 -> Enter 누르면 중복 확인 후 즉시 저장) ──
  const handleStartEditDisplayName = () => {
    const currentName = userProfile?.displayName || (user?.email ? user.email.split("@")[0] : (user?.displayName || ""));
    setInlineDisplayName(currentName);
    setDisplayNameError(null);
    setEditingField("displayName");
  };

  const handleSaveDisplayName = async () => {
    if (!user || isSavingRef.current) return;
    const trimmed = inlineDisplayName.trim();
    const currentName = (userProfile?.displayName || (user?.email ? user.email.split("@")[0] : "")).trim();

    if (!trimmed || trimmed === currentName) {
      setEditingField(null);
      return;
    }

    try {
      isSavingRef.current = true;
      setIsUpdatingField(true);
      setDisplayNameError(null);

      // Enter 입력 시 자동 중복 확인
      const checkRes = await checkDisplayNameMutation.mutateAsync(trimmed);
      if (!checkRes.available) {
        setDisplayNameError(checkRes.message || "이미 사용 중인 이름입니다.");
        setIsUpdatingField(false);
        isSavingRef.current = false;
        return;
      }

      setEditingField(null); // 중복 통과 시 즉시 편집창 닫고 화면 갱신
      await updateUserProfileMutation.mutateAsync({ displayName: trimmed });
      await updateProfile({ displayName: trimmed });
    } catch (err) {
      console.error("Display Name 저장 실패:", err);
      setDisplayNameError("중복 확인 또는 저장 중 오류가 발생했습니다.");
    } finally {
      setIsUpdatingField(false);
      isSavingRef.current = false;
    }
  };

  // ── 3. 자기소개 인라인 편집 (클릭 시 입력창 -> Enter 누르면 즉시 저장) ──
  const handleStartEditBio = () => {
    const currentB = userProfile?.bio || "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.";
    setInlineBio(currentB);
    setEditingField("bio");
  };

  const handleSaveBio = async () => {
    if (!user || isSavingRef.current) return;
    const trimmed = inlineBio.trim();
    const currentB = (userProfile?.bio || "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.").trim();

    if (trimmed === currentB) {
      setEditingField(null);
      return;
    }

    try {
      isSavingRef.current = true;
      setIsUpdatingField(true);
      setEditingField(null);
      await updateUserProfileMutation.mutateAsync({ bio: trimmed });
      await updateProfile({ bio: trimmed });
    } catch (err) {
      console.error("소개글 저장 실패:", err);
    } finally {
      setIsUpdatingField(false);
      isSavingRef.current = false;
    }
  };

  // 링크 추가 모달 열기
  const handleOpenAddLink = () => {
    setIsLinkDialogOpen(true);
  };

  // 링크 인라인 수정 핸들러 (TanStack Query useUpdateLinkMutation - 낙관적 업데이트)
  const handleUpdateLink = async (id: string, updatedData: Partial<CreateLinkInput>) => {
    if (!user) return;
    try {
      await updateLinkMutation.mutateAsync({ id, data: updatedData });
    } catch (err) {
      console.error("링크 수정 실패:", err);
      toast.error("링크를 수정하는 중 오류가 발생했습니다.");
      throw err;
    }
  };

  // 링크 저장 핸들러 (TanStack Query useAddLinkMutation)
  const handleSaveLink = async (savedLink: LinkItem) => {
    if (!user) return;
    try {
      await addLinkMutation.mutateAsync({
        title: savedLink.title,
        url: savedLink.url,
        subtitle: savedLink.subtitle,
        description: savedLink.description,
        emoji: savedLink.emoji,
        badge: savedLink.badge,
        badgeBg: savedLink.badgeBg,
      });
      toast.success("새 링크가 등록되었습니다!");
    } catch (err) {
      console.error("Firestore 링크 추가 실패:", err);
      toast.error("링크를 저장하는 중 오류가 발생했습니다.");
    }
  };

  // 링크 삭제 모달 열기
  const handleOpenDeleteModal = (link: LinkItem) => {
    setDeleteTargetLink(link);
    setIsDeleteDialogOpen(true);
  };

  // 링크 삭제 확정 핸들러 (TanStack Query useDeleteLinkMutation - 낙관적 업데이트)
  const handleConfirmDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteLinkMutation.mutateAsync(id);
      toast.success("링크가 삭제되었습니다.");
    } catch (err) {
      console.error("Firestore 링크 삭제 실패:", err);
      toast.error("링크 삭제 중 오류가 발생했습니다.");
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
  // 1. 비로그인 상태 화면: 인터랙티브 반응형 랜딩 페이지 (Google 로그인 진입점)
  // ────────────────────────────────────────────────────────────────
  if (!user) {
    return <LandingView onSignInWithGoogle={signInWithGoogle} />;
  }

  // 화면에 표시할 사용자 정보 (TanStack Query 캐시 우선 반영으로 낙관적 업데이트 100% 보장)
  const activeProfile = profileQueryData || userProfile;
  const currentDisplayName = activeProfile?.displayName || (user.email ? user.email.split("@")[0] : (user.displayName || "사용자"));
  const currentUserName = activeProfile?.userName || user.displayName || "홍길동";
  const currentBio = activeProfile?.bio || "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.";
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
        </div>
      </div>

      {/* ── 메인 컨테이너 ── */}
      <div className="w-full max-w-[460px] flex flex-col gap-4 min-w-0">

        {/* 프로필 카드 — [프로필 사진], [user name], [display name], [자기소개] 수직/수평 정밀 중앙 정렬 */}
        <Card className="w-full min-w-0 overflow-hidden shadow-tds-1 border border-tds-border-default/80 bg-white">
          <CardContent className="flex flex-col items-center justify-center text-center py-7 sm:py-9 px-6 sm:px-8 min-w-0">

            {/* 1. [프로필 사진] 깔끔한 "LINK" 감성의 모던 원형 아바타 */}
            <div className="flex items-center justify-center mb-3.5">
              <LinkAvatar size="lg" />
            </div>

            {/* 2. [user name] "홍길동" (칸 클릭 시 입력창 노출 -> 엔터 누르면 즉시 저장) */}
            <div className="flex items-center justify-center mb-1 w-full">
              {editingField === "userName" ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <input
                    type="text"
                    value={inlineUserName}
                    onChange={(e) => setInlineUserName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveUserName();
                      } else if (e.key === "Escape") {
                        setEditingField(null);
                      }
                    }}
                    onBlur={handleSaveUserName}
                    placeholder="이름 입력 후 Enter"
                    className="h-9 px-3 rounded-tds-m text-[18px] sm:text-[20px] font-bold text-tds-text-primary bg-white border-2 border-tds-border-focused focus:outline-none w-48 sm:w-56 text-center shadow-xs"
                    autoFocus
                  />
                  <span className="text-[11px] text-tds-text-disabled">엔터(Enter)를 누르면 저장됩니다 · Esc 취소</span>
                </div>
              ) : (
                <div
                  onClick={handleStartEditUserName}
                  title="클릭하여 user name 수정"
                  className="group relative inline-flex items-center justify-center px-6 py-1 rounded-tds-m hover:bg-tds-fill-secondary/70 transition-colors cursor-pointer select-none"
                >
                  <h1 className="text-xl sm:text-2xl font-bold leading-[1.30] tracking-[-0.020em] text-tds-text-primary text-center">
                    {currentUserName}
                  </h1>
                  <Pencil size={13} className="absolute right-1.5 opacity-0 group-hover:opacity-70 text-tds-text-secondary transition-opacity" />
                </div>
              )}
            </div>

            {/* 3. [display name] (칸 클릭 시 입력창 노출 -> 엔터 누르면 중복 검사 후 즉시 저장) */}
            <div className="flex items-center justify-center mb-3.5 w-full">
              {editingField === "displayName" ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center bg-white border-2 border-tds-border-focused rounded-tds-m px-3 shadow-xs">
                    <span className="text-[14px] font-semibold text-tds-text-secondary mr-1">@</span>
                    <input
                      type="text"
                      value={inlineDisplayName}
                      onChange={(e) => {
                        setInlineDisplayName(e.target.value);
                        if (displayNameError) setDisplayNameError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSaveDisplayName();
                        } else if (e.key === "Escape") {
                          setEditingField(null);
                        }
                      }}
                      onBlur={handleSaveDisplayName}
                      placeholder="아이디 입력 후 Enter"
                      className="h-8 text-[14px] font-medium text-tds-text-primary focus:outline-none w-36 sm:w-48 text-center"
                      autoFocus
                    />
                  </div>
                  {displayNameError ? (
                    <span className="text-[11px] text-red-500 font-medium">✕ {displayNameError}</span>
                  ) : (
                    <span className="text-[11px] text-tds-text-disabled">엔터(Enter)를 누르면 중복 확인 후 저장됩니다 · Esc 취소</span>
                  )}
                </div>
              ) : (
                <div
                  onClick={handleStartEditDisplayName}
                  title="클릭하여 display name 수정"
                  className="group relative inline-flex items-center justify-center px-5 py-0.5 rounded-full bg-tds-fill-secondary/60 hover:bg-tds-fill-secondary transition-colors cursor-pointer select-none"
                >
                  <span className="text-[13px] sm:text-[14px] text-tds-text-secondary font-medium text-center">
                    @{currentDisplayName}
                  </span>
                  <Pencil size={11} className="absolute right-1.5 opacity-0 group-hover:opacity-70 text-tds-text-secondary transition-opacity" />
                </div>
              )}
            </div>

            {/* 4. [자기소개] (칸 클릭 시 입력창 노출 -> 엔터 누르면 즉시 저장) */}
            <div className="flex items-center justify-center w-full">
              {editingField === "bio" ? (
                <div className="w-full max-w-[380px] flex flex-col items-center justify-center gap-1">
                  <input
                    type="text"
                    value={inlineBio}
                    onChange={(e) => setInlineBio(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveBio();
                      } else if (e.key === "Escape") {
                        setEditingField(null);
                      }
                    }}
                    onBlur={handleSaveBio}
                    placeholder="자기소개 입력 후 Enter"
                    className="w-full h-9 px-3 rounded-tds-m text-[13px] sm:text-[14px] text-tds-text-primary bg-white border-2 border-tds-border-focused focus:outline-none text-center shadow-xs"
                    autoFocus
                  />
                  <span className="text-[11px] text-tds-text-disabled">엔터(Enter)를 누르면 저장됩니다 · Esc 취소</span>
                </div>
              ) : (
                <div
                  onClick={handleStartEditBio}
                  title="클릭하여 자기소개 수정"
                  className="group relative w-full max-w-[380px] flex items-center justify-center px-6 py-1.5 rounded-tds-m hover:bg-tds-fill-secondary/70 transition-colors cursor-pointer select-none"
                >
                  <p className="text-[13px] sm:text-[14px] leading-relaxed text-tds-text-secondary break-keep text-center">
                    {currentBio}
                  </p>
                  <Pencil size={12} className="absolute right-1 top-2 opacity-0 group-hover:opacity-70 text-tds-text-secondary transition-opacity shrink-0" />
                </div>
              )}
            </div>

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

    </div>
  );
}

