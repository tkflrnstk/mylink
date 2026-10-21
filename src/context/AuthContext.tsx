"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  signInWithGoogle as authSignInWithGoogle,
  logOut as authLogOut,
  syncUserProfileToFirestore,
  getUserProfileFromFirestore,
  updateUserProfileInFirestore,
} from "@/lib/auth";
import type { UserProfile } from "@/types/user";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  logOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {
    throw new Error("AuthProvider not found");
  },
  logOut: async () => {},
  refreshProfile: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const profile = await getUserProfileFromFirestore(currentUser.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        const synced = await syncUserProfileToFirestore(currentUser);
        setUserProfile(synced);
      }
    } catch (err) {
      console.error("프로필 로드 에러:", err);
      setUserProfile({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.email ? currentUser.email.split("@")[0] : (currentUser.displayName || "사용자"),
        userName: currentUser.displayName || "사용자",
        photoURL: currentUser.photoURL,
        badge: "✨ 마이링크 회원",
        bio: "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.",
      });
    }
  };

  useEffect(() => {
    // onAuthStateChanged로 Firebase 인증 상태 감지
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const loggedInUser = await authSignInWithGoogle();
      setUser(loggedInUser);
      await fetchProfile(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await authLogOut();
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await updateUserProfileInFirestore(user.uid, data);
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        logOut,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
