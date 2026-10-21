"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFirestoreLinks,
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
} from "@/lib/links";
import type { LinkItem, CreateLinkInput } from "@/types/link";

/**
 * 쿼리 키 팩토리
 */
export const linkKeys = {
  all: ["links"] as const,
  userLinks: (userId?: string | null) => ["links", userId] as const,
};

/**
 * 사용자의 Firestore 링크 목록 조회 훅 (TanStack useQuery)
 */
export function useLinksQuery(userId?: string | null) {
  return useQuery({
    queryKey: linkKeys.userLinks(userId),
    queryFn: async (): Promise<LinkItem[]> => {
      if (!userId) return [];
      return await getFirestoreLinks(userId);
    },
    enabled: Boolean(userId),
  });
}

/**
 * 링크 추가 뮤테이션 훅 (TanStack useMutation)
 */
export function useAddLinkMutation(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLinkInput) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return await addLinkToFirestore(userId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.userLinks(userId) });
    },
  });
}

/**
 * 링크 인라인 수정 뮤테이션 훅 (낙관적 업데이트 적용)
 */
export function useUpdateLinkMutation(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateLinkInput> }) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      await updateLinkInFirestore(userId, id, data);
    },
    onMutate: async ({ id, data }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: linkKeys.userLinks(userId) });

      // 이전 캐시 스냅샷 보존
      const previousLinks = queryClient.getQueryData<LinkItem[]>(linkKeys.userLinks(userId));

      // 낙관적으로 캐시 데이터 즉시 업데이트
      if (previousLinks) {
        queryClient.setQueryData<LinkItem[]>(
          linkKeys.userLinks(userId),
          previousLinks.map((item) =>
            item.id === id ? { ...item, ...data, updatedat: new Date() } : item
          )
        );
      }

      return { previousLinks };
    },
    onError: (_err, _vars, context) => {
      // 오류 발생 시 이전 데이터로 롤백
      if (context?.previousLinks) {
        queryClient.setQueryData(linkKeys.userLinks(userId), context.previousLinks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.userLinks(userId) });
    },
  });
}

/**
 * 링크 삭제 뮤테이션 훅 (낙관적 업데이트 적용)
 */
export function useDeleteLinkMutation(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      await deleteLinkFromFirestore(userId, id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: linkKeys.userLinks(userId) });

      const previousLinks = queryClient.getQueryData<LinkItem[]>(linkKeys.userLinks(userId));

      if (previousLinks) {
        queryClient.setQueryData<LinkItem[]>(
          linkKeys.userLinks(userId),
          previousLinks.filter((item) => item.id !== id)
        );
      }

      return { previousLinks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(linkKeys.userLinks(userId), context.previousLinks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.userLinks(userId) });
    },
  });
}
