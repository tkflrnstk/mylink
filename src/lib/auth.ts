import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/types/user";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Google 소셜 로그인 실행 및 Firestore users/{uid} 동기화
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Firestore users/{user.uid} 문서에 사용자 정보 저장/업데이트
    await syncUserProfileToFirestore(user);

    return user;
  } catch (error) {
    console.error("Google 로그인 실패:", error);
    throw error;
  }
}

/**
 * 로그아웃 실행
 */
export async function logOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
}

/**
 * Firestore users/{uid} 문서에 유저 정보 동기화
 */
export async function syncUserProfileToFirestore(user: User): Promise<UserProfile> {
  const userDocRef = doc(db, "users", user.uid);
  const snap = await getDoc(userDocRef);

  if (!snap.exists()) {
    // displayName은 이메일의 앞부분을 기본으로 사용
    const emailPrefix = user.email ? user.email.split("@")[0] : (user.displayName || "사용자");

    // 최초 가입 시 기본 프로필 데이터 생성
    const defaultData: UserProfile = {
      uid: user.uid,
      displayName: emailPrefix,
      email: user.email,
      photoURL: user.photoURL,
      badge: "✨ 마이링크 회원",
      bio: "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.",
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userDocRef, defaultData);
    return defaultData;
  } else {
    // 기존 유저는 최근 로그인 시간 및 최신 구글 프로필 업데이트 (displayName은 이메일 앞부분 적용)
    const existing = snap.data() as UserProfile;
    const emailPrefix = user.email ? user.email.split("@")[0] : (existing.displayName || user.displayName || "사용자");
    const updatedData: Partial<UserProfile> = {
      displayName: emailPrefix,
      email: user.email,
      photoURL: user.photoURL || existing.photoURL,
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userDocRef, updatedData, { merge: true });
    return { ...existing, ...updatedData };
  }
}

/**
 * Firestore에서 users/{uid} 정보 조회
 */
export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("유저 프로필 조회 에러:", error);
    return null;
  }
}

/**
 * Firestore users/{uid} 프로필 정보 업데이트
 */
export async function updateUserProfileInFirestore(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
