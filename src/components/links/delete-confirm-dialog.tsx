"use client";

import React, { useState } from "react";
import type { LinkItem } from "@/types/link";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  link: LinkItem | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => Promise<void> | void;
}

/**
 * 링크 삭제 확인 모달 (DeleteConfirmDialog) - Base UI Dialog 기반
 */
export function DeleteConfirmDialog({
  isOpen,
  link,
  onClose,
  onConfirmDelete,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!link) return null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsDeleting(true);
      await onConfirmDelete(link.id);
      onClose();
    } catch (error) {
      console.error("링크 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <Dialog.Portal>
        {/* Base UI Backdrop */}
        <Dialog.Backdrop className="fixed inset-0 bg-tds-overlay-scrim backdrop-blur-sm z-50 transition-opacity" />

        {/* Base UI Popup */}
        <Dialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-sm bg-white rounded-tds-2xl shadow-tds-3 p-5 sm:p-6 min-w-0 outline-none">
          {/* 상단 아이콘 및 타이틀 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <Dialog.Title className="text-base sm:text-lg font-bold leading-[1.3] text-tds-text-primary">
              정말 삭제하시겠습니까?
            </Dialog.Title>
          </div>

          {/* 본문: 링크 이름 표시 및 경고 메시지 */}
          <div className="mb-6 space-y-3">
            <div className="p-3 bg-tds-fill-secondary rounded-tds-m flex items-center gap-2.5 min-w-0 border border-tds-border-default">
              <span className="text-xl shrink-0">{link.emoji || "🔗"}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-tds-text-primary truncate">
                  {link.title}
                </p>
                {link.subtitle && (
                  <p className="text-[12px] text-tds-text-secondary truncate">
                    {link.subtitle}
                  </p>
                )}
              </div>
            </div>

            <Dialog.Description className="text-[13px] font-semibold text-red-600 leading-[1.4] flex items-center gap-1">
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </Dialog.Description>
          </div>

          {/* 버튼 영역: [취소] [삭제하기] */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-tds-border-default">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="h-10 px-4 rounded-tds-m bg-tds-fill-secondary hover:bg-tds-grey-200 text-tds-text-primary text-[14px] font-semibold cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-10 px-4 rounded-tds-m bg-red-600 hover:bg-red-700 text-white text-[14px] font-semibold cursor-pointer active:scale-[0.98] flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
            >
              {isDeleting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>삭제 중...</span>
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  <span>삭제하기</span>
                </>
              )}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
