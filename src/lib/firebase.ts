import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Firebase 설정 객체 (환경 변수 우선, 기본값 fallback 제공)
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDm0xK6dYAY3lzZRTj1IeKYBlXgKsLtUgk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "my-hylink.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "my-hylink",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "my-hylink.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1055069837583",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1055069837583:web:4dd34515a6832bfb12c67a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5FVTWE9RM8",
};

// Next.js 환경(SSR / Fast Refresh)에서 중복 초기화 방지
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 주요 Firebase 서비스 인스턴스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (브라우저 환경 및 지원 여부 확인 후 안전하게 초기화)
let analytics: Analytics | null = null;

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window !== "undefined") {
    if (analytics) return analytics;
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
      return analytics;
    }
  }
  return null;
};
