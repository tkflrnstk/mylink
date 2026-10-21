import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
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

  // 구글 계정 기본 정보
  const googleUserName = user.displayName || "사용자";
  const emailPrefix = user.email ? user.email.split("@")[0] : googleUserName;

  if (!snap.exists()) {
    // 최초 가입 시 기본 프로필 데이터 생성
    const defaultData: UserProfile = {
      uid: user.uid,
      displayName: emailPrefix, // 표시용 닉네임 (기본: 이메일 앞부분)
      userName: googleUserName, // 구글 계정의 실제 성명/유저네임
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
    // 기존 유저는 이미 변경한 커스텀 displayName/userName/photoURL이 있으면 존중
    const existing = snap.data() as UserProfile;
    const updatedData: Partial<UserProfile> = {
      displayName: existing.displayName || emailPrefix,
      userName: existing.userName || googleUserName,
      email: user.email,
      photoURL: existing.photoURL !== undefined ? existing.photoURL : user.photoURL,
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
 * Firestore users 컬렉션에서 displayName으로 유저 프로필 조회
 */
export async function getUserProfileByDisplayName(displayName: string): Promise<UserProfile | null> {
  const trimmed = displayName.trim();
  if (!trimmed) return null;

  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("displayName", "==", trimmed));
    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    const docSnap = snap.docs[0];
    const data = docSnap.data() as UserProfile;
    return {
      ...data,
      uid: docSnap.id,
    };
  } catch (error) {
    console.error("displayName으로 유저 프로필 조회 에러:", error);
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

/**
 * Display Name 중복 확인 함수
 * 본인(currentUid)을 제외한 다른 사용자가 해당 displayName을 이미 사용 중인지 확인
 */
export async function checkDisplayNameAvailable(
  displayName: string,
  currentUid: string
): Promise<{ available: boolean; message: string }> {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return { available: false, message: "Display Name을 입력해주세요." };
  }
  if (trimmed.length < 2) {
    return { available: false, message: "Display Name은 최소 2글자 이상이어야 합니다." };
  }

  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("displayName", "==", trimmed));
    const snap = await getDocs(q);

    if (snap.empty) {
      return { available: true, message: "사용 가능한 Display Name입니다." };
    }

    // 검색된 문서 중 본인이 아닌 문서가 있는지 확인
    const otherUsers = snap.docs.filter((d) => d.id !== currentUid);
    if (otherUsers.length === 0) {
      return { available: true, message: "현재 회원님이 사용 중인 Display Name입니다." };
    }

    return { available: false, message: "이미 다른 회원이 사용 중인 Display Name입니다." };
  } catch (error) {
    console.error("Display Name 중복 확인 실패:", error);
    return { available: false, message: "중복 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}

/**
 * 프로필 사진 업로드 (Firebase Storage 우선, 불가 시 Base64 DataURL fallback)
 */
export async function uploadProfileImage(file: File, uid: string): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop() || "png";
    const storageRef = ref(storage, `profile_images/${uid}/avatar_${Date.now()}.${fileExt}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
  } catch (storageError) {
    console.warn("Firebase Storage 업로드 실패, Base64로 fallback 저장합니다:", storageError);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}
