import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * TDS Badge / Chip — design.md §8.3 기준
 *
 * variant 종류:
 * - default:   bg-tds-fill-brand text-white (blue-500 배경)
 * - secondary: bg-tds-bg-brand-weak text-tds-text-brand (blue-50 배경 — TDS chip brand)
 * - muted:     bg-tds-fill-secondary text-tds-text-secondary (grey-100 배경)
 * - outline:   white 배경 + border-default
 * - chip:      TDS chip 컴포넌트 — 34px 높이, radius-full (999px)
 *              resting: border-default + white bg
 *              active:  fill-primary (grey-900) + white text
 * - chip-brand: TDS chip brand 변형 — blue-50 bg + blue-500 text
 * - danger:    TDS red-500 배경 (error/danger 상태 badge)
 * - success:   TDS green-500 배경
 */
const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-tds-border-focused focus:ring-offset-2",
  {
    variants: {
      variant: {
        /* label-s: 13px/600 / badge (22px h, radius-xs 6px) */
        default:
          "rounded-[6px] px-2.5 py-0.5 text-[13px] leading-[1.25] bg-tds-fill-brand text-white hover:bg-tds-blue-600",
        secondary:
          "rounded-[6px] px-2.5 py-0.5 text-[13px] leading-[1.25] bg-tds-bg-brand-weak text-tds-text-brand hover:opacity-80",
        muted:
          "rounded-[6px] px-2.5 py-0.5 text-[13px] leading-[1.25] bg-tds-fill-secondary text-tds-text-secondary",
        outline:
          "rounded-[6px] px-2.5 py-0.5 text-[13px] leading-[1.25] border border-tds-border-default text-tds-text-secondary bg-white",
        danger:
          "rounded-[6px] px-2.5 py-0.5 text-[13px] leading-[1.25] bg-tds-fill-danger text-white",
        success:
          "rounded-[6px] px-2.5 py-0.5 text-[13px] leading-[1.25] bg-tds-green-500 text-white",
        /* TDS Chip — 34px 높이, radius-full */
        chip:
          "rounded-tds-full min-h-[34px] py-1 px-4 text-[13px] sm:text-[15px] leading-[1.25] tracking-[-0.005em] border border-tds-border-default bg-white text-tds-text-primary hover:bg-tds-fill-secondary max-w-full break-words text-center justify-center",
        /* TDS Chip brand 변형 — blue-50 bg + blue-500 text */
        "chip-brand":
          "rounded-tds-full min-h-[34px] py-1.5 px-4 text-[13px] sm:text-[15px] leading-[1.25] tracking-[-0.005em] bg-tds-bg-brand-weak text-tds-text-brand max-w-full break-words text-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
