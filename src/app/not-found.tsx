import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-tds-fill-weak px-4 py-16 flex flex-col items-center justify-center w-full text-center">
      <div className="w-full max-w-[420px] bg-white rounded-tds-2xl p-8 border border-tds-border-default/80 shadow-tds-2 flex flex-col items-center">
        
        {/* 아이콘 */}
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl mb-4 shadow-inner">
          🔍
        </div>

        {/* 타이틀 */}
        <span className="text-[12px] font-bold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full mb-2">
          404 Not Found
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-tds-text-primary tracking-[-0.015em] mb-2">
          사용자를 찾을 수 없습니다
        </h1>
        <p className="text-[13px] sm:text-[14px] text-tds-text-secondary leading-relaxed mb-6 break-keep">
          요청하신 프로필 페이지가 존재하지 않거나, 등록되지 않은 사용자입니다. 주소를 다시 확인해주세요.
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Link
            href="/"
            className="flex-1 h-10 px-4 rounded-tds-m bg-tds-fill-brand hover:bg-tds-blue-600
                       active:scale-[0.98] text-white text-[13px] font-semibold
                       flex items-center justify-center transition-all shadow-sm"
          >
            🏠 홈으로 돌아가기
          </Link>
        </div>

      </div>

      <footer className="mt-8 text-center text-[12px] text-tds-text-disabled">
        © 2026 MyLink · All rights reserved.
      </footer>
    </div>
  );
}
