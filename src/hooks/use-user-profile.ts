"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfileFromFirestore,
  getUserProfileByDisplayName,
  updateUserProfileInFirestore,
  checkDisplayNameAvailable,
} from "@/lib/auth";
import type { UserProfile } from "@/types/user";

export const userProfileKeys = {
  all: ["userProfile"] as const,
  profile: (userId?: string | null) => ["userProfile", userId] as const,
  displayNameCheck: (name: string, uid?: string | null) => ["checkDisplayName", name, uid] as const,
};

/**
 * 사용자 프로필 조회 훅 (TanStack useQuery)
 */
export function useUserProfileQuery(userId?: string | null) {
  return useQuery({
    queryKey: userProfileKeys.profile(userId),
    queryFn: async (): Promise<UserProfile | null> => {
      if (!userId) return null;
      return await getUserProfileFromFirestore(userId);
    },
    enabled: Boolean(userId),
  });
}

/**
 * displayName으로 유저 프로필 조회 훅 (동적 라우팅 /[displayName]용)
 */
export function useUserProfileByDisplayNameQuery(displayName?: string | null) {
  return useQuery({
    queryKey: ["userProfileByDisplayName", displayName],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!displayName) return null;
      return await getUserProfileByDisplayName(displayName);
    },
    enabled: Boolean(displayName),
  });
}

/**
 * 프로필 수정 뮤테이션 훅 (TanStack useMutation)
 */
export function useUpdateUserProfileMutation(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      await updateUserProfileInFirestore(userId, data);
      return data;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: userProfileKeys.profile(userId) });
      const previousProfile = queryClient.getQueryData<UserProfile | null>(userProfileKeys.profile(userId));

      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(userProfileKeys.profile(userId), {
          ...previousProfile,
          ...newData,
        });
      }

      return { previousProfile };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(userProfileKeys.profile(userId), context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.profile(userId) });
    },
  });
}

/**
 * Display Name 중복 확인 뮤테이션 훅
 */
export function useCheckDisplayNameMutation(currentUid?: string | null) {
  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!currentUid) throw new Error("로그인이 필요합니다.");
      return await checkDisplayNameAvailable(displayName, currentUid);
    },
  });
}
