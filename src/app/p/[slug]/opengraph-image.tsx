import { ImageResponse } from "next/og";
import { PAGE_DATA } from "@/data/pages";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const page = PAGE_DATA[slug] || {
    emoji: "🔗",
    title: "마이링크 상세 페이지",
    subtitle: slug,
    description: "나만의 맞춤 링크 상세 정보",
    badge: "링크",
    color: "#3182F6",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8FAFC",
          backgroundImage: `radial-gradient(circle at 10% 20%, ${page.color}25 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 45%)`,
          fontFamily:
            'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: "relative",
          padding: "50px",
        }}
      >
        {/* 메인 카드 */}
        <div
          style={{
            width: "100%",
            maxWidth: "920px",
            backgroundColor: "#FFFFFF",
            borderRadius: "36px",
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "52px 64px",
            textAlign: "center",
          }}
        >
          {/* 상단 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 18px",
              borderRadius: "999px",
              backgroundColor: `${page.color}15`,
              border: `1px solid ${page.color}30`,
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 800, color: page.color }}>
              {page.badge} · MyLink
            </span>
          </div>

          {/* 대형 이모지 서클 */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "30px",
              backgroundColor: `${page.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              marginBottom: "20px",
              boxShadow: "0 10px 20px -5px rgba(0,0,0,0.06)",
            }}
          >
            {page.emoji}
          </div>

          {/* 타이틀 */}
          <h1
            style={{
              fontSize: "46px",
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              margin: "0 0 10px 0",
            }}
          >
            {page.title}
          </h1>

          {/* 서브타이틀 */}
          <span
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: page.color,
              marginBottom: "16px",
            }}
          >
            {page.subtitle}
          </span>

          {/* 설명 */}
          <p
            style={{
              fontSize: "18px",
              color: "#64748B",
              fontWeight: 500,
              lineHeight: 1.5,
              margin: "0",
              maxWidth: "640px",
            }}
          >
            {page.description}
          </p>
        </div>

        {/* 하단 푸터 바 */}
        <div
          style={{
            position: "absolute",
            bottom: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "920px",
            padding: "0 10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                backgroundColor: "#3182F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 800,
              }}
            >
              M
            </div>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A" }}>
              MyLink
            </span>
          </div>
          <span style={{ fontSize: "14px", color: "#94A3B8", fontWeight: 600 }}>
            mylink-swart.vercel.app/p/{slug}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
