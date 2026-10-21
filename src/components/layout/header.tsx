"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, userProfile, loading, signInWithGoogle, logOut } = useAuth();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsActionLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      // 팝업 닫힘 에러 등은 제외하고 알림
      if (error?.code !== "auth/popup-closed-by-user") {
        console.error("로그인 실패:", error);
        alert("Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsActionLoading(true);
      await logOut();
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // 표시할 사용자 이름 (이메일 앞부분 우선 사용)
  const displayName = user?.email?.split("@")[0] || userProfile?.displayName || user?.displayName || "사용자";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-tds-border-default/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 sm:h-16 max-w-4xl items-center justify-between px-3 sm:px-6">
        {/* 좌측: 로고 및 타이틀 */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform duration-150 active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-tds-m bg-tds-bg-brand-weak flex items-center justify-center text-lg shadow-sm">
            🔗
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] text-tds-text-primary group-hover:text-tds-blue-600 transition-colors">
              MyLink
            </span>
          </div>
        </Link>

        {/* 우측: 인증 영역 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="flex items-center gap-2 text-tds-text-disabled text-[13px] animate-pulse">
              <span className="w-4 h-4 rounded-full border-2 border-tds-border-default border-t-tds-fill-brand animate-spin" />
              <span>확인 중...</span>
            </div>
          ) : user ? (
            /* 로그인 상태: "홍길동님" + "로그아웃" 버튼 */
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-tds-m bg-tds-fill-secondary border border-tds-border-default/50">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="w-6 h-6 rounded-full object-cover shrink-0 border border-white"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-tds-bg-brand-weak text-tds-text-brand text-[12px] font-bold flex items-center justify-center shrink-0">
                    {displayName.charAt(0)}
                  </div>
                )}
                <span className="text-[13px] sm:text-[14px] font-semibold text-tds-text-primary tracking-[-0.010em] max-w-[100px] sm:max-w-[150px] truncate">
                  {displayName}님
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isActionLoading}
                className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-tds-m bg-tds-fill-secondary hover:bg-tds-grey-200
                           text-tds-text-secondary hover:text-tds-text-primary text-[12px] sm:text-[13px] font-semibold
                           transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                           active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isActionLoading ? "처리 중..." : "로그아웃"}
              </button>
            </div>
          ) : (
            /* 로그아웃 상태: "Google로 로그인" 버튼 */
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isActionLoading}
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-tds-m bg-white hover:bg-tds-fill-secondary
                         border border-tds-border-default text-tds-text-primary text-[12px] sm:text-[13px] font-semibold
                         shadow-sm hover:shadow transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                         active:scale-[0.98] cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>{isActionLoading ? "로그인 중..." : "Google로 로그인"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
