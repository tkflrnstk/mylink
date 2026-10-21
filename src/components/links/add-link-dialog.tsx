"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LinkItem } from "@/types/link";
import { Dialog } from "@base-ui/react/dialog";

import {
  linkFormSchema,
  type LinkFormValues,
  PRESET_EMOJIS,
  PRESET_BADGES,
  formatUrl,
} from "@/components/links/link-form-schema";

export interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLink: (link: LinkItem) => Promise<void> | void;
  editingLink?: LinkItem | null;
}

/**
 * TDS Add/Edit Link Dialog — Base UI Dialog + react-hook-form + zod 기반 실시간 검증 다이얼로그
 */
export function AddLinkDialog({ isOpen, onClose, onSaveLink, editingLink }: AddLinkDialogProps) {
  const [isSaving, setIsSaving] = React.useState(false);

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
        badge: editingLink.badge || "코드",
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

  const handleEmojiSelect = (emoji: string) => {
    setValue("emoji", emoji, { shouldValidate: true, shouldDirty: true });
  };

  const handleBadgeSelect = (badge: string) => {
    setValue("badge", badge, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (values: LinkFormValues) => {
    const formattedUrl = formatUrl(values.url);
    const badgeBg = "bg-tds-bg-brand-weak text-tds-text-brand";

    const savedLink: LinkItem = {
      id: editingLink ? editingLink.id : Date.now().toString(),
      title: values.title.trim(),
      url: formattedUrl,
      subtitle: values.subtitle?.trim() || "",
      description: values.description?.trim() || "",
      emoji: values.emoji || "🔗",
      badge: values.badge,
      badgeBg,
      createdAt: editingLink?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    try {
      setIsSaving(true);
      await onSaveLink(savedLink);
      onClose();
    } catch (err) {
      console.error("링크 저장 중 오류:", err);
      alert("링크를 저장하는 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const isEditMode = Boolean(editingLink);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <Dialog.Portal>
        {/* Base UI Backdrop */}
        <Dialog.Backdrop className="fixed inset-0 bg-tds-overlay-scrim backdrop-blur-sm z-50 transition-opacity" />

        {/* Base UI Popup */}
        <Dialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-white rounded-tds-2xl shadow-tds-3 p-4 sm:p-6 max-h-[90vh] overflow-y-auto min-w-0 outline-none">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-4 sm:mb-5 min-w-0">
              <Dialog.Title className="text-base sm:text-lg font-semibold leading-[1.45] tracking-[-0.010em] text-tds-text-primary truncate">
                {isEditMode ? "✏️ 링크 수정" : "➕ 새 링크 추가"}
              </Dialog.Title>
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 sm:gap-4 min-w-0">
              {/* 제목 (Title) */}
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary flex items-center justify-between">
                  <span>제목 <span className="text-red-500">*</span></span>
                  <span className="text-[11px] text-tds-text-disabled font-normal">2~30자</span>
                </label>
                <input
                  {...register("title")}
                  placeholder="예: 깃허브 저장소, 개인 블로그"
                  className={`h-11 sm:h-12 w-full rounded-tds-m border px-3.5 sm:px-4
                             text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                             placeholder:text-tds-text-disabled
                             focus:outline-none focus:bg-white
                             transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] min-w-0
                             ${errors.title
                               ? "border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                               : "border-tds-border-default bg-tds-fill-secondary focus:border-tds-border-focused focus:ring-2 focus:ring-tds-border-focused/20"
                             }`}
                />
                {errors.title && (
                  <p className="text-[12px] font-medium text-red-500 mt-0.5 leading-tight animate-in fade-in-50">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* URL */}
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary flex items-center justify-between">
                  <span>URL 주소 <span className="text-red-500">*</span></span>
                  <span className="text-[11px] text-tds-text-disabled font-normal">https:// 포함 또는 도메인</span>
                </label>
                <input
                  {...register("url")}
                  onBlur={() => trigger("url")}
                  placeholder="https://github.com 또는 velog.io/@user"
                  className={`h-11 sm:h-12 w-full rounded-tds-m border px-3.5 sm:px-4
                             text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                             placeholder:text-tds-text-disabled
                             focus:outline-none focus:bg-white
                             transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] min-w-0
                             ${errors.url
                               ? "border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                               : "border-tds-border-default bg-tds-fill-secondary focus:border-tds-border-focused focus:ring-2 focus:ring-tds-border-focused/20"
                             }`}
                />
                {errors.url && (
                  <p className="text-[12px] font-medium text-red-500 mt-0.5 leading-tight animate-in fade-in-50">
                    {errors.url.message}
                  </p>
                )}
              </div>

              {/* 이모지 선택 */}
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
                  대표 이모지
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-tds-m bg-tds-fill-secondary border border-tds-border-default">
                  {PRESET_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className={`w-9 h-9 rounded-tds-s text-lg flex items-center justify-center transition-all cursor-pointer
                        ${selectedEmoji === emoji
                          ? "bg-white shadow-sm ring-2 ring-tds-border-focused scale-110"
                          : "hover:bg-white/60 active:scale-95"
                        }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* 카테고리 뱃지 선택 */}
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary">
                  카테고리 뱃지
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-tds-m bg-tds-fill-secondary border border-tds-border-default">
                  {PRESET_BADGES.map((badgeName) => (
                    <button
                      key={badgeName}
                      type="button"
                      onClick={() => handleBadgeSelect(badgeName)}
                      className={`px-2.5 py-1 rounded-tds-full text-[12px] font-semibold transition-all cursor-pointer
                        ${selectedBadge === badgeName
                          ? "bg-tds-fill-brand text-white font-bold scale-105 shadow-sm"
                          : "bg-white text-tds-text-secondary hover:text-tds-text-primary border border-tds-border-default"
                        }`}
                    >
                      {badgeName}
                    </button>
                  ))}
                </div>
              </div>

              {/* 부제목 (Subtitle) */}
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary flex items-center justify-between">
                  <span>부제목 (선택)</span>
                  <span className="text-[11px] text-tds-text-disabled font-normal">최대 40자</span>
                </label>
                <input
                  {...register("subtitle")}
                  placeholder="예: github.com/user, velog.io/@me"
                  className={`h-11 sm:h-12 w-full rounded-tds-m border px-3.5 sm:px-4
                             text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                             placeholder:text-tds-text-disabled
                             focus:outline-none focus:bg-white
                             transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] min-w-0
                             ${errors.subtitle
                               ? "border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                               : "border-tds-border-default bg-tds-fill-secondary focus:border-tds-border-focused focus:ring-2 focus:ring-tds-border-focused/20"
                             }`}
                />
                {errors.subtitle && (
                  <p className="text-[12px] font-medium text-red-500 mt-0.5 leading-tight">
                    {errors.subtitle.message}
                  </p>
                )}
              </div>

              {/* 상세 설명 (Description) */}
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-[13px] font-semibold leading-[1.25] text-tds-text-secondary flex items-center justify-between">
                  <span>상세 설명 (선택)</span>
                  <span className="text-[11px] text-tds-text-disabled font-normal">최대 80자</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  placeholder="링크에 대한 간단한 설명을 남겨주세요."
                  className={`w-full rounded-tds-m border px-3.5 sm:px-4 py-2.5
                             text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em] text-tds-text-primary
                             placeholder:text-tds-text-disabled
                             focus:outline-none focus:bg-white
                             transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                             resize-none min-w-0
                             ${errors.description
                               ? "border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                               : "border-tds-border-default bg-tds-fill-secondary focus:border-tds-border-focused focus:ring-2 focus:ring-tds-border-focused/20"
                             }`}
                />
                {errors.description && (
                  <p className="text-[12px] font-medium text-red-500 mt-0.5 leading-tight">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-tds-border-default mt-1 min-w-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 sm:h-10 px-4 sm:px-5 rounded-tds-m bg-tds-fill-secondary
                             hover:bg-tds-grey-200 text-tds-text-primary
                             text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                             transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                             active:scale-[0.98] cursor-pointer shrink-0"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-9 sm:h-10 px-4 sm:px-5 rounded-tds-m bg-tds-fill-brand
                             hover:bg-tds-blue-600 text-white disabled:opacity-50
                             text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em]
                             transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                             active:scale-[0.98] cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>저장 중...</span>
                    </>
                  ) : isEditMode ? (
                    "저장 💾"
                  ) : (
                    "링크 추가"
                  )}
                </button>
              </div>
            </form>
          </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
