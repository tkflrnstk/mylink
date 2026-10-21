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

// Firestore 링크 컬렉션 경로: users/anonymous/links
export const LINKS_COLLECTION_PATH = "users/anonymous/links";

/**
 * Firestore users/anonymous/links 컬렉션 레퍼런스 반환
 */
export const getLinksCollectionRef = () => {
  return collection(db, "users", "anonymous", "links");
};

/**
 * 새 링크를 Firestore users/anonymous/links 컬렉션에 추가
 * 필드: title, url, createdat, updatedat, (serverTimestamp)
 */
export async function addLinkToFirestore(
  input: CreateLinkInput
): Promise<string> {
  const linksColRef = getLinksCollectionRef();

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
 * 기존 기본 링크들을 Firestore로 최초 1회 안전하게 마이그레이션(시딩)
 */
export async function migrateLocalLinksToFirestore(
  linksToMigrate: LinkItem[]
): Promise<number> {
  if (!linksToMigrate || linksToMigrate.length === 0) return 0;

  try {
    const linksColRef = getLinksCollectionRef();
    const snapshot = await getDocs(linksColRef);
    if (!snapshot.empty) {
      // 이미 Firestore에 데이터가 있으면 마이그레이션 불필요
      return 0;
    }

    const batch = writeBatch(db);
    let count = 0;

    for (let i = 0; i < linksToMigrate.length; i++) {
      const item = linksToMigrate[i];
      const docRef = doc(db, "users", "anonymous", "links", item.id);
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
      console.log(`기본 링크 ${count}개가 Firestore(users/anonymous/links)로 시딩되었습니다.`);
    }

    return count;
  } catch (error) {
    console.error("기본 링크 Firestore 시딩 실패:", error);
    return 0;
  }
}

/**
 * Firestore의 링크 정보 업데이트
 */
export async function updateLinkInFirestore(
  id: string,
  input: Partial<CreateLinkInput>
): Promise<void> {
  const docRef = doc(db, "users", "anonymous", "links", id);

  await updateDoc(docRef, {
    ...input,
    updatedat: serverTimestamp(),
  });
}

/**
 * Firestore에서 링크 문서 완전 삭제
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, "users", "anonymous", "links", id);
  await deleteDoc(docRef);
}

/**
 * Firestore 링크 목록 1회 조회
 */
export async function getFirestoreLinks(): Promise<LinkItem[]> {
  try {
    const linksColRef = getLinksCollectionRef();
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
    console.error("getFirestoreLinks error:", error);
    return [];
  }
}

/**
 * Firestore users/anonymous/links 실시간 구독
 * Firebase 콘솔 또는 웹 화면에서 추가/수정/삭제 시 100% 실시간 양방향 동기화
 */
export function subscribeFirestoreLinks(
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const linksColRef = getLinksCollectionRef();

  // Firestore 컬렉션 전체를 직접 실시간 리스너로 연결
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

      // 정렬 규칙:
      // 1. 신규 추가된 링크(order 없음): 생성일시(createdat) 기준 최신순 상단 배치
      // 2. 기본 링크(order 있음): order 순서대로 아래에 배치
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

      // Firestore의 현재 실제 문서 목록을 그대로 화면에 전달
      onUpdate(items);
    },
    (error) => {
      console.error("Firestore 실시간 구독 에러:", error);
      if (onError) onError(error);
    }
  );
}
