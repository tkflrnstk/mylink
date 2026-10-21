import React from "react";
import { Link2 } from "lucide-react";

interface LinkAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * 깔끔하고 모던한 "LINK" 원형 프로필 아바타 컴포넌트
 * 메인 프로필 카드(lg), 헤더 드롭다운 팝업(md), 헤더 트리거 버튼(sm)에 동일한 디자인으로 동기화됩니다.
 */
export function LinkAvatar({ size = "lg", className = "" }: LinkAvatarProps) {
  if (size === "sm") {
    // 24px: 헤더 드롭다운 트리거 버튼용
    return (
      <div
        className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700
                   shadow-xs flex items-center justify-center shrink-0 select-none overflow-hidden
                   border border-white/70 relative ${className}`}
        aria-label="LINK 프로필"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/20 pointer-events-none" />
        <Link2 size={13} className="text-white stroke-[2.5] relative z-10" />
      </div>
    );
  }

  if (size === "md") {
    // 36px: 헤더 드롭다운 팝업 내부 프로필용
    return (
      <div
        className={`w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700
                   shadow-sm flex flex-col items-center justify-center shrink-0 select-none overflow-hidden
                   border-2 border-white ring-1 ring-tds-border-default/60 relative ${className}`}
        aria-label="LINK 프로필"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/25 pointer-events-none" />
        <div className="flex flex-col items-center justify-center text-white relative z-10">
          <Link2 size={15} className="stroke-[2.5]" />
          <span className="text-[7.5px] font-black tracking-[0.16em] uppercase leading-none mt-0.5 pl-0.5">
            LINK
          </span>
        </div>
      </div>
    );
  }

  // size === "lg" (기본값): 메인 페이지 프로필 카드용 (80px ~ 96px)
  return (
    <div
      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700
                 shadow-md border-3 border-white ring-2 ring-tds-border-default/80
                 flex items-center justify-center select-none overflow-hidden relative shrink-0 ${className}`}
      aria-label="LINK 프로필"
    >
      {/* 상단 글래스 하이라이트 & 하단 음영 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/25 pointer-events-none" />
      
      <div className="flex flex-col items-center justify-center text-white relative z-10">
        {/* 세련된 원형 아이콘 백드롭 */}
        <div className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center shadow-inner mb-0.5">
          <Link2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.8]" />
        </div>
        {/* 깔끔한 "LINK" 볼드 타이포그래피 (자간 및 중앙 정렬 보정) */}
        <span className="text-[10.5px] sm:text-[11.5px] font-black tracking-[0.20em] text-white uppercase drop-shadow-sm leading-none indent-[0.20em]">
          LINK
        </span>
      </div>
    </div>
  );
}
