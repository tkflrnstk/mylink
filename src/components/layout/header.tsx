"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfileQuery } from "@/hooks/use-user-profile";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, Copy, Check, LogOut, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { LinkAvatar } from "@/components/ui/link-avatar";

export function Header() {
  const router = useRouter();
  const { user, userProfile, loading, signInWithGoogle, logOut } = useAuth();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsActionLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      if (error?.code !== "auth/popup-closed-by-user") {
        console.error("로그인 실패:", error);
        toast.error("Google 로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsActionLoading(true);
      await logOut();
      toast.success("로그아웃되었습니다.", { duration: 1500 });
    } catch (error) {
      console.error("로그아웃 실패:", error);
      toast.error("로그아웃 처리 중 오류가 발생했습니다.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // 현재 내 공개 링크 주소 가져오기 (/{displayName})
  const getMyLinkUrl = () => {
    const base = typeof window !== "undefined" ? window.location.origin : "https://mylink.site";
    return displayName ? `${base}/${encodeURIComponent(displayName)}` : base;
  };

  // '내 링크 주소 복사' 클릭 시 Sonner 토스트 UI 창 (문구: "링크가 복사 되었습니다", 1.5초 후 자동 종료)
  const handleCopyMyLinkWithSonner = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const urlToCopy = getMyLinkUrl();

    // 1. 클립보드에 주소 복사
    if (typeof window !== "undefined" && navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(urlToCopy);
      } catch (err) {
        console.error("클립보드 복사 실패:", err);
      }
    }

    // 2. Sonner 토스트 UI 창 띄우기 (1.5초 후 자동 종료)
    toast.custom(
      (t) => (
        <div className="w-[320px] sm:w-[360px] bg-white border border-tds-border-default rounded-tds-2xl p-3.5 shadow-tds-3 flex flex-col gap-2 animate-in fade-in-50 slide-in-from-top-3 duration-200">
          {/* 상단: 체크 아이콘 & "링크가 복사 되었습니다" & 닫기 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Check size={14} className="stroke-[2.5]" />
              </div>
              <span className="text-[14px] font-bold text-tds-text-primary tracking-[-0.010em]">
                링크가 복사 되었습니다
              </span>
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="w-5 h-5 flex items-center justify-center rounded-tds-s text-tds-text-disabled hover:text-tds-text-primary transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>

          {/* 주소 박스 (디자인 유지) */}
          <div className="flex items-center p-1.5 px-2 bg-tds-fill-secondary rounded-tds-m border border-tds-border-default min-w-0">
            <span className="text-[12px] font-mono text-tds-text-secondary truncate select-all">
              {urlToCopy}
            </span>
          </div>
        </div>
      ),
      {
        duration: 1500, // 1~2초(1.5초) 후 자동 소멸
        id: "my-link-share-toast",
      }
    );
  };

  // TanStack Query 프로필 캐시 구독 (낙관적 업데이트 실시간 동기화)
  const { data: profileQueryData } = useUserProfileQuery(user?.uid);
  const activeProfile = profileQueryData || userProfile;

  // 표시할 사용자 정보 (TanStack Query 최신 캐시 우선 반영)
  const displayName = activeProfile?.displayName || user?.email?.split("@")[0] || user?.displayName || "사용자";
  const userName = activeProfile?.userName || user?.displayName || "홍길동";

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

        {/* 우측: 인증 및 프로필 드롭다운 영역 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="flex items-center gap-2 text-tds-text-disabled text-[13px] animate-pulse">
              <span className="w-4 h-4 rounded-full border-2 border-tds-border-default border-t-tds-fill-brand animate-spin" />
              <span>확인 중...</span>
            </div>
          ) : user ? (
            /* 로그인 상태: Base UI Menu 드롭다운 (계정자 정보, 내 링크 주소 복사, 로그아웃) */
            <>
              {/* 헤더 상단 내 공개 페이지 바로가기 버튼 */}
              <Link
                href={`/${encodeURIComponent(displayName)}`}
                className="hidden xs:inline-flex sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-tds-m bg-white hover:bg-tds-fill-secondary
                           border border-tds-border-default/80 text-tds-text-primary text-[12px] sm:text-[13px] font-semibold
                           transition-all duration-[120ms] shadow-2xs hover:border-tds-border-focused/40 active:scale-[0.98] select-none"
                title="내 공개 페이지 바로가기"
              >
                <span>내 페이지</span>
                <ExternalLink size={12} className="text-tds-text-secondary" />
              </Link>

              <Menu.Root>
                <Menu.Trigger
                  disabled={isActionLoading}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-tds-m bg-tds-fill-secondary hover:bg-tds-grey-200
                             border border-tds-border-default/60 transition-all duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
                             cursor-pointer active:scale-[0.98] outline-none group select-none"
                >
                  <LinkAvatar size="sm" />
                  <span className="text-[13px] sm:text-[14px] font-semibold text-tds-text-primary tracking-[-0.010em] max-w-[120px] sm:max-w-[160px] truncate">
                    {displayName}님
                  </span>
                  <ChevronDown size={14} className="text-tds-text-disabled group-hover:text-tds-text-secondary transition-transform duration-150 shrink-0" />
                </Menu.Trigger>

                <Menu.Portal>
                  <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
                    <Menu.Popup className="w-64 sm:w-72 rounded-tds-xl bg-white p-1.5 shadow-tds-3 border border-tds-border-default outline-none">
                      
                      {/* 1. 계정자 정보 섹션 */}
                      <div className="p-3 bg-tds-fill-secondary/60 rounded-tds-m mb-1 flex items-start gap-3 border border-tds-border-default/40">
                        <LinkAvatar size="md" className="mt-0.5" />
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[14px] font-bold text-tds-text-primary truncate">
                              {displayName}
                            </span>
                            {userName && (
                              <span className="text-[11px] font-normal text-tds-text-secondary bg-white px-1.5 py-0.5 rounded border border-tds-border-default truncate">
                                {userName}
                              </span>
                            )}
                          </div>
                          {user.email && (
                            <span className="text-[12px] text-tds-text-secondary truncate mt-0.5" title={user.email}>
                              {user.email}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-tds-text-disabled truncate mt-1">
                            UID: {user.uid.slice(0, 10)}...
                          </span>
                        </div>
                      </div>

                      {/* 2. 내 개인 페이지 이동 메뉴 아이템 */}
                      <Menu.Item
                        onClick={() => router.push(`/${encodeURIComponent(displayName)}`)}
                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-tds-m text-[13px] font-semibold
                                   text-tds-text-primary hover:bg-tds-fill-secondary transition-colors cursor-pointer outline-none select-none"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ExternalLink size={16} className="text-tds-blue-600 shrink-0" />
                          <span>내 공개 페이지 이동</span>
                        </div>
                        <span className="text-[11px] font-mono text-tds-blue-600 font-normal bg-blue-50 px-1.5 py-0.5 rounded truncate max-w-[90px]">
                          /{displayName}
                        </span>
                      </Menu.Item>

                      {/* 3. 내 링크 주소 복사 메뉴 아이템 (클릭 시 1.5초 토스트 UI 창 팝업) */}
                      <Menu.Item
                        onClick={handleCopyMyLinkWithSonner}
                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-tds-m text-[13px] font-semibold
                                   text-tds-text-primary hover:bg-tds-fill-secondary transition-colors cursor-pointer outline-none select-none"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Copy size={16} className="text-tds-blue-600 shrink-0" />
                          <span>내 링크 주소 복사</span>
                        </div>
                        <span className="text-[11px] text-tds-blue-600 font-normal bg-blue-50 px-1.5 py-0.5 rounded">
                          공유
                        </span>
                      </Menu.Item>

                      {/* 구분선 */}
                      <div className="h-px bg-tds-border-default/60 my-1" />

                      {/* 4. 로그아웃 메뉴 아이템 */}
                      <Menu.Item
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-tds-m text-[13px] font-semibold
                                   text-red-600 hover:bg-red-50 transition-colors cursor-pointer outline-none select-none"
                      >
                        <LogOut size={16} className="text-red-500 shrink-0" />
                        <span>{isActionLoading ? "로그아웃 중..." : "로그아웃"}</span>
                      </Menu.Item>

                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </>
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
