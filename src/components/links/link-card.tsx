"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowRight, Trash2, Pencil, Check, X, Clock } from "lucide-react";
import { cn, formatUpdatedAt } from "@/lib/utils";
import type { LinkItem, CreateLinkInput } from "@/types/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  linkFormSchema,
  type LinkFormValues,
  PRESET_EMOJIS,
  PRESET_BADGES,
  formatUrl,
} from "@/components/links/link-form-schema";

interface LinkCardProps {
  link: LinkItem;
  /** 카드 전체에 추가할 Tailwind 클래스 */
  className?: string;
  /** 링크 수정 핸들러 (인라인 저장 완료 시 Firestore 업데이트) */
  onUpdate?: (id: string, updatedData: Partial<CreateLinkInput>) => Promise<void> | void;
  /** 링크 삭제 트리거 (모달 열기) */
  onDelete?: (link: LinkItem) => void;
  /** 읽기 전용 모드 (공개 링크 뷰 등) */
  readOnly?: boolean;
}

/**
 * TDS LinkCard — 인라인 편집 및 상시 표시 수정/삭제 버튼 지원
 */
export function LinkCard({ link, className, onUpdate, onDelete, readOnly = false }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isExternal = link.url.startsWith("http");
  const formattedUpdatedAt = formatUpdatedAt(link.updatedat || link.updatedAt);

  // 인라인 편집 폼 설정 (추가할 때와 동일한 검증 스키마 및 mode: "onChange")
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
    mode: "onChange",
    defaultValues: {
      title: link.title || "",
      url: link.url || "",
      subtitle: link.subtitle || "",
      description: link.description || "",
      emoji: link.emoji || "🔗",
      badge: link.badge || "기타",
    },
  });

  const selectedEmoji = watch("emoji");
  const selectedBadge = watch("badge");

  // 수정 모드 진입
  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    reset({
      title: link.title || "",
      url: link.url || "",
      subtitle: link.subtitle || "",
      description: link.description || "",
      emoji: link.emoji || "🔗",
      badge: link.badge || "기타",
    });
    setIsEditing(true);
  };

  // 인라인 수정 취소
  const handleCancelEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    reset();
    setIsEditing(false);
  };

  // 인라인 수정 저장 (Firebase 연동)
  const onSubmit = async (data: LinkFormValues) => {
    if (!onUpdate) return;
    const formattedUrl = formatUrl(data.url);

    try {
      setIsSaving(true);
      await onUpdate(link.id, {
        title: data.title.trim(),
        url: formattedUrl,
        subtitle:
          data.subtitle?.trim() ||
          (formattedUrl.startsWith("http")
            ? formattedUrl.replace(/^https?:\/\//, "")
            : formattedUrl),
        description: data.description?.trim() || "",
        emoji: data.emoji || "🔗",
        badge: data.badge?.trim() || "기타",
        badgeBg: link.badgeBg || "bg-tds-bg-brand-weak text-tds-text-brand",
      });
      setIsEditing(false);
    } catch (err) {
      console.error("인라인 링크 수정 실패:", err);
      alert("링크를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // 1. 인라인 편집 모드 UI
  if (isEditing) {
    return (
      <Card
        className={cn(
          "p-4 border-2 border-tds-border-focused bg-white shadow-tds-2 rounded-tds-xl transition-all",
          className
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between border-b border-tds-border-default pb-2">
            <span className="text-[14px] font-bold text-tds-text-primary flex items-center gap-1.5">
              <span>✏️</span> 링크 인라인 수정
            </span>
            <span className="text-[12px] text-tds-text-disabled flex items-center gap-1">
              {formattedUpdatedAt && (
                <>
                  <Clock size={11} className="text-tds-grey-400" />
                  <span>Updated at {formattedUpdatedAt}</span>
                </>
              )}
            </span>
          </div>

          {/* 제목 입력 */}
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[12px] font-semibold text-tds-text-secondary">
              링크 제목 <span className="text-tds-text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("title", {
                onChange: () => {
                  const urlVal = watch("url");
                  if (!urlVal || !urlVal.trim()) trigger("url");
                },
              })}
              placeholder="예: GitHub 저장소"
              className={`h-9 w-full rounded-tds-m border px-3 text-[14px] text-tds-text-primary
                         focus:outline-none focus:bg-white transition-all
                         ${
                           errors.title
                             ? "border-tds-red-500 bg-red-50/30 focus:ring-2 focus:ring-tds-red-500/20"
                             : "border-tds-border-default bg-tds-fill-secondary focus:border-tds-border-focused focus:ring-2 focus:ring-tds-border-focused/20"
                         }`}
            />
            {errors.title && (
              <p className="text-[11px] font-medium text-tds-text-danger leading-[1.2]">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* URL 입력 */}
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[12px] font-semibold text-tds-text-secondary">
              URL 주소 <span className="text-tds-text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("url", {
                onChange: () => {
                  const titleVal = watch("title");
                  if (!titleVal || !titleVal.trim()) trigger("title");
                },
              })}
              placeholder="예: https://github.com 또는 /p/github"
              className={`h-9 w-full rounded-tds-m border px-3 text-[14px] text-tds-text-primary
                         focus:outline-none focus:bg-white transition-all
                         ${
                           errors.url
                             ? "border-tds-red-500 bg-red-50/30 focus:ring-2 focus:ring-tds-red-500/20"
                             : "border-tds-border-default bg-tds-fill-secondary focus:border-tds-border-focused focus:ring-2 focus:ring-tds-border-focused/20"
                         }`}
            />
            {errors.url && (
              <p className="text-[11px] font-medium text-tds-text-danger leading-[1.2]">
                {errors.url.message}
              </p>
            )}
          </div>

          {/* 이모지 및 뱃지 영역 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0">
            {/* 이모지 */}
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-[12px] font-semibold text-tds-text-secondary">
                아이콘 이모지
              </label>
              <div className="flex items-center gap-1.5 min-w-0">
                <input
                  type="text"
                  {...register("emoji")}
                  maxLength={4}
                  className="h-9 w-12 text-center rounded-tds-m border border-tds-border-default bg-tds-fill-secondary text-base shrink-0 focus:outline-none focus:bg-white focus:border-tds-border-focused"
                />
                <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none min-w-0">
                  {PRESET_EMOJIS.slice(0, 6).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setValue("emoji", item, { shouldValidate: true })}
                      className={`w-7 h-7 rounded-tds-m flex items-center justify-center text-sm shrink-0 transition-all cursor-pointer ${
                        selectedEmoji === item
                          ? "bg-tds-bg-brand-weak border border-tds-border-focused scale-105"
                          : "bg-tds-fill-secondary hover:bg-tds-grey-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 뱃지 */}
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-[12px] font-semibold text-tds-text-secondary">
                카테고리 뱃지
              </label>
              <div className="flex items-center gap-1.5 min-w-0">
                <input
                  type="text"
                  {...register("badge")}
                  placeholder="카테고리"
                  className="h-9 w-24 rounded-tds-m border border-tds-border-default bg-tds-fill-secondary px-2 text-[13px] text-tds-text-primary focus:outline-none focus:bg-white focus:border-tds-border-focused shrink-0"
                />
                <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none min-w-0">
                  {PRESET_BADGES.slice(0, 4).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setValue("badge", b, { shouldValidate: true })}
                      className={`px-2 py-0.5 rounded-tds-full text-[11px] font-semibold shrink-0 cursor-pointer transition-all ${
                        selectedBadge === b
                          ? "bg-tds-fill-brand text-white"
                          : "bg-tds-fill-secondary text-tds-text-secondary hover:bg-tds-grey-200"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 서브타이틀 및 설명 (옵션) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0">
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-[12px] font-semibold text-tds-text-secondary">
                서브타이틀 (선택)
              </label>
              <input
                type="text"
                {...register("subtitle")}
                placeholder="예: @username"
                className="h-9 w-full rounded-tds-m border border-tds-border-default bg-tds-fill-secondary px-3 text-[13px] text-tds-text-primary focus:outline-none focus:bg-white focus:border-tds-border-focused"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-[12px] font-semibold text-tds-text-secondary">
                상세 설명 (선택)
              </label>
              <input
                type="text"
                {...register("description")}
                placeholder="간단한 설명"
                className="h-9 w-full rounded-tds-m border border-tds-border-default bg-tds-fill-secondary px-3 text-[13px] text-tds-text-primary focus:outline-none focus:bg-white focus:border-tds-border-focused"
              />
            </div>
          </div>

          {/* 인라인 수정 액션 버튼: [취소] [저장] */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-tds-border-default mt-1">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="h-8 px-3 rounded-tds-m bg-tds-fill-secondary hover:bg-tds-grey-200
                         text-tds-text-primary text-[13px] font-semibold transition-all
                         cursor-pointer active:scale-[0.98] flex items-center gap-1"
            >
              <X size={14} />
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-8 px-3.5 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600
                         text-white text-[13px] font-semibold transition-all
                         cursor-pointer active:scale-[0.98] flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>저장</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    );
  }

  // 2. 기본 링크 카드 UI (수정/삭제 버튼 항상 표시)
  return (
    <Card
      className={cn(
        "group relative transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        "hover:shadow-tds-2 hover:border-tds-border-focused/30 rounded-tds-xl overflow-hidden",
        className
      )}
    >
      <CardContent className="p-3.5 sm:p-4 min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {/* 전체 카드 링크 클릭 영역 (왼쪽 아이콘 + 텍스트) */}
          <a
            href={link.url}
            target={isExternal ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={`${link.title} 바로가기`}
            className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-tds-border-focused rounded-tds-m"
          >
            {/* 이모지 아이콘 — radius-m (12px), fill-secondary → bg-brand-weak */}
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-tds-m",
                "bg-tds-fill-secondary group-hover:bg-tds-bg-brand-weak",
                "flex items-center justify-center text-xl sm:text-2xl",
                "transition-colors duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              )}
            >
              {link.emoji || "🔗"}
            </div>

            {/* 텍스트 영역 */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                <span
                  className={cn(
                    "font-semibold text-sm sm:text-[15px] leading-[1.25] tracking-[-0.005em]",
                    "text-tds-text-primary truncate min-w-0 max-w-full",
                    "group-hover:text-tds-text-brand",
                    "transition-colors duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  )}
                >
                  {link.title}
                </span>
                {link.badge && (
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[11px] sm:text-[12px] px-2 py-0.5 max-w-full truncate"
                  >
                    {link.badge}
                  </Badge>
                )}
              </div>

              {link.subtitle && (
                <p className="text-[12px] sm:text-[13px] leading-[1.40] text-tds-grey-600 mt-0.5 truncate min-w-0">
                  {link.subtitle}
                </p>
              )}

              {link.description && (
                <p className="text-[12px] sm:text-[13px] leading-[1.40] text-tds-text-disabled mt-0.5 line-clamp-1 break-words min-w-0">
                  {link.description}
                </p>
              )}

              {/* 수정된 시각 (Updated at) */}
              {formattedUpdatedAt && (
                <div className="flex items-center gap-1 mt-1 text-[11px] leading-[1.25] text-tds-text-disabled">
                  <Clock size={11} className="shrink-0 text-tds-grey-400" />
                  <span className="truncate">Updated at {formattedUpdatedAt}</span>
                </div>
              )}
            </div>
          </a>

          {/* 우측 액션 영역: 바로가기 화살표 및 편집 모드 시 [수정], [삭제] */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1 border-l border-tds-border-default/60">
            {!readOnly && onUpdate && (
              <button
                type="button"
                onClick={handleStartEdit}
                aria-label={`${link.title} 수정`}
                title="링크 수정 (인라인)"
                className="inline-flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-tds-m
                           bg-tds-fill-secondary hover:bg-blue-50 text-tds-text-secondary hover:text-tds-text-brand
                           border border-tds-border-default hover:border-tds-border-focused/40
                           transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                           cursor-pointer active:scale-[0.96] text-[12px] font-semibold shrink-0"
              >
                <Pencil size={13} className="text-tds-text-brand" />
                <span className="hidden xs:inline sm:inline">수정</span>
              </button>
            )}

            {/* 항상 표시되는 삭제 버튼 (읽기 전용이 아닐 때) */}
            {!readOnly && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(link);
                }}
                aria-label={`${link.title} 삭제`}
                title="링크 삭제"
                className="inline-flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-tds-m
                           bg-tds-fill-secondary hover:bg-red-50 text-tds-text-secondary hover:text-tds-text-danger
                           border border-tds-border-default hover:border-red-200
                           transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                           cursor-pointer active:scale-[0.96] text-[12px] font-semibold shrink-0"
              >
                <Trash2 size={13} className="text-tds-text-danger" />
                <span className="hidden xs:inline sm:inline">삭제</span>
              </button>
            )}

            {/* 바로가기 아이콘 (외부/내부 링크 표시) */}
            <a
              href={link.url}
              target={isExternal ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={`${link.title} 새 창 열기`}
              className="p-1 text-tds-text-disabled hover:text-tds-text-brand transition-colors shrink-0"
            >
              {isExternal ? <ExternalLink size={15} /> : <ArrowRight size={15} />}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
