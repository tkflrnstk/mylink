# 📄 마이링크 (MyLink) 서비스 PRD (제품 기능 명세서)

> **프로젝트 명**: 마이링크 (MyLink)  
> **버전**: v1.4.0 (shadcn/ui + 토스 디자인 시스템 TDS 구축 확정)  
> **작성일**: 2026-10-02  
> **문서 상태**: Approved (TDS 디자인 시스템 & 요구사항 확정)

---

## 1. 제품 개요 (Product Overview)

### 1.1 배경 및 목적
* **개요**: 누구나 자신만의 프로필과 주요 링크(소셜 미디어, 블로그, 포트폴리오, 연락처 등)를 하나의 가볍고 스타일리시한 웹 페이지로 묶어 공유할 수 있는 **링크트리 클론 서비스**입니다.
* **디자인 시스템 원칙**:
  - 모든 UI 컴포넌트 개발 및 스타일 확장은 **[shadcn/ui](https://ui.shadcn.com/)** 컴포넌트 아키텍처 위에 **토스 디자인 시스템(TDS - Toss Design System)**의 비주얼 언어(토스 블루 `#3182F6`, 부드러운 곡률 `rounded-2xl`, 고대비 텍스트, 경쾌한 탭 인터랙션)를 입혀 구축합니다.
  - 최신 **Tailwind CSS v4 (CSS-First 아키텍처, 별도 config 파일 불필요)**와 결합하여 고품질의 재사용 가능한 모듈러 UI를 제공합니다.
* **시연(Demo) 및 단계별 전략**:
  - 현재 시연 단계에서는 백엔드/대시보드 구축 전 **`LocalStorage` 기반의 인라인 프로필 편집 및 동적 테마 전환**을 통해 핵심 사용자 경험(UX)을 시연합니다.

---

## 2. 사용자 시나리오 (User Scenarios)

### 2.1 방문자 관점 (Visitor Persona Scenario)
방문자가 다른 사람의 마이링크 페이지를 방문하여 주요 콘텐츠에 접근하는 단계별 시나리오입니다.

* **1단계 (접속)**: 사용자는 소셜 미디어(인스타그램, GitHub 등) 프로필에 게시된 고유 마이링크 URL(`mylink.kr/username`)을 이동하기 위해 클릭한다.
* **2단계 (프로필 열람)**: 사용자는 크리에이터/개발자의 브랜딩 및 직업 정체성을 한눈에 파악하기 위해 화면 상단의 프로필 아바타, 뱃지(예: `⚓ 정부 항해사`), 소개글을 확인한다.
* **3단계 (링크 상호작용)**: 사용자는 관심 있는 외부 콘텐츠(GitHub 저장소, 블로그, 연락처)로 즉시 이동하기 위해 정돈된 링크 입체 카드를 클릭한다.
* **4단계 (브랜드 경험)**: 사용자는 마이링크의 고유한 분위기를 즐기기 위해 닌텐도 레트로 메탈, 오션 블루 등 적용된 디자인 테마의 비주얼 요소를 감상한다.

### 2.2 소유자 관점 (Owner Persona Scenario)
소유자가 자신의 마이링크 프로필 및 링크 항목을 직접 추가·수정·삭제하고 관리하는 단계별 시나리오입니다.

* **1단계 (관리 진입)**: 사용자는 자신의 프로필 데이터를 업데이트하기 위해 화면 상단 플로팅 배너의 `⚡ 프로필 편집` 버튼을 클릭한다.
* **2단계 (프로필 정보 수정)**: 사용자는 변경된 본인의 직함이나 최신 소개글을 반영하기 위해 편집 모달의 이름, 뱃지 라벨, 소개글 필드를 수정한다.
* **3단계 (링크 항목 CRUD)**: 사용자는 새로운 프로젝트나 SNS 접점을 공유하기 위해 링크 제목, URL, 이모티콘 및 카테고리 태그를 추가/수정/삭제한다.
* **4단계 (디자인 테마 전환)**: 사용자는 자신의 마이링크 페이지 분위기를 다채롭게 전환하기 위해 테마 선택기에서 `🎮 닌텐도 레트로`, `🌊 오션 블루`, `⚡ 네오브루탈리즘` 중 원하는 스타일을 고른다.
* **5단계 (저장 및 동기화)**: 사용자는 수정된 전체 프로필 데이터를 브라우저에 지속 보존하고 즉시 반영하기 위해 `LocalStorage에 저장 💾` 버튼을 클릭한다.

---

## 3. 방문자 메인화면 와이어프레임 (ASCII Art Wireframe)

방문자가 마이링크 페이지에 접속했을 때 보게 되는 레트로 콘솔 메탈 페이스플레이트 레이아웃의 아스키 아트 와이어프레임입니다.

```text
+-----------------------------------------------------------------------+
|  [MyLink.kr]                                         (● 온라인 접속중)  |
+-----------------------------------------------------------------------+
|  [프로필]   링크 (3)   소개                            [ver 2026]      |
+-----------------------------------------------------------------------+
|                                                                       |
|                     +---------------------------+                     |
|                     |        ( Avatar )         |                     |
|                     |            노             | ⚓                  |
|                     +---------------------------+                     |
|                                                                       |
|                                 노기훈                                 |
|               [ ⚓ 정부 항해사 ]  [ 💻 개발자 ]  [ ✨ 바이브 코딩 ]     |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   | 🌊 바다 위에서는 안전한 항로를 이끄는 정부 항해사이자,            |   |
|   | 코드 위에서는 바이브 코딩으로 새로운 가능성을 개척하는 개발자입니다. |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
+-----------------------------------------------------------------------+
|  ● 링크 바로가기                                          클릭 시 이동 ➔ |
+-----------------------------------------------------------------------+
|  +-----------------------------------------------------------------+  |
|  | [🐙]  GitHub 코드 저장소                        [코드]     [ ▶ ] |  |
|  |       @tkflrnstk · 개발 프로젝트와 소스 코드 모음                |  |
|  +-----------------------------------------------------------------+  |
|  | [📝]  기술 & 항해 블로그                         [기록]     [ ▶ ] |  |
|  |       blog.nolink.dev · 공부 기록과 바이브 코딩 이야기            |  |
|  +-----------------------------------------------------------------+  |
|  | [✉️]  이메일 연락하기                           [문의]     [ ▶ ] |  |
|  |       contact@example.com · 프로젝트 제안 및 문의                |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
|  © 2026 노기훈 · 마이링크 (MyLink)                    [한국어 버전]    |
+-----------------------------------------------------------------------+
```

---

## 4. 디자인 시스템 명세 (Design System: shadcn/ui + Toss Design System)

> **세부 명세**: [`docs/design.md`](file:///c:/Users/pj/pjwk1/docs/design.md) 문서를 단일 소스로 사용 (v2.0, TDS Mobile 기반)

### 4.1 shadcn/ui + TDS 융합 원칙
* **컴포넌트 기반 아키텍처**: 모든 핵심 UI 요소(버튼, 다이얼로그 모달, 카드, 뱃지, 입력 인풋 등)는 `shadcn/ui` 컴포넌트(`src/components/ui/*`)를 기반으로 확장·커스터마이징합니다.
* **TDS 컬러 시스템** (OKLCH `@toss/tds-colors` v0.1.0 발행값 기준):
  - **Toss Blue**: `--color-tds-blue-500: oklch(0.620 0.191 258)` (`#3182F6`) — 화면당 단 하나의 CTA
  - **Brand Weak**: `--color-tds-blue-50: oklch(0.959 0.020 250)` (`#E8F3FF`) — 칩/뱃지/아이콘 배경
  - **Greyscale**: `grey-900` ~ `grey-50` 10단계 cool-blue 중성색 (OKLCH 균질화)
  - **Semantic alias**: `fill-brand`, `text-primary`, `border-default` 등 semantic 토큰으로만 호출, base 팔레트 직접 참조 금지
* **Tailwind CSS v4 (CSS-First)**:
  - `src/app/globals.css`의 `@theme` 블록에 TDS 토큰을 Tailwind 유틸리티로 등록 (`rounded-tds-xl`, `shadow-tds-1`, `text-tds-text-primary` 등)
  - 별도의 `tailwind.config.js` 없이 CSS 변수 체계로 중앙 집중 관리
  - **⚠️ CSS Modules(`.module.css`) 사용 금지**: 모든 스타일링은 Tailwind CSS 유틸리티 클래스로 통일합니다. 컴포넌트별 스코프 스타일이 필요한 경우에도 `*.module.css` 파일을 생성하지 않으며, Tailwind의 임의값(`[...]`) 문법 또는 `globals.css` 내 `@layer` 블록을 활용합니다.
* **TDS 타이포그래피 계층** (Pretendard Variable 서체):
  - `h2` (24px/700/1.30/-0.020em): 프로필 이름, 페이지 제목
  - `title-1` (18px/600/1.45/-0.010em): 섹션 제목, 모달 헤더
  - `body-2` (15px/400/1.50/-0.005em): 본문 소개글
  - `label-m` (15px/600/1.25/-0.005em): 링크 카드 제목, 버튼(M)
  - `body-3` (13px/400/1.50): 서브텍스트, 캡션, 설명
  - `label-s` (13px/600/1.25): 뱃지, 소형 버튼
* **TDS Radius 토큰**:
  - `radius-m (12px)`: 텍스트 필드, 이모지 아이콘 영역
  - `radius-xl (16px)`: **카드** (shadcn/ui Card 기본값)
  - `radius-2xl (20px)`: 모달, 다이얼로그
  - `radius-full (999px)`: **칩(Chip), 프로필 뱃지**
  - ⚠️ iOS squircle/blob 금지 — 위 9단 ladder만 허용
* **TDS Elevation 토큰**:
  - `shadow-tds-1`: 기본 카드 (`0 1px 2px navy-900/0.04`)
  - `shadow-tds-2`: 호버 카드 (`0 4px 12px navy-900/0.06`)
  - `shadow-tds-3`: 다이얼로그 (`0 12px 32px navy-900/0.10`)
* **TDS Motion 토큰**:
  - `ease-tds`: `cubic-bezier(0.22, 0.61, 0.36, 1)` — 기본 ease-out-expo
  - `dur-fast (120ms)`: 버튼 press / `dur-base (200ms)`: hover, toggle / `dur-slow (320ms)`: sheet
  - 바운스 오버슈트 없음, 320ms 초과 fade 없음, skeleton shimmer 없음
* **서체**: Pretendard Variable (CDN) — Toss Product Sans의 공식 권장 대체 서체
* **아이콘 시스템**: `lucide-react` (TDS Icon의 Lucide 대체, 24px 그리드 / 1.5px stroke)

### 4.2 TDS Do / Don't (핵심)
| DO ✅ | DON'T ❌ |
| :--- | :--- |
| 화면당 단일 강조색 (`fill-brand` 하나만 CTA) | 그라디언트를 카드/배경에 사용 (3가지 예외만 허용) |
| Product 카피: 해요체(`-요`) + 위임형 | iOS squircle/blob 라운드 사용 |
| 버튼 라벨: 일어날 일을 직접 표현 (`저장`, `다음`) | 2px 장식 보더 / 컬러 left-rail accent 카드 |
| pressed: `overlay-press(26%)` / disabled: `opacity-30` | skeleton shimmer (3-dot loader 사용) |
| 아이콘: `currentColor` 상속 | CSS Modules (`.module.css`) |

---

## 5. 상세 기능 명세 (Detailed Specifications)

### F-1. 시연용 로컬 데이터 관리 (LocalStorage Demo - Phase 1)
| 기능 ID | 기능 명 | 상세 설명 | 구현 상태 |
| :--- | :--- | :--- | :--- |
| **DEMO-01** | LocalStorage 연동 | `mylink_demo_profile_v1` 키를 사용해 프로필 정보(이름, 소개글, 뱃지, 테마, 링크) 저장 및 자동 로드 | ✅ 완료 |
| **DEMO-02** | 인라인 프로필 편집 | 대시보드 없이 팝업 모달에서 프로필 실시간 수정 및 LocalStorage 반영 | ✅ 완료 |
| **DEMO-03** | 테마 스위처 | 🎮 `닌텐도 레트로 메탈` / 🌊 `오션 블루 글라스` / ⚡ `네오브루탈리즘 팝` 테마 실시간 전환 | ✅ 완료 |
| **DEMO-04** | 데이터 초기화 | 시연 복구를 위해 로컬 데이터를 기본 프로필(노기훈, 정부 항해사)로 리셋하는 기능 | ✅ 완료 |
| **DS-01** | shadcn/ui 환경 구축 | Tailwind CSS v4 + components.json + utils.ts 초기화 완료 | ✅ 완료 |

### F-2. 링크 목록 페이지 (`/links`) — TDS 적용
| 기능 ID | 기능 명 | 상세 설명 | 구현 상태 |
| :--- | :--- | :--- | :--- |
| **LINK-01** | 링크 목록 페이지 | `/links` 라우트. `src/data/links.json` 더미 데이터를 Server Component에서 직접 import하여 렌더링 | ✅ 완료 |
| **LINK-02** | TDS 타이포그래피 적용 | design.md §3 기준 — 링크 제목 `15px SemiBold`, 서브텍스트 `13px Regular/grey-600`, 설명 `13px Regular/grey-400` | ✅ 완료 |
| **LINK-03** | TDS 컬러 토큰 적용 | 배경 `grey-50 (#F9FAFB)`, 카드 테두리 `grey-200 (#E5E8EB)`, Toss Blue Light 칩 `#E8F3FF/#3182F6` | ✅ 완료 |
| **LINK-04** | 재사용 컴포넌트 분리 | `LinkCard` (shadcn/ui Card+Badge 기반) + `LinkList` (ul/li 시맨틱 + 빈 상태 처리) | ✅ 완료 |
| **LINK-05** | 더미 페이지 6개 | `/p/[slug]` 동적 라우트로 6개 시연용 페이지 제공 (`github`, `blog`, `contact`, `linkedin`, `portfolio`, `youtube`) | ✅ 완료 |

#### 더미 페이지 라우트 목록
| 경로 | 제목 | 설명 |
| :--- | :--- | :--- |
| `/p/github` | GitHub 코드 저장소 | 개발 프로젝트와 오픈소스 코드 모음 |
| `/p/blog` | 기술 & 항해 블로그 | 공부 기록과 바이브 코딩, 항해 이야기 |
| `/p/contact` | 이메일 연락하기 | 프로젝트 제안 및 방명록 문의 |
| `/p/linkedin` | LinkedIn 프로필 | 경력 사항 및 네트워킹 |
| `/p/portfolio` | 포트폴리오 사이트 | 작업물 쇼케이스 및 프로젝트 소개 |
| `/p/youtube` | YouTube 채널 | 개발 브이로그 & 항해 영상 |


### F-2. 풀스택 확장 기능 (Phase 2 & 3 - Future Roadmap)
| 기능 ID | 기능 명 | 상세 설명 | 계획 단계 |
| :--- | :--- | :--- | :--- |
| **AUTH-01** | 사용자 인증 | Google, GitHub 소셜 로그인 및 이메일 가입 (Firebase/Supabase) | Phase 2 |
| **DASH-01** | 관리자 대시보드 | 로그인한 유저 전용 링크/프로필 편집 대시보드 (shadcn/ui Form, Card 기반) | Phase 2 |
| **LINK-02** | Drag & Drop 순서 변경 | 마우스 드래그 기반 링크 카드 순서 재배치 | Phase 3 |
| **STAT-01** | 클릭 수 & 통계 | 공개 링크별 실시간 클릭 트래킹(Click Count) 및 방문자 수 | Phase 3 |

---

## 6. 기술 아키텍처 (Technical Architecture)

* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript 5
* **Design System**: **shadcn/ui** (`components.json`, `@/components/ui`)
* **Styling**: Tailwind CSS v4 (CSS-first, `@theme` 변수 기반)
* **Icons**: `lucide-react`
* **Storage**: Browser `localStorage` (Phase 1) ➔ Firebase Firestore / Supabase PostgreSQL (Phase 2)

---

## 7. 단계별 로드맵 (Milestones)

| 단계 | 주요 작업 내용 | 상태 |
| :--- | :--- | :--- |
| **Phase 1 (Current Demo)** | • LocalStorage 기반 시연용 프로필 페이지<br>• 실시간 데이터/테마 편집 모달<br>• shadcn/ui + Tailwind v4 디자인 시스템 환경 구축 완료 | **✅ 완료 (시연 중)** |
| **Phase 2 (Full-stack MVP)** | • Firebase/Supabase Auth & Firestore 연동<br>• `/[username]` 동적 라우팅 및 shadcn/ui 기반 대시보드 | 대기 |
| **Phase 3 (Production)** | • Drag & Drop, 클릭 통계 분석, 커스텀 도메인 배포 | 대기 |

---

> **비고**: 본 PRD 문서는 shadcn/ui 기반 디자인 시스템 구축 및 Tailwind CSS v4 CSS-first 아키텍처 원칙이 반영되어 `docs/PRD.md`에 최종 저장되었습니다.
