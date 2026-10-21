import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LinkItem, CreateLinkInput } from "@/types/link";

/**
 * Firestore users/{userId}/links 컬렉션 경로 반환
 */
export const getLinksCollectionPath = (userId: string = "anonymous") => {
  return `users/${userId}/links`;
};

/**
 * Firestore users/{userId}/links 컬렉션 레퍼런스 반환
 */
export const getLinksCollectionRef = (userId: string = "anonymous") => {
  return collection(db, "users", userId, "links");
};

/**
 * 새 링크를 Firestore users/{userId}/links 컬렉션에 추가
 * - 1개 인자 전달 시: addLinkToFirestore(input) -> userId="anonymous" 기본 적용
 * - 2개 인자 전달 시: addLinkToFirestore(userId, input) -> 지정된 user.uid 경로에 저장
 */
export async function addLinkToFirestore(
  userIdOrInput: string | CreateLinkInput,
  maybeInput?: CreateLinkInput
): Promise<string> {
  let userId = "anonymous";
  let input: CreateLinkInput;

  if (typeof userIdOrInput === "string") {
    userId = userIdOrInput;
    input = maybeInput!;
  } else {
    input = userIdOrInput;
  }

  const linksColRef = getLinksCollectionRef(userId);

  const docRef = await addDoc(linksColRef, {
    title: input.title,
    url: input.url,
    createdat: serverTimestamp(),
    updatedat: serverTimestamp(),
    subtitle: input.subtitle || "",
    description: input.description || "",
    emoji: input.emoji || "🔗",
    badge: input.badge || "기타",
    badgeBg: input.badgeBg || "bg-tds-bg-brand-weak text-tds-text-brand",
  });

  return docRef.id;
}

/**
 * 기본 링크들을 Firestore users/{userId}/links로 최초 1회 안전하게 마이그레이션(시딩)
 */
export async function migrateLocalLinksToFirestore(
  userId: string,
  linksToMigrate: LinkItem[]
): Promise<number> {
  if (!userId || !linksToMigrate || linksToMigrate.length === 0) return 0;

  try {
    const linksColRef = getLinksCollectionRef(userId);
    const snapshot = await getDocs(linksColRef);
    if (!snapshot.empty) {
      // 이미 사용자의 링크 컬렉션에 데이터가 있으면 마이그레이션 불필요
      return 0;
    }

    const batch = writeBatch(db);
    let count = 0;

    for (let i = 0; i < linksToMigrate.length; i++) {
      const item = linksToMigrate[i];
      const docRef = doc(db, "users", userId, "links", item.id);
      batch.set(docRef, {
        title: item.title,
        url: item.url,
        subtitle: item.subtitle || "",
        description: item.description || "",
        emoji: item.emoji || "🔗",
        badge: item.badge || "기타",
        badgeBg: item.badgeBg || "bg-tds-bg-brand-weak text-tds-text-brand",
        createdat: serverTimestamp(),
        updatedat: serverTimestamp(),
        order: i, // 기본 정렬 순서 보존
      });
      count++;
    }

    if (count > 0) {
      await batch.commit();
      console.log(`기본 링크 ${count}개가 Firestore(users/${userId}/links)로 시딩되었습니다.`);
    }

    return count;
  } catch (error) {
    console.error("기본 링크 Firestore 시딩 실패:", error);
    return 0;
  }
}

/**
 * Firestore users/{userId}/links 문서 업데이트
 */
export async function updateLinkInFirestore(
  userId: string,
  id: string,
  input: Partial<CreateLinkInput>
): Promise<void> {
  const docRef = doc(db, "users", userId, "links", id);

  await updateDoc(docRef, {
    ...input,
    updatedat: serverTimestamp(),
  });
}

/**
 * Firestore users/{userId}/links에서 링크 문서 완전 삭제
 */
export async function deleteLinkFromFirestore(
  userId: string,
  id: string
): Promise<void> {
  const docRef = doc(db, "users", userId, "links", id);
  await deleteDoc(docRef);
}

/**
 * Firestore users/{userId}/links 링크 목록 1회 조회
 */
export async function getFirestoreLinks(userId: string = "anonymous"): Promise<LinkItem[]> {
  try {
    const linksColRef = getLinksCollectionRef(userId);
    const snapshot = await getDocs(linksColRef);
    const items: LinkItem[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || "",
        url: data.url || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
        emoji: data.emoji || "🔗",
        badge: data.badge || "기타",
        badgeBg: data.badgeBg || "bg-tds-bg-brand-weak text-tds-text-brand",
        createdat: data.createdat || data.createdAt,
        updatedat: data.updatedat || data.updatedAt,
        order: data.order,
      };
    });

    items.sort((a, b) => {
      const aHasOrder = typeof (a as any).order === "number";
      const bHasOrder = typeof (b as any).order === "number";

      if (!aHasOrder && !bHasOrder) {
        const timeA = a.createdat?.toMillis ? a.createdat.toMillis() : (a.createdat?.seconds ? a.createdat.seconds * 1000 : 0);
        const timeB = b.createdat?.toMillis ? b.createdat.toMillis() : (b.createdat?.seconds ? b.createdat.seconds * 1000 : 0);
        return timeB - timeA;
      }

      if (!aHasOrder && bHasOrder) return -1;
      if (aHasOrder && !bHasOrder) return 1;

      return (a as any).order - (b as any).order;
    });

    return items;
  } catch (error) {
    console.error(`getFirestoreLinks (users/${userId}/links) error:`, error);
    return [];
  }
}

/**
 * Firestore users/{userId}/links 실시간 구독
 */
export function subscribeFirestoreLinks(
  userId: string,
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const linksColRef = getLinksCollectionRef(userId);

  return onSnapshot(
    linksColRef,
    (snapshot) => {
      const items: LinkItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || "",
          url: data.url || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          emoji: data.emoji || "🔗",
          badge: data.badge || "기타",
          badgeBg: data.badgeBg || "bg-tds-bg-brand-weak text-tds-text-brand",
          createdat: data.createdat || data.createdAt,
          updatedat: data.updatedat || data.updatedAt,
          order: data.order,
        };
      });

      // 정렬 규칙: order가 있으면 order순, 없으면 생성시간 최신순
      items.sort((a, b) => {
        const aHasOrder = typeof (a as any).order === "number";
        const bHasOrder = typeof (b as any).order === "number";

        if (!aHasOrder && !bHasOrder) {
          const timeA = a.createdat?.toMillis ? a.createdat.toMillis() : (a.createdat?.seconds ? a.createdat.seconds * 1000 : 0);
          const timeB = b.createdat?.toMillis ? b.createdat.toMillis() : (b.createdat?.seconds ? b.createdat.seconds * 1000 : 0);
          return timeB - timeA;
        }

        if (!aHasOrder && bHasOrder) return -1;
        if (aHasOrder && !bHasOrder) return 1;

        return (a as any).order - (b as any).order;
      });

      onUpdate(items);
    },
    (error) => {
      console.error(`Firestore 실시간 구독 에러 (users/${userId}/links):`, error);
      if (onError) onError(error);
    }
  );
}
