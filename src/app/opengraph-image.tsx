import { ImageResponse } from "next/og";

export const alt = "마이링크 (MyLink) - 나를 표현하는 가장 간단한 링크";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(49, 130, 246, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 45%)",
          fontFamily:
            'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: "relative",
          padding: "60px",
        }}
      >
        {/* 상단 장식 원형 빛 */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "240px",
            background: "rgba(49, 130, 246, 0.15)",
            filter: "blur(60px)",
            borderRadius: "50%",
          }}
        />

        {/* 메인 브랜드 카드 */}
        <div
          style={{
            width: "100%",
            maxWidth: "960px",
            backgroundColor: "#FFFFFF",
            borderRadius: "36px",
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "52px 64px",
            position: "relative",
          }}
        >
          {/* 상단 로고 & 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "#EFF6FF",
              border: "1px solid #DBEAFE",
              marginBottom: "28px",
            }}
          >
            <span style={{ fontSize: "18px" }}>✨</span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#1D4ED8",
                letterSpacing: "-0.01em",
              }}
            >
              MyLink · 나만의 맞춤 프로필 링크
            </span>
          </div>

          {/* 중앙 헤드라인 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "52px",
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.25,
                letterSpacing: "-0.03em",
              }}
            >
              흩어져 있던 나의 모든 세상,
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 900,
                  color: "#3182F6",
                  lineHeight: 1.25,
                  letterSpacing: "-0.03em",
                }}
              >
                단 하나의 링크
              </span>
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.25,
                  letterSpacing: "-0.03em",
                }}
              >
                로 모아보세요
              </span>
            </div>
          </div>

          {/* 서브 설명 */}
          <p
            style={{
              fontSize: "20px",
              color: "#64748B",
              fontWeight: 500,
              lineHeight: 1.5,
              margin: "0 0 36px 0",
              textAlign: "center",
            }}
          >
            인스타그램, 유튜브, 블로그, 포트폴리오를 3초 만에 연결하고 실시간 통계를 확인하세요.
          </p>

          {/* 3대 핵심 뱃지 칩 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "16px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <span style={{ fontSize: "18px" }}>⚡️</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#334155" }}>
                3초 원클릭 완성
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "16px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <span style={{ fontSize: "18px" }}>✏️</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#334155" }}>
                실시간 인라인 편집
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "16px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <span style={{ fontSize: "18px" }}>📊</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#334155" }}>
                실시간 클릭 분석
              </span>
            </div>
          </div>
        </div>

        {/* 하단 브랜드 푸터 바 */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "960px",
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
            https://mylink.site
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
