import type { Metadata } from "next";

interface Props {
  params: Promise<{
    displayName: string;
  }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ displayName: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const rawDisplayName = resolvedParams?.displayName || "사용자";
  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim();

  const title = `${decodedDisplayName} (@${decodedDisplayName})`;
  const description = `${decodedDisplayName}님의 공식 마이링크 프로필입니다. 흩어져 있던 SNS, 포트폴리오, 작업물을 단 하나의 링크에서 확인해보세요.`;
  const profileUrl = `https://mylink-swart.vercel.app/${encodeURIComponent(decodedDisplayName)}`;
  const ogImageUrl = `https://mylink-swart.vercel.app/${encodeURIComponent(decodedDisplayName)}/opengraph-image`;

  return {
    title,
    description,
    keywords: [
      decodedDisplayName,
      `${decodedDisplayName} 링크`,
      "마이링크",
      "MyLink",
      "프로필 링크",
      "포트폴리오",
    ],
    openGraph: {
      title: `${decodedDisplayName}님의 마이링크 프로필`,
      description,
      url: profileUrl,
      siteName: "MyLink",
      locale: "ko_KR",
      type: "profile",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${decodedDisplayName}님의 마이링크 프로필`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedDisplayName}님의 마이링크 프로필`,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export default function UserPublicLayout({ children }: Props) {
  return <>{children}</>;
}
