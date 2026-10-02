"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { LinkItem } from "@/types/link";

/* ── Zod 스키마 정의 ───────────────────────────────────── */
const linkFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "제목을 입력해주세요." })
    .min(2, { message: "제목은 최소 2자 이상 입력해주세요." })
    .max(50, { message: "제목은 최대 50자까지 입력 가능합니다." }),
  url: z
    .string()
    .min(1, { message: "주소를 입력해주세요." })
    .refine(
      (val) => {
        const trimmed = val.trim();
        if (!trimmed) return true; // 빈 값은 min(1)에서 처리
        const isRelative = trimmed.startsWith("/");
        const isMailto = trimmed.startsWith("mailto:");
        const hasProtocol = /^https?:\/\//i.test(trimmed);
        const isValidDomain = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/i.test(trimmed);
        return isRelative || isMailto || hasProtocol || isValidDomain;
      },
      { message: "올바른 주소 경로가 아닙니다. (예: https://example.com 또는 /p/github)" }
    ),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  emoji: z.string(),
  badge: z.string(),
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLink: (link: LinkItem) => void;
  editingLink?: LinkItem | null;
}

const PRESET_EMOJIS = ["🔗", "🐙", "📝", "✉️", "💼", "🎨", "🎬", "📄", "💬", "⚡", "🌐", "📱"];
const PRESET_BADGES = ["코드", "기록", "문의", "경력", "포폴", "영상", "SNS", "기타"];

/**
 * TDS Add/Edit Link Dialog — react-hook-form + zod 기반 실시간 검증 다이얼로그
 */
export function AddLinkDialog({ isOpen, onClose, onSaveLink, editingLink }: AddLinkDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    mode: "onChange", // ⚡ 버튼 누르기 전에도 타이핑 실시간 검증
    defaultValues: {
      title: "",
      url: "",
      subtitle: "",
      description: "",
      emoji: "🔗",
      badge: "코드",
    },
  });

  const selectedEmoji = watch("emoji");
  const selectedBadge = watch("badge");

  useEffect(() => {
    if (editingLink) {
      reset({
        title: editingLink.title || "",
        url: editingLink.url || "",
        subtitle: editingLink.subtitle || "",
        description: editingLink.description || "",
        emoji: editingLink.emoji || "🔗",
        badge: editingLink.badge || "기타",
      });
    } else {
      reset({
        title: "",
        url: "",
        subtitle: "",
        description: "",
        emoji: "🔗",
        badge: "코드",
      });
    }
  }, [editingLink, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: LinkFormValues) => {
    let formattedUrl = data.url.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("/") &&
      !formattedUrl.startsWith("mailto:")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const savedLink: LinkItem = {
      id: editingLink ? editingLink.id : `link_${Date.now()}`,
      title: data.title.trim(),
      subtitle: data.subtitle?.trim() || (formattedUrl.startsWith("http") ? formattedUrl.replace(/^https?:\/\//, "") : formattedUrl),
      description: data.description?.trim() || "",
      url: formattedUrl,
      emoji: data.emoji || "🔗",
      badge: data.badge?.trim() || "기타",
      badgeBg: editingLink?.badgeBg || "bg-tds-bg-brand-weak text-tds-text-brand",
    };

    onSaveLink(savedLink);
    onClose();
  };

  const isEditMode = Boolean(editingLink);

  return (
    <div
      className="fixed inset-0 bg-tds-overlay-scrim backdrop-blur-sm z-50
                 flex items-center justify-center p-3 sm:p-4 min-w-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-dialog-title"
    >
      {/* TDS dialog: radius-2xl (20px), shadow-tds-3, 24px inner padding */}
      <div className="w-full max-w-md bg-white rounded-tds-2xl shadow-tds-3 p-4 sm:p-6 max-h-[90vh] overflow-y-auto min-w-0">

        {/* 모달 헤더 */}
        <div className="flex items-center justify-between mb-4 sm:mb-5 min-w-0">
          <h2
            id="link-dialog-title"
            className="text-base sm:text-lg font-semibold leading-[1.45] tracking-[-0.010em]
                       text-tds-text-primary truncate"
          >
            {isEditMode ? "✏️ 링크 수정" : "➕ 새 링크 추가"}
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5 sm:gap-4 min-w-0">

          {/* 제목 */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              링크 제목 <span className="text-tds-text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("title", {
                onChange: () => {
                  const urlVal = watch("url");
                  if (!urlVal || !urlVal.trim()) {
                    trigger("url");
                  }
                },
              })}
              placeholder="예: GitHub 저장소, 내 블로그"
              className={`h-11 sm:h-12 w-full rounded-tds-m border px-3.5 sm:px-4
                         text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                         placeholder:text-tds-text-disabled
                         focus:outline-none focus:bg-white
                         transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] min-w-0
                         ${errors.title
                           ? "border-tds-red-500 bg-red-50/30 focus:ring-2 focus:ring-tds-red-500/20"
                           : "border-tds-border-default bg-tds-fill-secondary focus:border-tds-border-focused focus:ring-2 focus:ring-tds-border-focused/20"
                         }`}
            />
            {errors.title && (
              <p className="text-[12px] font-medium text-tds-text-danger mt-0.5 leading-[1.3]">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* URL */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              URL 주소 <span className="text-tds-text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("url", {
                onChange: () => {
                  const titleVal = watch("title");
                  if (!titleVal || !titleVal.trim()) {
                    trigger("title");
                  }
                },
              })}
              placeholder="예: https://github.com/username 또는 /p/github"
              className={`h-11 sm:h-12 w-full rounded-tds-m border px-3.5 sm:px-4
                         text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                         placeholder:text-tds-text-disabled
                         focus:outline-none focus:bg-white
                         transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] min-w-0
                         ${errors.url
                           ? "border-tds-red-500 bg-red-50/30 focus:ring-2 focus:ring-tds-red-500/20"
                           : "border-tds-border-default bg-tds-fill-secondary focus:border-tds-border-focused focus:ring-2 focus:ring-tds-border-focused/20"
                         }`}
            />
            {errors.url && (
              <p className="text-[12px] font-medium text-tds-text-danger mt-0.5 leading-[1.3]">
                {errors.url.message}
              </p>
            )}
          </div>

          {/* 이모지 선택 */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
              아이콘 이모지
            </label>
            <div className="flex items-center gap-2 min-w-0">
              <input
                type="text"
                {...register("emoji")}
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
                    onClick={() => setValue("emoji", item, { shouldValidate: true })}
                    className={`w-9 h-9 rounded-tds-m flex items-center justify-center text-lg shrink-0
                                transition-all duration-[120ms] cursor-pointer
                                ${selectedEmoji === item ? "bg-tds-bg-brand-weak border border-tds-border-focused scale-105" : "bg-tds-fill-secondary hover:bg-tds-grey-200"}`}
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
              {...register("subtitle")}
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
                  onClick={() => setValue("badge", b, { shouldValidate: true })}
                  className={`px-2.5 py-1 rounded-tds-full text-[12px] font-semibold transition-all cursor-pointer
                              ${selectedBadge === b ? "bg-tds-fill-brand text-white" : "bg-tds-fill-secondary text-tds-text-secondary hover:bg-tds-grey-200"}`}
                >
                  {b}
                </button>
              ))}
            </div>
            <input
              type="text"
              {...register("badge")}
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
              {...register("description")}
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
              {isEditMode ? "저장 💾" : "링크 추가"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
