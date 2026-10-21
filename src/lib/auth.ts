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
  deleteDoc,
  runTransaction,
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
 * Firestore users/{uid} 문서 및 displayNames/{displayName} 유저 정보 동기화
 */
export async function syncUserProfileToFirestore(user: User): Promise<UserProfile> {
  const userDocRef = doc(db, "users", user.uid);
  const snap = await getDoc(userDocRef);

  // 구글 계정 기본 정보
  const googleUserName = user.displayName || "사용자";
  const emailPrefix = user.email ? user.email.split("@")[0] : googleUserName;

  if (!snap.exists()) {
    // 최초 가입 시 사용 가능한 displayName 확보 (중복이면 뒤에 난수 추가)
    let candidateName = emailPrefix;
    let nameDocRef = doc(db, "displayNames", candidateName);
    let nameSnap = await getDoc(nameDocRef);
    let attempts = 0;
    while (nameSnap.exists() && nameSnap.data().uid !== user.uid && attempts < 5) {
      attempts++;
      candidateName = `${emailPrefix}${Math.floor(100 + Math.random() * 900)}`;
      nameDocRef = doc(db, "displayNames", candidateName);
      nameSnap = await getDoc(nameDocRef);
    }

    const defaultData: UserProfile = {
      uid: user.uid,
      displayName: candidateName,
      userName: googleUserName,
      email: user.email,
      photoURL: user.photoURL,
      badge: "✨ 마이링크 회원",
      bio: "반갑습니다! 나만의 링크를 실시간으로 관리하는 페이지입니다.",
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };

    // users 문서와 displayNames 문서를 함께 기록
    await setDoc(userDocRef, defaultData);
    try {
      await setDoc(nameDocRef, {
        uid: user.uid,
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn("displayNames 등록 실패:", e);
    }

    return defaultData;
  } else {
    // 기존 유저는 이미 변경한 커스텀 displayName 존중
    const existing = snap.data() as UserProfile;
    const currentName = existing.displayName || emailPrefix;
    const updatedData: Partial<UserProfile> = {
      displayName: currentName,
      userName: existing.userName || googleUserName,
      email: user.email,
      photoURL: existing.photoURL !== undefined ? existing.photoURL : user.photoURL,
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userDocRef, updatedData, { merge: true });

    // 기존 유저의 displayNames 문서가 없으면 자가 복구 등록
    try {
      const nameDocRef = doc(db, "displayNames", currentName);
      const nameSnap = await getDoc(nameDocRef);
      if (!nameSnap.exists() || nameSnap.data().uid !== user.uid) {
        await setDoc(nameDocRef, {
          uid: user.uid,
          createdAt: existing.createdAt || serverTimestamp(),
        }, { merge: true });
      }
    } catch (e) {
      console.warn("기존 유저 displayNames 동기화:", e);
    }

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
 * Firestore에서 displayName으로 유저 프로필 조회 (displayNames O(1) 단건 조회 및 fallback 지원)
 */
export async function getUserProfileByDisplayName(displayName: string): Promise<UserProfile | null> {
  const trimmed = displayName.trim();
  if (!trimmed) return null;

  try {
    // 1. 고유 인덱스 컬렉션 displayNames/{displayName} O(1) 단건 조회
    const nameRef = doc(db, "displayNames", trimmed);
    const nameSnap = await getDoc(nameRef);

    if (nameSnap.exists()) {
      const uid = nameSnap.data().uid;
      return await getUserProfileFromFirestore(uid);
    }

    // 2. 하위 호환 fallback: users 컬렉션 where 쿼리
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
 * Firestore users/{uid} 프로필 정보 업데이트 (트랜잭션으로 displayNames 고유 컬렉션 원자적 동기화)
 */
export async function updateUserProfileInFirestore(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userDocRef = doc(db, "users", uid);

  // displayName이 변경되는 경우 트랜잭션을 통해 고유 컬렉션 displayNames와 원자적(Atomic) 동기화
  if (data.displayName) {
    const newName = data.displayName.trim();

    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userDocRef);
      const oldName = userSnap.data()?.displayName;

      if (oldName !== newName) {
        const newNameRef = doc(db, "displayNames", newName);
        const newNameSnap = await transaction.get(newNameRef);

        // 이미 다른 회원이 해당 이름을 점유하고 있다면 트랜잭션 중단
        if (newNameSnap.exists() && newNameSnap.data().uid !== uid) {
          throw new Error("이미 다른 회원이 사용 중인 Display Name입니다.");
        }

        // 새 닉네임 등록
        transaction.set(newNameRef, {
          uid,
          createdAt: serverTimestamp(),
        });

        // 이전 닉네임이 있었다면 해제(삭제)하여 다른 사람이 쓸 수 있도록 반환
        if (oldName && oldName !== newName) {
          const oldNameRef = doc(db, "displayNames", oldName);
          transaction.delete(oldNameRef);
        }
      }

      transaction.update(userDocRef, {
        ...data,
        displayName: newName,
        updatedAt: serverTimestamp(),
      });
    });
  } else {
    // displayName 변경이 아닌 일반 필드(bio, userName 등) 업데이트
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Display Name 중복 확인 함수
 * 고유 인덱스 컬렉션 displayNames/{displayName} O(1) 단건 조회로 초고속 확인
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
  if (trimmed.length > 30) {
    return { available: false, message: "Display Name은 최대 30글자 이하이어야 합니다." };
  }

  try {
    // 1. O(1) 단건 조회: displayNames/{trimmed}
    const nameRef = doc(db, "displayNames", trimmed);
    const snap = await getDoc(nameRef);

    if (!snap.exists()) {
      return { available: true, message: "사용 가능한 Display Name입니다." };
    }

    const data = snap.data();
    if (data.uid === currentUid) {
      return { available: true, message: "현재 회원님이 사용 중인 Display Name입니다." };
    }

    return { available: false, message: "이미 다른 회원이 사용 중인 Display Name입니다." };
  } catch (error) {
    console.error("Display Name 중복 확인 에러 (fallback 시도):", error);
    // fallback: users 컬렉션 where 쿼리
    try {
      const usersCol = collection(db, "users");
      const q = query(usersCol, where("displayName", "==", trimmed));
      const fallbackSnap = await getDocs(q);
      const otherUsers = fallbackSnap.docs.filter((d) => d.id !== currentUid);
      if (otherUsers.length === 0) {
        return { available: true, message: "사용 가능한 Display Name입니다." };
      }
      return { available: false, message: "이미 다른 회원이 사용 중인 Display Name입니다." };
    } catch {
      return { available: false, message: "중복 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
    }
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
