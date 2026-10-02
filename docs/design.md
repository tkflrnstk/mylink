# 💙 토스 디자인 시스템 (Toss Design System) — 개발자 레퍼런스

> **출처**: TDS 핸드오프 번들 + `@toss/tds-colors` v0.1.0 발행값  
> **버전**: v2.0 (TDS Mobile 기반, 2026-10-02 업데이트)  
> **원칙**: CSS Modules 금지 — 모든 스타일은 Tailwind CSS v4 유틸리티 클래스로 통일

---

## 1. 디자인 철학

1. **Simple & Intuitive** — 불필요한 장식 배제, 1초 내 정보 집중
2. **Smooth & Friendly** — 16~32px 공격적 라운드 (iOS squircle 금지)
3. **High Contrast & Clarity** — cool-blue 중성 팔레트 + Toss Blue 단일 강조색
4. **Delightful Micro-interactions** — `dur-fast(120ms)` 버튼 피드백, `dur-base(200ms)` 호버

> 토스는 자신을 **"은행에 다니는 유능한 친구"** 로 포지셔닝한다. 조용히 일을 처리하고, 사용자의 시간을 낭비시키지 않는다는 어조다.

---

## 2. 컬러 시스템

### 2.1 Base Palette — OKLCH (TDS `@toss/tds-colors` v0.1.0 발행값)

| 토큰 | OKLCH | HEX | 용도 |
|---|---|---|---|
| `blue-500` | `oklch(0.620 0.191 258)` | `#3182F6` | **Toss Blue — 화면당 하나의 CTA** |
| `blue-600` | `oklch(0.522 0.176 257)` | — | pressed-blue |
| `blue-50` | `oklch(0.959 0.020 250)` | `#E8F3FF` | brand-weak 배경 |
| `grey-900` | `oklch(0.237 0.020 258)` | `#191F28` | primary text (순수 검정 아님) |
| `grey-800` | `oklch(0.357 0.028 257)` | `#333D4B` | — |
| `grey-700` | `oklch(0.460 0.028 256)` | `#4E5968` | secondary text |
| `grey-600` | `oklch(0.562 0.025 254)` | `#6B7684` | 보조 설명 텍스트 |
| `grey-500` | `oklch(0.666 0.021 253)` | `#8B95A1` | — |
| `grey-400` | `oklch(0.779 0.016 251)` | `#B0B8C1` | disabled text / strong line |
| `grey-300` | `oklch(0.874 0.009 248)` | `#D1D6DB` | — |
| `grey-200` | `oklch(0.930 0.005 248)` | `#E5E8EB` | **default divider / border** |
| `grey-100` | `oklch(0.966 0.003 248)` | `#F2F4F6` | secondary surface / 버튼 배경 |
| `grey-50` | `oklch(0.985 0.002 248)` | `#F9FAFB` | **페이지 기본 배경** |
| `white` | `oklch(1.000 0.000 0)` | `#FFFFFF` | 카드 / 모달 컨테이너 배경 |
| `red-500` | `oklch(0.641 0.208 21)` | `#F04452` | danger / error |
| `green-500` | `oklch(0.493 0.143 154)` | — | success |
| `navy-900` | `oklch(0.155 0.060 261)` | — | overlay / shadow base |

### 2.2 Semantic Alias (product 표면에서 이 토큰 사용)

| 시맨틱 토큰 | Base 토큰 | Tailwind 클래스 |
|---|---|---|
| `fill-brand` | `blue-500` | `bg-tds-fill-brand` |
| `fill-secondary` | `grey-100` | `bg-tds-fill-secondary` |
| `fill-weak` | `grey-50` | `bg-tds-fill-weak` |
| `fill-danger` | `red-500` | `bg-tds-fill-danger` |
| `text-primary` | `grey-900` | `text-tds-text-primary` |
| `text-secondary` | `grey-700` | `text-tds-text-secondary` |
| `text-brand` | `blue-500` | `text-tds-text-brand` |
| `text-disabled` | `grey-400` | `text-tds-text-disabled` |
| `text-danger` | `red-500` | `text-tds-text-danger` |
| `border-default` | `grey-200` | `border-tds-border-default` |
| `border-focused` | `blue-500` | `border-tds-border-focused` |
| `border-strong` | `grey-400` | `border-tds-border-strong` |
| `bg-brand-weak` | `blue-50` | `bg-tds-bg-brand-weak` |
| `overlay-press` | `oklch(0 0 0 / 0.26)` | `bg-tds-overlay-press` |
| `overlay-scrim` | `oklch(0 0 0 / 0.56)` | `bg-tds-overlay-scrim` |

