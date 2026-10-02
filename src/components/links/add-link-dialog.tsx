"use client";

import React, { useState } from "react";
import type { LinkItem } from "@/types/link";

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (newLink: LinkItem) => void;
}

const PRESET_EMOJIS = ["🔗", "🐙", "📝", "✉️", "💼", "🎨", "🎬", "📄", "💬", "⚡", "🌐", "📱"];
const PRESET_BADGES = ["코드", "기록", "문의", "경력", "포폴", "영상", "SNS", "기타"];

/**
 * TDS AddLinkDialog — 링크 추가 모달 컴포넌트
 *
 * - 다이얼로그 모달 구조: TDS radius-2xl (20px), shadow-tds-3, overlay-scrim
 * - 로컬 상태 기반 입력 폼
 */
export function AddLinkDialog({ isOpen, onClose, onAddLink }: AddLinkDialogProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🔗");
  const [badge, setBadge] = useState("추가");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    // URL 프로토콜 보정 (http/https 또는 상대경로가 아닌 경우 https:// 붙이기)
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("/") && !formattedUrl.startsWith("mailto:")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink: LinkItem = {
      id: `link_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || (formattedUrl.startsWith("http") ? formattedUrl.replace(/^https?:\/\//, "") : formattedUrl),
      description: description.trim(),
      url: formattedUrl,
      emoji: emoji || "🔗",
      badge: badge.trim() || "기타",
      badgeBg: "bg-tds-bg-brand-weak text-tds-text-brand",
    };

    onAddLink(newLink);

    // Reset form
    setTitle("");
    setUrl("");
    setSubtitle("");
    setDescription("");
    setEmoji("🔗");
    setBadge("추가");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-tds-overlay-scrim backdrop-blur-sm z-50
                 flex items-center justify-center p-3 sm:p-4 min-w-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-link-title"
    >
      {/* TDS dialog: radius-2xl (20px), shadow-tds-3, 24px inner padding */}
      <div className="w-full max-w-md bg-white rounded-tds-2xl shadow-tds-3 p-4 sm:p-6 max-h-[90vh] overflow-y-auto min-w-0">

        {/* 모달 헤더 */}
        <div className="flex items-center justify-between mb-4 sm:mb-5 min-w-0">
          <h2
            id="add-link-title"
            className="text-base sm:text-lg font-semibold leading-[1.45] tracking-[-0.010em]
                       text-tds-text-primary truncate"
          >
            ➕ 새 링크 추가
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 flex items-center justify-center rounded-tds-s
                       text-tds-text-disabled hover:text-tds-text-primary
                       hover:bg-tds-fill-secondary
                       transition-colors duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                       cursor-pointer text-lg shrink-0"
          >
            ✕
          </button>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4 min-w-0">

          {/* 제목 */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              링크 제목 <span className="text-tds-text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: GitHub 저장소, 내 블로그"
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

          {/* URL */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              URL 주소 <span className="text-tds-text-danger">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="예: https://github.com/username 또는 /p/github"
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

          {/* 이모지 선택 */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              아이콘 이모지
            </label>
            <div className="flex items-center gap-2 min-w-0">
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                className="h-11 sm:h-12 w-16 text-center rounded-tds-m border border-tds-border-default
                           bg-tds-fill-secondary text-xl
                           focus:outline-none focus:bg-white focus:border-tds-border-focused
                           transition-all duration-[200ms] shrink-0"
              />
              <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none min-w-0">
                {PRESET_EMOJIS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEmoji(item)}
                    className={`w-9 h-9 rounded-tds-m flex items-center justify-center text-lg shrink-0
                                transition-all duration-[120ms] cursor-pointer
                                ${emoji === item ? "bg-tds-bg-brand-weak border border-tds-border-focused scale-105" : "bg-tds-fill-secondary hover:bg-tds-grey-200"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 서브타이틀 */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              서브타이틀 <span className="text-[11px] font-normal text-tds-text-disabled">(선택)</span>
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="예: @username, blog.mylink.dev"
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

          {/* 뱃지 */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              카테고리 뱃지 <span className="text-[11px] font-normal text-tds-text-disabled">(선택)</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 min-w-0 mb-1">
              {PRESET_BADGES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBadge(b)}
                  className={`px-2.5 py-1 rounded-tds-full text-[12px] font-semibold transition-all cursor-pointer
                              ${badge === b ? "bg-tds-fill-brand text-white" : "bg-tds-fill-secondary text-tds-text-secondary hover:bg-tds-grey-200"}`}
                >
                  {b}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="직접 입력 (예: 개발, 소셜)"
              className="h-10 w-full rounded-tds-m border border-tds-border-default
                         bg-tds-fill-secondary px-3.5 sm:px-4
                         text-[13px] sm:text-[14px] text-tds-text-primary
                         placeholder:text-tds-text-disabled
                         focus:outline-none focus:bg-white focus:border-tds-border-focused
                         transition-all duration-[200ms] min-w-0"
            />
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              상세 설명 <span className="text-[11px] font-normal text-tds-text-disabled">(선택)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 프로젝트 소스 코드 및 오픈소스 활동 모음"
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

          {/* 하단 액션 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-tds-border-default mt-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-tds-m bg-tds-fill-secondary
                         hover:bg-tds-grey-200 text-tds-text-primary
                         text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                         transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                         active:scale-[0.98] cursor-pointer shrink-0"
            >
              취소
            </button>
            <button
              type="submit"
              className="h-9 sm:h-10 px-4 sm:px-5 rounded-tds-m bg-tds-fill-brand
                         hover:bg-tds-blue-600 text-white
                         text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                         transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                         active:scale-[0.98] cursor-pointer shrink-0"
            >
              링크 추가
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
