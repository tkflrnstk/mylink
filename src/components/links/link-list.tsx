import { cn } from "@/lib/utils";
import { LinkCard } from "@/components/links/link-card";
import type { LinkItem, CreateLinkInput } from "@/types/link";

interface LinkListProps {
  links: LinkItem[];
  /** 리스트 전체에 추가할 Tailwind 클래스 */
  className?: string;
  /** 개별 카드에 추가할 Tailwind 클래스 */
  cardClassName?: string;
  /** 링크 인라인 수정 핸들러 */
  onUpdate?: (id: string, updatedData: Partial<CreateLinkInput>) => Promise<void> | void;
  /** 링크 삭제 핸들러 (삭제 모달 트리거) */
  onDelete?: (link: LinkItem) => void;
  /** 읽기 전용 모드 */
  readOnly?: boolean;
}

/**
 * LinkCard를 목록 형태로 렌더링하는 컴포넌트.
 *
 * - 시맨틱 `<ul>/<li>` 마크업을 사용합니다.
 * - links 배열이 비어 있으면 빈 상태 메시지를 표시합니다.
 */
export function LinkList({ links, className, cardClassName, onUpdate, onDelete, readOnly = false }: LinkListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-tds-xl border border-tds-border-default">
        <p className="text-sm font-medium text-tds-text-secondary">
          등록된 링크가 없어요.
        </p>
        <p className="text-xs text-tds-text-disabled mt-1">
          {readOnly ? "공개된 링크가 아직 없습니다." : "상단의 `+ 새 링크 추가` 버튼을 눌러 첫 번째 링크를 등록해보세요!"}
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className={cn("flex flex-col gap-3", className)}>
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard
            link={link}
            className={cardClassName}
            onUpdate={onUpdate}
            onDelete={onDelete}
            readOnly={readOnly}
          />
        </li>
      ))}
    </ul>
  );
}
