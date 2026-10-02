# 💙 토스 디자인 시스템 (TDS - Toss Design System) 가이드

마이링크(MyLink) 서비스는 **[shadcn/ui](https://ui.shadcn.com/)** 컴포넌트 아키텍처 위에 **토스 디자인 시스템(TDS)**의 핵심 철학과 비주얼 언어를 융합하여 구축합니다.

---

## 1. 디자인 철학 (Design Philosophy)

1. **Simple & Intuitive (단순함과 직관성)**:
   - 불필요한 장식과 복잡한 요소를 배제하고, 사용자가 필요한 정보(프로필, 링크)에 1초 만에 집중할 수 있도록 직관적인 레이아웃을 제공합니다.
2. **Smooth & Friendly (부드럽고 친근한 곡률)**:
   - 각진 모서리 대신 토스 특유의 넉넉한 곡률(`16px ~ 24px`, `rounded-2xl`, `rounded-3xl`)을 사용하여 부드럽고 친근한 감성을 전달합니다.
3. **High Contrast & Clarity (명확한 정보 전달)**:
   - 배경은 깨끗한 오프화이트/라이트 그레이(`grey-50`, `#F2F4F6`), 글자는 선명한 먹색(`grey-900`, `#191F28`)을 사용하여 최상의 가독성을 보장합니다.
4. **Delightful Micro-interactions (경쾌한 인터랙션 피드백)**:
   - 버튼과 링크 카드를 누를 때 부드러운 스케일 다운(`active:scale-[0.98]`)과 미세한 그림자 변화를 통해 물리적 터치 피드백을 제공합니다.

---

## 2. 컬러 시스템 (Color Palette)

### 2.1 Brand & Primary Colors
* **Toss Blue (`#3182F6`)**: 토스를 상징하는 시그니처 프라이머리 컬러. 주요 액션 버튼(CTA), 활성화 뱃지, 링크 강조에 사용.
* **Toss Blue Light (`#E8F3FF`)**: 은은한 블루 배경, 태그, 하이라이트 칩에 사용.
* **Toss Blue Dark (`#1B64DA`)**: 버튼 호버/클릭 액티브 상태에 사용.

### 2.2 Grayscale (Toss Grey Scale)
| 토큰 | 헥스 코드 | 설명 및 용도 |
| :--- | :--- | :--- |
| **`grey-50`** | `#F9FAFB` | 전체 페이지 기본 배경색 (부드러운 오프화이트) |
| **`grey-100`** | `#F2F4F6` | 세컨더리 배경, 인셋 영역, 비활성 버튼 배경 |
| **`grey-200`** | `#E5E8EB` | 카드 테두리(Border), 구분선(Divider) |
| **`grey-400`** | `#B0B8C1` | 비활성 텍스트, 플레이스홀더 |
| **`grey-600`** | `#6B7684` | 보조 설명 텍스트, 날짜, 서브라벨 |
| **`grey-700`** | `#4E5968` | 본문 텍스트 (Body Copy) |
| **`grey-900`** | `#191F28` | 헤드라인, 이름, 주요 타이틀 텍스트 (거의 검은색에 가까운 진한 먹색) |
| **`white`** | `#FFFFFF` | 링크 카드 및 모달 컨테이너 배경색 |

---

## 3. 타이포그래피 (Typography)

* **Font Family**: 시스템 기본 산세리프 (`Pretendard`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`)
* **타이포 계층 구조**:
  - **Title 1 (이름/메인 타이틀)**: `24px ~ 28px`, Bold (700), Line Height `1.3`
  - **Subtitle (직업 뱃지/섹션 제목)**: `14px ~ 16px`, SemiBold (600), Line Height `1.4`
  - **Body (소개글, 링크 제목)**: `15px ~ 16px`, Medium (500) / Regular (400), Line Height `1.5`
  - **Caption (서브링크 설명, 날짜)**: `13px`, Regular (400), Line Height `1.4`

---

## 4. 컴포넌트 가이드라인 (shadcn/ui + TDS)

### 4.1 링크 카드 (TDS Link Card)
* **배경 & 테두리**: 순백색 `#FFFFFF`, 1px 섬세한 테두리(`border-grey-200`), 반경 `rounded-2xl (16px)`
* **그림자 (Elevation)**: 과도한 드롭 섀도우 대신 초미세 소프트 섀도우 (`shadow-[0_2px_8px_rgba(0,0,0,0.04)]`)
* **호버 & 클릭**:
  - `hover:border-[#3182F6]/30`, `hover:shadow-md`
  - `active:scale-[0.98] transition-all duration-150`

### 4.2 프로필 섹션 (TDS Profile Hero)
* 원형 아바타 (반경 `rounded-full`), 정중앙 정렬
* 파란색 체크 뱃지 또는 토스 블루 칩 (`bg-[#E8F3FF] text-[#3182F6] font-semibold px-3 py-1 rounded-full`)
* 여백이 넉넉한 카드 레이아웃

### 4.3 버튼 (shadcn/ui Button)
* **Primary Button**: `bg-[#3182F6] hover:bg-[#1B64DA] text-white font-semibold rounded-xl h-12 px-6 shadow-sm active:scale-[0.98]`
* **Secondary Button**: `bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] font-semibold rounded-xl h-12 px-6`
