import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowRight, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LinkItem } from "@/types/link";

interface LinkCardProps {
  link: LinkItem;
  /** 카드 전체에 추가할 Tailwind 클래스 */
  className?: string;
  /** 링크 수정 핸들러 */
  onEdit?: (link: LinkItem) => void;
  /** 링크 삭제 핸들러 */
  onDelete?: (id: string) => void;
}

/**
 * TDS LinkCard — design.md §8.5 기준
 *
 * - 이모지 영역: radius-m (12px), grey-100 → blue-50 (hover)
 * - 제목: label-m (15px/600/1.25/-0.005em) / text-primary
 * - 서브타이틀: body-3 (13px/400/1.50) / grey-600
 * - 설명: body-3 (13px/400) / text-disabled (grey-400)
 * - 뱃지: shadcn Badge secondary (label-s 13px/600)
 * - 호버: shadow-tds-2 + border-focused/20
 * - 전환: dur-base(200ms) / ease-tds
 * - 외부 링크: ExternalLink 아이콘 + _blank
 */
export function LinkCard({ link, className, onEdit, onDelete }: LinkCardProps) {
  const isExternal = link.url.startsWith("http");

  return (
    <a
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={`${link.title} 바로가기`}
      className={cn(
        "group block rounded-tds-xl",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-tds-border-focused focus-visible:ring-offset-2",
        className
      )}
    >
      <Card
        className={cn(
          /* TDS dur-base + ease-tds */
          "transition-all duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          /* 호버: shadow-tds-2 + border-focused/20 */
          "group-hover:shadow-tds-2 group-hover:border-tds-border-focused/20",
          /* 활성: scale 피드백 */
          "active:scale-[0.98]"
        )}
      >
        <CardContent className="flex items-center gap-2 sm:gap-3 p-3.5 sm:p-4 min-w-0 overflow-hidden">
          {/* 이모지 아이콘 — radius-m (12px), fill-secondary → bg-brand-weak (hover) */}
          <div
            className={cn(
              "flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-tds-m",
              "bg-tds-fill-secondary group-hover:bg-tds-bg-brand-weak",
              "flex items-center justify-center text-xl sm:text-2xl",
              "transition-colors duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            )}
          >
            {link.emoji}
          </div>

          {/* 텍스트 영역 */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
              {/* 제목 — label-m: 15px/600/1.25/-0.005em */}
              <span
                className={cn(
                  "font-semibold text-sm sm:text-[15px] leading-[1.25] tracking-[-0.005em]",
                  "text-tds-text-primary truncate min-w-0 max-w-full",
                  "group-hover:text-tds-text-brand",
                  "transition-colors duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                )}
              >
                {link.title}
              </span>
              {/* 뱃지 — label-s 13px/600 */}
              <Badge variant="secondary" className="shrink-0 text-[11px] sm:text-[13px] px-2 py-0.5 max-w-full truncate">
                {link.badge}
              </Badge>
            </div>
            {/* 서브타이틀 — body-3: 13px/400/1.50 / grey-600 */}
            <p className="text-[12px] sm:text-[13px] leading-[1.50] text-tds-grey-600 mt-0.5 truncate min-w-0">
              {link.subtitle}
            </p>
            {/* 설명 — body-3: 13px/400 / text-disabled (grey-400) */}
            <p className="text-[12px] sm:text-[13px] leading-[1.50] text-tds-text-disabled mt-0.5 line-clamp-1 break-words min-w-0">
              {link.description}
            </p>
          </div>

          {/* 편집 & 삭제 버튼 영역 */}
          <div className="flex items-center gap-0.5 shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(link);
                }}
                aria-label={`${link.title} 수정`}
                title="링크 수정"
                className="p-1.5 rounded-tds-s text-tds-text-disabled hover:text-tds-text-brand
                           hover:bg-tds-fill-secondary transition-colors duration-[120ms]
                           cursor-pointer shrink-0"
              >
                <Pencil size={15} />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(link.id);
                }}
                aria-label={`${link.title} 삭제`}
                title="링크 삭제"
                className="p-1.5 rounded-tds-s text-tds-text-disabled hover:text-tds-text-danger
                           hover:bg-tds-fill-secondary transition-colors duration-[120ms]
                           cursor-pointer shrink-0"
              >
                <Trash2 size={15} />
              </button>
            )}

            {/* 방향 아이콘 */}
            <div
              className={cn(
                "flex-shrink-0 text-tds-text-disabled text-xs sm:text-base ml-1",
                "group-hover:text-tds-text-brand",
                "transition-colors duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              )}
            >
              {isExternal ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