---

## 3. 타이포그래피

> **서체**: Pretendard Variable → Pretendard → -apple-system → BlinkMacSystemFont → Noto Sans KR → sans-serif  
> (Toss Product Sans의 공식 권장 대체 서체)

| 토큰 | px | weight | line-height | letter-spacing | 용도 |
|---|---|---|---|---|---|
| `h1` | 28 | 700 | 1.30 | -0.020em | 페이지 메인 타이틀 |
| `h2` | 24 | 700 | 1.30 | -0.020em | **프로필 이름, 카드 헤더** |
| `h3` | 22 | 700 | 1.30 | -0.015em | 섹션 제목 |
| `h4` | 20 | 700 | 1.35 | -0.015em | 서브 섹션 |
| `title-1` | 18 | 600 | 1.45 | -0.010em | **카드 타이틀, 모달 헤더** |
| `title-2` | 17 | 600 | 1.45 | -0.010em | 소카드 타이틀 |
| `body-1` | 17 | 400 | 1.50 | -0.005em | 본문 (긴 글) |
| `body-2` | 15 | 400 | 1.50 | -0.005em | **소개글, 본문 설명** |
| `body-3` | 13 | 400 | 1.50 | 0em | **서브텍스트, 캡션, 설명** |
| `label-l` | 17 | 700 | 1.25 | -0.005em | XL/L 버튼 |
| `label-m` | 15 | 600 | 1.25 | -0.005em | **링크 카드 제목, M 버튼** |
| `label-s` | 13 | 600 | 1.25 | 0em | **뱃지, S 버튼, 폼 라벨** |
| `caption` | 12 | 500 | 1.40 | 0em | 날짜, 보조 정보 |
| `caption-s` | 11 | 500 | 1.40 | 0em | 극소 라벨 |

**숫자 표기**: 실시간 데이터 → `tabular-nums` / 강조 → `proportional-nums`

---

## 4. Spacing

베이스 단위 4px. 화면 outer padding **24px**, 리스트 행간 **16px**, 밀접 요소 **8px**.

| 토큰 | px | Tailwind |
|---|---|---|
| `space-1` | 4 | `p-1` / `gap-1` |
| `space-2` | 8 | `p-2` / `gap-2` |
| `space-3` | 12 | `p-3` / `gap-3` |
| `space-4` | 16 | `p-4` / `gap-4` |
| `space-5` | 20 | `p-5` / `gap-5` |
| `space-6` | 24 | `p-6` / `gap-6` — 화면 outer padding |
| `space-8` | 32 | `p-8` |
| `space-10` | 40 | `p-10` |
| `space-12` | 48 | `p-12` |

---

## 5. Radius

| 토큰 | px | Tailwind | 용도 |
|---|---|---|---|
| `radius-xs` | 4 | `rounded-tds-xs` | small badges |
| `radius-s` | 8 | `rounded-tds-s` | inline tags |
| `radius-m` | 12 | `rounded-tds-m` | **텍스트 필드, 이모지 아이콘** |
| `radius-l` | 14 | `rounded-tds-l` | L button (48px) |
| `radius-xl` | 16 | `rounded-tds-xl` | **카드, XL button (56px)** |
| `radius-2xl` | 20 | `rounded-tds-2xl` | **sheets, dialogs, 모달** |
| `radius-3xl` | 24 | `rounded-tds-3xl` | big cards / sections |
| `radius-4xl` | 32 | `rounded-tds-4xl` | hero blocks |
| `radius-full` | 999 | `rounded-tds-full` | **칩(Chip), 프로필 뱃지** |

> ⚠️ iOS squircle/blob 라운드 금지 — 위 9단 ladder만 사용

---

## 6. Elevation

| 토큰 | Tailwind | 용도 |
|---|---|---|
| `shadow-tds-1` | `shadow-tds-1` | **기본 카드** |
| `shadow-tds-2` | `shadow-tds-2` | **호버 카드**, tooltip |
| `shadow-tds-3` | `shadow-tds-3` | **dialog, modal** |
| `shadow-tds-toast` | `shadow-tds-toast` | toast |

배경은 평면 기본. 그라디언트는 3가지 예외만 허용:
1. bottom CTA 위쪽 `white → transparent` 보호 그라디언트
2. 로딩 버튼 내부 radial glow
3. yellow→orange 일러스트 그라디언트

---

## 7. Motion

