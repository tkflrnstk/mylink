import { z } from "zod";

/* ── Zod 스키마 정의 (링크 추가 및 인라인 수정 공통 검증) ── */
export const linkFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "제목을 입력해주세요." })
    .min(2, { message: "제목은 최소 2자 이상 입력해주세요." })
    .max(50, { message: "제목은 최대 50자까지 입력 가능합니다." }),
  url: z
    .string()
    .min(1, { message: "주소를 입력해주세요." })
    .refine(
      (val) => {
        const trimmed = val.trim();
        if (!trimmed) return true; // 빈 값은 min(1)에서 처리
        const isRelative = trimmed.startsWith("/");
        const isMailto = trimmed.startsWith("mailto:");
        const hasProtocol = /^https?:\/\//i.test(trimmed);
        const isValidDomain = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/i.test(trimmed);
        return isRelative || isMailto || hasProtocol || isValidDomain;
      },
      { message: "올바른 주소 경로가 아닙니다. (예: https://example.com 또는 /p/github)" }
    ),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  emoji: z.string(),
  badge: z.string(),
});

export type LinkFormValues = z.infer<typeof linkFormSchema>;

export const PRESET_EMOJIS = ["🔗", "🐙", "📝", "✉️", "💼", "🎨", "🎬", "📄", "💬", "⚡", "🌐", "📱"];
export const PRESET_BADGES = ["코드", "기록", "문의", "경력", "포폴", "영상", "SNS", "기타"];

/**
 * 프로토콜이 누락된 웹 URL에 자동으로 https://를 보정하는 유틸 함수
 */
export function formatUrl(rawUrl: string): string {
  let formattedUrl = rawUrl.trim();
  if (
    !formattedUrl.startsWith("http://") &&
    !formattedUrl.startsWith("https://") &&
    !formattedUrl.startsWith("/") &&
    !formattedUrl.startsWith("mailto:")
  ) {
    formattedUrl = `https://${formattedUrl}`;
  }
  return formattedUrl;
}
