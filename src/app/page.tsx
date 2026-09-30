export default function Home() {
  const links = [
    {
      title: "GitHub (@tkflrnstk)",
      description: "개발 프로젝트와 오픈소스 코드",
      url: "https://github.com/tkflrnstk",
      emoji: "🐙",
    },
    {
      title: "Blog / Notes",
      description: "공부 기록과 배운 점 정리",
      url: "#",
      emoji: "📝",
    },
    {
      title: "Contact",
      description: "이메일로 연락하기",
      url: "mailto:contact@example.com",
      emoji: "✉️",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-16 overflow-hidden">
      {/* ───── 배경 레이어 ───── */}
      <div className="absolute inset-0 bg-linear-to-b from-[#020c1b] via-[#0a1f3d] to-[#0c2d5a]" />

      {/* 빛나는 파도 오브 장식들 */}
      <div className="absolute top-[-15%] left-[-8%] w-[520px] h-[520px] rounded-full bg-sky-500/15 blur-[100px] animate-float" />
      <div className="absolute bottom-[-12%] right-[-6%] w-[440px] h-[440px] rounded-full bg-blue-600/20 blur-[100px] animate-float-slow" />
      <div className="absolute top-[30%] right-[10%] w-[200px] h-[200px] rounded-full bg-cyan-400/10 blur-[80px] animate-shimmer" />
      <div className="absolute bottom-[25%] left-[5%] w-[260px] h-[260px] rounded-full bg-teal-500/10 blur-[90px] animate-float" />

      {/* 별 느낌의 미세 점 */}
      <div className="absolute top-[18%] left-[22%] w-1 h-1 rounded-full bg-white/30 animate-shimmer" />
      <div className="absolute top-[12%] right-[30%] w-0.5 h-0.5 rounded-full bg-cyan-200/40 animate-shimmer" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[35%] left-[60%] w-1 h-1 rounded-full bg-sky-300/25 animate-shimmer" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[45%] left-[12%] w-0.5 h-0.5 rounded-full bg-white/20 animate-shimmer" style={{ animationDelay: "0.5s" }} />

      {/* ───── 메인 컨텐츠 ───── */}
      <main className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">

        {/* 프로필 아바타 */}
        <div className="relative mb-7 group">
          {/* 아바타 글로우 링 */}
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-linear-to-tr from-cyan-400 via-sky-400 to-blue-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
          <div className="relative w-32 h-32 rounded-full bg-linear-to-tr from-cyan-400 via-sky-400 to-blue-500 p-[3px] shadow-2xl shadow-cyan-900/50 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#0a1f3d] flex items-center justify-center">
              <span className="text-4xl font-black bg-linear-to-br from-cyan-200 via-sky-200 to-blue-200 bg-clip-text text-transparent select-none">
                노
              </span>
            </div>
          </div>
          {/* 활동 상태 인디케이터 */}
          <div className="absolute bottom-1.5 right-1.5">
            <span className="absolute w-5 h-5 rounded-full bg-emerald-400/60 animate-pulse-ring" />
            <span className="relative block w-5 h-5 rounded-full bg-emerald-400 border-[3px] border-[#0a1f3d] shadow-lg shadow-emerald-500/40" />
          </div>
        </div>

        {/* 이름 */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 drop-shadow-[0_0_20px_rgba(56,189,248,0.15)]">
          노기훈
        </h1>

        {/* 뱃지 */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 backdrop-blur-md shadow-lg shadow-cyan-900/20">
            ⚓ 정부 항해사
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-400/15 text-blue-300 border border-blue-400/30 backdrop-blur-md shadow-lg shadow-blue-900/20">
            💻 개발자
          </span>
        </div>

        {/* 소개글 */}
        <p className="text-[15px] text-blue-100/70 max-w-xs leading-relaxed mb-10">
          바다 위에서는 안전한 항로를 개척하고,{" "}
          코드 위에서는 바이브 코딩으로 새로운 가능성을 항해합니다.
          <span className="inline-block ml-1">🌊</span>
        </p>

        {/* 구분선 */}
        <div className="w-16 h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent mb-10" />

        {/* 링크 카드 목록 */}
        <div className="w-full flex flex-col gap-3 mb-12">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.06] backdrop-blur-lg border border-white/[0.1] hover:bg-white/[0.12] hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/40 transition-all duration-300"
            >
              {/* 호버시 글로우 효과 */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.08] text-xl group-hover:bg-cyan-400/15 group-hover:scale-110 transition-all duration-300">
                {link.emoji}
              </div>
              <div className="relative text-left flex-1">
                <div className="text-[15px] font-semibold text-white group-hover:text-cyan-200 transition-colors duration-200">
                  {link.title}
                </div>
                <div className="text-xs text-blue-200/50 mt-0.5">
                  {link.description}
                </div>
              </div>
              <svg
                className="relative w-4 h-4 text-white/20 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        {/* 푸터 */}
        <footer className="flex flex-col items-center gap-2">
          <div className="w-8 h-px bg-linear-to-r from-transparent via-blue-400/30 to-transparent" />
          <p className="text-[11px] text-blue-300/30 tracking-wide">
            © {new Date().getFullYear()} 노기훈 · MyLink
          </p>
        </footer>
      </main>
    </div>
  );
}
