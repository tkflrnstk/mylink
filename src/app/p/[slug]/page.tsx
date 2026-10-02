import { notFound } from "next/navigation";
import Link from "next/link";
import { PAGE_DATA } from "@/data/pages";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function generateStaticParams() {
  return Object.keys(PAGE_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGE_DATA[slug];
  if (!page) return {};
  return { title: `${page.title} | MyLink`, description: page.description };
}

export default async function DummyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGE_DATA[slug];
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-tds-fill-weak py-8 sm:py-16 px-3 sm:px-4
                    flex flex-col items-center w-full min-w-0 overflow-x-hidden">
      <div className="w-full max-w-lg flex flex-col gap-4 sm:gap-6 min-w-0">

        {/* 뒤로가기 — body-3/600 / text-secondary → text-brand hover */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5
                     text-[13px] font-semibold leading-[1.25] text-tds-text-secondary
                     hover:text-tds-text-brand transition-colors
                     duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] w-fit"
        >
          <ArrowLeft size={15} />
          메인으로
        </Link>

        {/* 히어로 카드 — TDS Card (radius-xl 16px, shadow-tds-1) */}
        <Card className="w-full min-w-0 overflow-hidden">
          <CardContent className="flex flex-col items-center text-center gap-4 sm:gap-5 p-5 sm:p-8 min-w-0">

            {/* 이모지 — radius-tds-3xl (24px), brand-weak 배경 */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-tds-2xl sm:rounded-tds-3xl flex items-center justify-center text-3xl sm:text-4xl shrink-0"
              style={{ backgroundColor: `${page.color}18` }}
            >
              {page.emoji}
            </div>

            {/* 제목/서브 */}
            <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0 w-full">
              {/* h2: 24px/700/1.30/-0.020em */}
              <h1 className="text-xl sm:text-2xl font-bold leading-[1.30] tracking-[-0.020em]
                             text-tds-text-primary break-words">
                {page.title}
              </h1>
              {/* body-3: 13px / text-secondary */}
              <p className="text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-secondary break-words">
                {page.subtitle}
              </p>
            </div>

            {/* 뱃지 칩 — chip-brand 스타일, 브랜드 고유 색 */}
            <span
              className="inline-flex items-center min-h-[30px] sm:min-h-[34px] py-1 px-3 sm:px-4 rounded-tds-full
                         text-[13px] sm:text-[15px] font-semibold leading-[1.25] tracking-[-0.005em] max-w-full break-words justify-center text-center"
              style={{
                backgroundColor: `${page.color}18`,
                color: page.color,
              }}
            >
              {page.badge}
            </span>

            {/* 구분선 */}
            <hr className="w-full border-tds-border-default" />

            {/* 본문 — body-2: 15px/400/1.50/-0.005em / text-secondary */}
            <p className="text-[14px] sm:text-[15px] leading-[1.50] tracking-[-0.005em]
                          text-tds-text-secondary text-left w-full break-words min-w-0">
              {page.body}
            </p>
          </CardContent>
        </Card>

        {/* 데모 안내 배너 — TDS bg-brand-weak (blue-50) */}
        <div className="bg-tds-bg-brand-weak border border-tds-border-focused/20
                        rounded-tds-xl px-3.5 sm:px-4 py-3 flex items-start gap-2.5 sm:gap-3 min-w-0">
          <span className="text-tds-text-brand text-base sm:text-lg mt-0.5 shrink-0">💡</span>
          <div className="min-w-0">
            {/* label-s: 13px/600 */}
            <p className="text-[12px] sm:text-[13px] font-semibold leading-[1.25] text-tds-text-brand">
              데모 페이지
            </p>
            {/* body-3: 13px / text-secondary */}
            <p className="text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-secondary mt-0.5 break-words">
              이 페이지는 <strong className="text-tds-text-primary">MyLink</strong> 서비스
              시연을 위한 더미 페이지예요. 실제 서비스에서는 각 링크의 외부 URL로 연결돼요.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
