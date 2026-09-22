export default function Home() {
  const links = [
    {
      title: "GitHub (@tkflrnstk)",
      description: "개발 프로젝트와 오픈소스 코드",
      url: "https://github.com/tkflrnstk",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
    },
    {
      title: "Blog / Notes",
      description: "공부 기록과 배운 점 정리",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },
    {
      title: "Contact",
      description: "이메일로 연락하기",
      url: "mailto:contact@example.com",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900" />
      {/* 물결 느낌 블러 장식 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-600/10 rounded-full blur-3xl" />

      <main className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* 프로필 아바타 */}
        <div className="relative mb-6 group">
          <div className="w-28 h-28 rounded-full bg-linear-to-tr from-cyan-400 via-blue-400 to-blue-600 p-[3px] shadow-2xl shadow-blue-900/60 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-blue-950 flex items-center justify-center">
              <span className="text-3xl font-extrabold bg-linear-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent">
                노
              </span>
            </div>
          </div>
          <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-400 border-2 border-blue-950 rounded-full shadow-lg" title="Active" />
        </div>

        {/* 이름 및 뱃지 */}
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            노기훈
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 backdrop-blur-sm">
            ⚓ Navigator &amp; Dev
          </span>
        </div>

        {/* 소개글 */}
        <p className="text-sm text-blue-100/80 max-w-sm leading-relaxed mb-10">
          바다 위에서는 안전한 항로를 이끄는{" "}
          <span className="font-semibold text-white">정부 항해사</span>이자,
          코드 위에서는 바이브 코딩으로 새로운 가능성을 개척하는{" "}
          <span className="font-semibold text-cyan-300">개발자</span> 노기훈입니다. 🌊
        </p>

        {/* 링크 목록 */}
        <div className="w-full flex flex-col gap-3 mb-10">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-cyan-400/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-900/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/10 text-cyan-200 group-hover:bg-cyan-400/20 group-hover:text-cyan-100 transition-colors">
                  {link.icon}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                    {link.title}
                  </div>
                  <div className="text-xs text-blue-200/70">
                    {link.description}
                  </div>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-blue-300/60 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
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
        <footer className="text-xs text-blue-300/50">
          © {new Date().getFullYear()} 노기훈 · MyLink
        </footer>
      </main>
    </div>
  );
}
