"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import linksData from "@/data/links.json";
import { LinkList } from "@/components/links/link-list";
import { AddLinkDialog } from "@/components/links/add-link-dialog";
import { DeleteConfirmDialog } from "@/components/links/delete-confirm-dialog";
import type { LinkItem, CreateLinkInput } from "@/types/link";
import { useAuth } from "@/context/AuthContext";
import {
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  subscribeFirestoreLinks,
  migrateLocalLinksToFirestore,
  getLinksCollectionPath,
} from "@/lib/links";

const DEFAULT_LINKS = linksData as LinkItem[];

export default function LinksPage() {
  const { user, userProfile, loading: authLoading, signInWithGoogle } = useAuth();

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetLink, setDeleteTargetLink] = useState<LinkItem | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setLinks([]);
      return;
    }

    const userId = user.uid;
    const unsubscribe = subscribeFirestoreLinks(
      userId,
      (firestoreLinks) => {
        // 개별 사용자는 처음에는 빈 링크 목록으로 시작 (자동 생성 방지)
        setLinks(firestoreLinks);
      },
      (error) => {
        console.error("Firestore 실시간 연동 에러:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleOpenAddLink = () => {
    setIsLinkDialogOpen(true);
  };

  const handleUpdateLink = async (id: string, updatedData: Partial<CreateLinkInput>) => {
    if (!user) return;
    const now = new Date();
    setLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedData, updatedat: now, updatedAt: now } : item
      )
    );

    try {
      await updateLinkInFirestore(user.uid, id, updatedData);
    } catch (err) {
      console.error("Firestore 링크 수정 실패:", err);
      throw err;
    }
  };

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

  const handleOpenDeleteModal = (link: LinkItem) => {
    setDeleteTargetLink(link);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    if (!user) return;
    setLinks((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteLinkFromFirestore(user.uid, id);
    } catch (err) {
      console.error("Firestore 링크 삭제 실패:", err);
      throw err;
    }
  };

  if (!isMounted) return null;

  if (authLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-2 border-tds-border-default border-t-tds-fill-brand animate-spin mb-3" />
        <p className="text-tds-text-secondary text-[13px]">인증 정보를 확인하는 중...</p>
      </div>
    );
  }

  // 비로그인 상태 안내
  if (!user) {
    return (
      <main className="min-h-screen bg-tds-fill-weak py-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-tds-xl p-8 text-center shadow-tds-1 border border-tds-border-default">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-xl font-bold text-tds-text-primary mb-2">로그인이 필요합니다</h2>
          <p className="text-[14px] text-tds-text-secondary mb-6 break-keep">
            개인 맞춤 링크를 조회하고 관리하려면 먼저 Google 계정으로 로그인해 주세요.
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full h-11 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600 text-white font-semibold text-[14px] transition-all cursor-pointer"
          >
            Google로 로그인
          </button>
        </div>
      </main>
    );
  }

  // displayName은 이메일의 앞부분을 우선 사용
  const currentDisplayName = user.email ? user.email.split("@")[0] : (userProfile?.displayName || user.displayName || "사용자");
  const firestorePath = getLinksCollectionPath(user.uid);

  return (
    <main className="min-h-screen bg-tds-fill-weak py-6 sm:py-10 px-3 sm:px-4 w-full min-w-0 overflow-x-hidden">
      <div className="max-w-lg mx-auto flex flex-col gap-4 sm:gap-6 w-full min-w-0">
        <header className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold leading-[1.30] tracking-[-0.020em] text-tds-text-primary truncate min-w-0">
              🔗 {currentDisplayName}님의 링크 목록
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center h-[30px] sm:h-[34px] px-3 sm:px-4 rounded-tds-full bg-tds-bg-brand-weak text-tds-text-brand text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em] shrink-0">
                {links.length}개
              </span>
              <button
                onClick={handleOpenAddLink}
                className="h-[30px] sm:h-[34px] px-3 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600 text-white text-[13px] sm:text-[14px] font-semibold transition-all cursor-pointer shrink-0"
              >
                + 링크 추가
              </button>
            </div>
          </div>
          <p className="text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-secondary break-words">
            Firestore 경로: <code className="font-mono text-tds-text-brand bg-white px-1 py-0.5 rounded border border-tds-border-default">{firestorePath}</code>
          </p>
          <hr className="border-tds-border-default" />
        </header>

        {links.length === 0 ? (
          <div className="bg-white rounded-tds-xl p-8 text-center border border-dashed border-tds-border-default flex flex-col items-center gap-3">
            <span className="text-3xl">📭</span>
            <p className="text-[14px] font-semibold text-tds-text-primary">등록된 링크가 없습니다.</p>
            <p className="text-[12px] text-tds-text-secondary">&apos;+ 링크 추가&apos; 버튼으로 새로운 링크를 만들어보세요!</p>
          </div>
        ) : (
          <LinkList
            links={links}
            onUpdate={handleUpdateLink}
            onDelete={handleOpenDeleteModal}
          />
        )}

        <footer className="text-center text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-disabled pt-2 break-words">
          © 2026 {currentDisplayName} · MyLink
        </footer>
      </div>

      <AddLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSaveLink={handleSaveLink}
        editingLink={null}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        link={deleteTargetLink}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeleteTargetLink(null);
        }}
        onConfirmDelete={handleConfirmDelete}
      />
    </main>
  );
}
