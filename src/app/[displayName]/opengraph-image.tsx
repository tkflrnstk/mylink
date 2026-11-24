import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{
    displayName: string;
  }>;
}

export default async function Image({ params }: Props) {
  const resolvedParams = await params;
  const rawDisplayName = resolvedParams?.displayName || "사용자";
  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim();
  const initial = decodedDisplayName.charAt(0).toUpperCase() || "M";

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
            "radial-gradient(circle at 10% 20%, rgba(49, 130, 246, 0.15) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 45%)",
          fontFamily:
            'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: "relative",
          padding: "50px",
        }}
      >
        {/* 상단 은은한 앰비언트 글로우 */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "260px",
            background: "rgba(49, 130, 246, 0.18)",
            filter: "blur(70px)",
            borderRadius: "50%",
          }}
        />

        {/* ── 메인 프로필 카드 ── */}
        <div
          style={{
            width: "100%",
            maxWidth: "920px",
            backgroundColor: "#FFFFFF",
            borderRadius: "36px",
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 25px 50px -12px rgba(15, 23, 42, 0.09), 0 0 1px 1px rgba(15, 23, 42, 0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "46px 56px",
            position: "relative",
          }}
        >
          {/* 상단 마이링크 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              backgroundColor: "#EFF6FF",
              border: "1px solid #DBEAFE",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "14px" }}>✨</span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#2563EB",
                letterSpacing: "-0.01em",
              }}
            >
              마이링크 공식 프로필
            </span>
          </div>

          {/* 프로필 아바타 (그라데이션 링) */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3182F6 0%, #8B5CF6 50%, #06B6D4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                boxShadow: "0 10px 25px -5px rgba(49, 130, 246, 0.35)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  fontWeight: 900,
                  color: "#3182F6",
                }}
              >
                {initial}
              </div>
            </div>

            {/* 인증 체크 뱃지 */}
            <div
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#10B981",
                border: "3px solid #FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 900,
              }}
            >
              ✓
            </div>
          </div>

          {/* 사용자 이름 */}
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.025em",
              margin: "0 0 6px 0",
              lineHeight: 1.2,
            }}
          >
            {decodedDisplayName}
          </h1>

          {/* 고유 핸들 / 아이디 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 14px",
              borderRadius: "999px",
              backgroundColor: "#F1F5F9",
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#64748B",
              }}
            >
              @{decodedDisplayName}
            </span>
          </div>

          {/* 자기소개 카피 */}
          <p
            style={{
              fontSize: "17px",
              color: "#475569",
              fontWeight: 500,
              lineHeight: 1.5,
              margin: "0 0 28px 0",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            반갑습니다! 나만의 링크를 실시간으로 모아 관리하는 공간입니다. 아래 링크들을 클릭해
            살펴보세요.
          </p>

          {/* ── 대표 링크 미리보기 가로 카드 3개 ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 18px",
                borderRadius: "16px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                minWidth: "220px",
              }}
            >
              <span style={{ fontSize: "20px" }}>📸</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B" }}>
                  인스타그램
                </span>
                <span style={{ fontSize: "11px", color: "#94A3B8" }}>최신 피드 보기</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 18px",
                borderRadius: "16px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                minWidth: "220px",
              }}
            >
              <span style={{ fontSize: "20px" }}>🎬</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B" }}>
                  유튜브 채널
                </span>
                <span style={{ fontSize: "11px", color: "#94A3B8" }}>최신 영상 모음</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 18px",
                borderRadius: "16px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                minWidth: "220px",
              }}
            >
              <span style={{ fontSize: "20px" }}>🎨</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B" }}>
                  포트폴리오
                </span>
                <span style={{ fontSize: "11px", color: "#94A3B8" }}>작업물 웹사이트</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 하단 푸터 바 ── */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
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
          <span style={{ fontSize: "15px", color: "#3B82F6", fontWeight: 700 }}>
            mylink-swart.vercel.app/{decodedDisplayName}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
