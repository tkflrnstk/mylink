import { QueryClient } from "@tanstack/react-query";

/**
 * 전역 TanStack Query 클라이언트 인스턴스 생성
 * - Firestore 연동 최적화: 불필요한 재조회 방지 (refetchOnWindowFocus: false)
 * - staleTime 2분, gcTime 10분 설정
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // 2분 동안 캐시 신선 유지
        gcTime: 1000 * 60 * 10,   // 10분 동안 미사용 캐시 보존
        refetchOnWindowFocus: false, // 창 포커스 시 자동 재조회 비활성화 (Firestore 과금 절감)
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // 서버 환경: 항상 새로운 QueryClient 생성
    return makeQueryClient();
  } else {
    // 브라우저 환경: 싱글톤 유지
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