| 토큰 | 값 | CSS 변수 | 용도 |
|---|---|---|---|
| `ease-tds` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | `var(--ease-tds)` | 기본 ease-out-expo |
| `ease-out-tds` | `cubic-bezier(0.16, 1, 0.3, 1)` | `var(--ease-out-tds)` | snappy sheet 진입 |
| `dur-fast` | `120ms` | `var(--dur-fast)` | **button press** |
| `dur-base` | `200ms` | `var(--dur-base)` | **hover, toggle** |
| `dur-slow` | `320ms` | `var(--dur-slow)` | sheet, dialog |

규칙: 바운스 오버슈트 없음, 320ms 초과 fade 없음, parallax 없음, skeleton shimmer 없음 (3-dot loader 사용)

---

## 8. 컴포넌트 명세

### 8.1 카드 (Card)
- 배경: `white` / 테두리: `1px border-default (grey-200)` / 반경: `radius-xl (16px)`
- 그림자: `shadow-tds-1` / 호버: `shadow-tds-2` + `border-focused/20`
- 활성: `overlay-press` (black 26%) overlay

### 8.2 버튼 (Button)
| 사이즈 | height | radius | font |
|---|---|---|---|
| XL | 56px | radius-xl (16px) | label-l (17px/700) |
| L | 48px | radius-l (14px) | label-l (17px/700) |
| M | 40px | radius-m (12px) | label-m (15px/600) |
| S | 32px | 10px | label-s (13px/600) |

- Primary: `bg-fill-brand hover:bg-blue-600 text-white`
- Secondary: `bg-fill-secondary hover:bg-grey-200 text-text-primary`
- Ghost: `text-text-brand` (보더/배경 없음)
- disabled: 컴포넌트 전체 `opacity-30` (부분 회색 처리 금지)

### 8.3 칩 (Chip)
- height: 34px / radius: `radius-full (999px)`
- Brand variant: `bg-blue-50 text-blue-500 font-semibold`
- Default: `1px border-default bg-white`
- Active: `bg-grey-900 text-white`

### 8.4 텍스트 필드 (TextField)
- height: 48px / radius: `radius-m (12px)`
- resting: `bg-grey-100 border-1 border-default`
- focus: `bg-white border-1.5 border-focused` + `ring-2 ring-blue-500/20`

### 8.5 링크 카드 (LinkCard — 프로젝트 커스텀)
- shadcn/ui `Card` 래핑 / 이모지 영역: `w-11 h-11 rounded-tds-m bg-fill-secondary`
- 제목: `label-m` / 서브: `body-3 text-grey-600` / 설명: `body-3 text-disabled`
- 전환: `duration-[200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]`

---

## 9. ⚠️ Do / Don't

**DO**
- 화면당 단일 강조색 — `fill-brand` 하나만 CTA에 사용
- Product 카피: 해요체 (`-요`), 위임형, 일상어
- 에러: "Navigating error" 원칙 — 멈추지 않고 다음으로 안내
- 버튼 라벨: 일어날 일을 직접 말함 (`송금하기`, `저장`, `다음`)
- 아이콘: `currentColor` 상속 (외부 color 직접 주입 금지)
- pressed: `overlay-press(26%)` / disabled: 전체 노드 `opacity-30`

**DON'T**
- 그라디언트를 chrome에 사용 (3가지 예외만 허용)
- iOS squircle/blob 라운드 사용 — 9단 radius ladder만 허용
- 2px 장식 보더 / 컬러 left-rail accent 카드
- skeleton shimmer (3-dot loader 사용)
- 320ms 초과 fade, 바운스 오버슈트, parallax
- inner shadow (pressed는 overlay)
- CSS Modules (`.module.css`) — Tailwind 유틸리티 클래스로 통일
- `button-primary` + `bottom-cta` 동시 사용 (액션 위계 붕괴)
- 격식체(`~합니다`), ALL CAPS 영문 라벨, 헤딩에 `!`

---

## 10. Responsive

- Mobile-first (≤640px): 단일 컬럼, `bottom-cta`, `bottom-sheet`
- Touch target: 최소 44×44px 보장
- 모바일/태블릿 모두 단일 컬럼 권장 (multi-column 금지)

---

> **비고**: 세부 OKLCH 색상 값은 `src/app/globals.css`의 `@theme` 블록에 Tailwind v4 유틸리티(`text-tds-*`, `bg-tds-*`, `rounded-tds-*`, `shadow-tds-*`)로 등록되어 있습니다.
