"use client";

import React, { useState, useEffect } from "react";
import linksData from "@/data/links.json";
import { LinkList } from "@/components/links/link-list";
import { AddLinkDialog } from "@/components/links/add-link-dialog";
import type { LinkItem } from "@/types/link";

const DEFAULT_LINKS = linksData as LinkItem[];
const LOCAL_STORAGE_LINKS_KEY = "mylink_demo_links_v1";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_LINKS);
  const [isMounted, setIsMounted] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLinks = localStorage.getItem(LOCAL_STORAGE_LINKS_KEY);
      if (savedLinks) {
        setLinks(JSON.parse(savedLinks));
      } else {
        localStorage.setItem(LOCAL_STORAGE_LINKS_KEY, JSON.stringify(DEFAULT_LINKS));
      }
    } catch (e) {
      console.error("LocalStorage load links error:", e);
    }
  }, []);

  const handleOpenAddLink = () => {
    setEditingLink(null);
    setIsLinkDialogOpen(true);
  };

  const handleOpenEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setIsLinkDialogOpen(true);
  };

  const handleSaveLink = (savedLink: LinkItem) => {
    let updatedLinks: LinkItem[];
    const exists = links.some((item) => item.id === savedLink.id);

    if (exists) {
      updatedLinks = links.map((item) => (item.id === savedLink.id ? savedLink : item));
    } else {
      updatedLinks = [savedLink, ...links];
    }

    setLinks(updatedLinks);
    try {
      localStorage.setItem(LOCAL_STORAGE_LINKS_KEY, JSON.stringify(updatedLinks));
    } catch (e) {
      console.error("LocalStorage save links error:", e);
    }
  };

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
    <main className="min-h-screen bg-tds-fill-weak py-6 sm:py-10 px-3 sm:px-4 w-full min-w-0 overflow-x-hidden">
      <div className="max-w-lg mx-auto flex flex-col gap-4 sm:gap-6 w-full min-w-0">

        {/* 헤더 — TDS h2 + chip-brand */}
        <header className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 min-w-0">
            {/* h2: 24px/700/1.30/-0.020em */}
            <h1 className="text-xl sm:text-2xl font-bold leading-[1.30] tracking-[-0.020em]
                           text-tds-text-primary truncate min-w-0">
              🔗 링크 목록
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center h-[30px] sm:h-[34px] px-3 sm:px-4 rounded-tds-full
                               bg-tds-bg-brand-weak text-tds-text-brand
                               text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em] shrink-0">
                {links.length}개
              </span>
              <button
                onClick={handleOpenAddLink}
                className="h-[30px] sm:h-[34px] px-3 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600
                           text-white text-[13px] sm:text-[14px] font-semibold transition-all cursor-pointer shrink-0"
              >
                + 링크 추가
              </button>
            </div>
          </div>
          {/* body-3: 13px/1.50 / text-secondary */}
          <p className="text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-secondary break-words">
            노기훈의 주요 링크를 모아뒀어요. 클릭해서 바로 이동하세요.
          </p>
          {/* 구분선 — border-default */}
          <hr className="border-tds-border-default" />
        </header>

        {/* 링크 목록 */}
        <LinkList
          links={links}
          onEdit={handleOpenEditLink}
          onDelete={handleDeleteLink}
        />

        {/* 푸터 — body-3 / text-disabled */}
        <footer className="text-center text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-disabled pt-2 break-words">
          © 2026 노기훈 · MyLink
        </footer>

      </div>

      {/* 새 링크 추가 / 수정 다이얼로그 */}
      <AddLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSaveLink={handleSaveLink}
        editingLink={editingLink}
      />
    </main>
  );
}
