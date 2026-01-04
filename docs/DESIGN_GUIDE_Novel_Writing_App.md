# Design Guide
## 소설 쓰기 웹 애플리케이션 - MVP

---

## 1. 디자인 철학

### 1.1 핵심 원칙

> **"창작에 방해되지 않는 디자인"**

1. **미니멀리즘**: 불필요한 요소를 제거하고 콘텐츠에 집중
2. **일관성**: 전체 앱에서 통일된 디자인 언어 사용
3. **접근성**: 모든 사용자가 쉽게 사용할 수 있는 인터페이스
4. **성능**: 빠른 로딩과 부드러운 인터랙션

### 1.2 디자인 목표

- **글쓰기 몰입도 극대화**: 에디터는 최대한 방해 요소 없이
- **직관적인 내비게이션**: 3클릭 이내에 모든 기능 접근
- **눈의 피로 최소화**: 장시간 작업에 적합한 색상과 타이포그래피

---

## 2. 컬러 시스템

### 2.1 라이트 모드

```css
/* Primary Colors */
--primary-50:  #f0f9ff;
--primary-100: #e0f2fe;
--primary-500: #3b82f6;  /* Main Brand Color */
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Neutral Colors */
--neutral-50:  #fafafa;
--neutral-100: #f5f5f5;
--neutral-200: #e5e5e5;
--neutral-300: #d4d4d4;
--neutral-500: #737373;
--neutral-700: #404040;
--neutral-900: #171717;

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error:   #ef4444;
--info:    #3b82f6;

/* Background & Text */
--bg-primary:   #ffffff;
--bg-secondary: #f5f5f5;
--bg-tertiary:  #e5e5e5;

--text-primary:   #171717;
--text-secondary: #404040;
--text-tertiary:  #737373;
```

### 2.2 다크 모드

```css
/* Primary Colors (동일) */
--primary-500: #3b82f6;
--primary-600: #2563eb;

/* Neutral Colors (Dark) */
--neutral-50:  #18181b;
--neutral-100: #27272a;
--neutral-200: #3f3f46;
--neutral-300: #52525b;
--neutral-500: #a1a1aa;
--neutral-700: #d4d4d8;
--neutral-900: #fafafa;

/* Background & Text (Dark) */
--bg-primary:   #0a0a0a;
--bg-secondary: #18181b;
--bg-tertiary:  #27272a;

--text-primary:   #fafafa;
--text-secondary: #d4d4d8;
--text-tertiary:  #a1a1aa;
```

### 2.3 컬러 사용 가이드

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 앱 배경 | `--bg-primary` | `--bg-primary` |
| 사이드바 | `--bg-secondary` | `--bg-secondary` |
| 에디터 배경 | `#ffffff` | `#18181b` |
| 본문 텍스트 | `--text-primary` | `--text-primary` |
| 버튼 (Primary) | `--primary-500` | `--primary-500` |
| 링크 | `--primary-600` | `--primary-500` |

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
/* 시스템 폰트 스택 (빠른 로딩) */
--font-sans:
  'Pretendard Variable',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  'Noto Sans KR',
  sans-serif;

/* 에디터 전용 (가독성 우선) */
--font-editor:
  'Noto Serif KR',
  'Georgia',
  'Times New Roman',
  serif;

/* 코드/숫자 */
--font-mono:
  'JetBrains Mono',
  'Fira Code',
  'Consolas',
  monospace;
```

### 3.2 폰트 크기 스케일

```css
/* Type Scale (1.250 - Major Third) */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
```

### 3.3 타이포그래피 사용 예시

| 요소 | 폰트 크기 | 폰트 굵기 | 행간 |
|------|----------|----------|------|
| H1 (페이지 제목) | `--text-3xl` | 700 | 1.2 |
| H2 (섹션 제목) | `--text-2xl` | 600 | 1.3 |
| H3 (서브 제목) | `--text-xl` | 600 | 1.4 |
| Body (본문) | `--text-base` | 400 | 1.6 |
| Button | `--text-sm` | 500 | 1.2 |
| Caption | `--text-xs` | 400 | 1.4 |
| **에디터 본문** | `18px` | 400 | 1.8 |

### 3.4 에디터 타이포그래피 (특별 설정)

```css
.editor-content {
  font-family: var(--font-editor);
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-primary);

  /* 한글 최적화 */
  word-break: keep-all;
  word-wrap: break-word;
}

/* 에디터 내 제목 */
.editor-content h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.editor-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
```

---

## 4. 간격(Spacing) 시스템

### 4.1 Spacing Scale (8px 기반)

```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### 4.2 간격 사용 가이드

| 용도 | Spacing |
|------|---------|
| 컴포넌트 내부 패딩 (작음) | `--space-2` |
| 컴포넌트 내부 패딩 (중간) | `--space-4` |
| 컴포넌트 내부 패딩 (큼) | `--space-6` |
| 컴포넌트 간 여백 | `--space-4` ~ `--space-6` |
| 섹션 간 여백 | `--space-8` ~ `--space-12` |
| 페이지 상하 여백 | `--space-16` |

---

## 5. 레이아웃

### 5.1 그리드 시스템

```css
/* 컨테이너 최대 너비 */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

### 5.2 주요 화면 레이아웃

#### 5.2.1 대시보드 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  Header (64px 높이)                                      │
│  [로고] [내 프로젝트] [설정]                 [프로필 ▼]  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Container (max-width: 1280px, padding: 32px)           │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  페이지 제목 (H1)                                │   │
│  │  + 새 프로젝트                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌────────┐  ┌────────┐  ┌────────┐                    │
│  │Project │  │Project │  │Project │                    │
│  │  Card  │  │  Card  │  │  Card  │                    │
│  └────────┘  └────────┘  └────────┘                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

#### 5.2.2 에디터 레이아웃 (핵심!)

```
┌─────────────────────────────────────────────────────────┐
│  Header (56px - 슬림)                                    │
│  [←] 프로젝트명          [저장됨 ✓]      [⚙️] [프로필]  │
├──────────┬──────────────────────────────────────────────┤
│          │                                               │
│ Sidebar  │  Editor Area                                 │
│ (280px)  │  (나머지 공간, max-width: 900px 중앙 정렬)   │
│          │                                               │
│ 📄 Ch1   │  Chapter 1: The Beginning                    │
│ 📄 Ch2   │                                               │
│ 📄 Ch3   │  [B] [I] [U] [H1] [H2]                       │
│          │  ─────────────────────────                  │
│ + 새 챕터│                                               │
│          │  Once upon a time...                         │
│          │                                               │
│          │  (여백: 좌우 80px, 상하 64px)                │
│          │                                               │
├──────────┴──────────────────────────────────────────────┤
│  Footer Bar (48px)                                       │
│  단어: 1,234 | 문자: 6,789 | 오늘: 456                  │
└─────────────────────────────────────────────────────────┘
```

### 5.3 반응형 브레이크포인트

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* 모바일 가로 */
--breakpoint-md: 768px;   /* 태블릿 세로 */
--breakpoint-lg: 1024px;  /* 태블릿 가로 / 작은 노트북 */
--breakpoint-xl: 1280px;  /* 데스크탑 */
```

#### 반응형 동작

| 화면 크기 | 사이드바 | 에디터 너비 | 기타 |
|----------|---------|------------|------|
| < 768px | 숨김 (햄버거 메뉴) | 100% | 모바일 뷰 |
| 768px ~ 1024px | 고정 (240px) | 유동 | 태블릿 뷰 |
| > 1024px | 고정 (280px) | max 900px 중앙 | 데스크탑 뷰 |

---

## 6. 컴포넌트 디자인

### 6.1 버튼 (Buttons)

#### Primary Button
```css
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 0.625rem 1.25rem; /* 10px 20px */
  border-radius: 0.5rem; /* 8px */
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
```

**사용 예시**:
```
┌──────────────────┐
│  새 프로젝트 만들기  │  Primary
└──────────────────┘

┌──────────────┐
│   내보내기    │  Secondary
└──────────────┘

┌──────┐
│ 삭제  │  Danger
└──────┘
```

#### 버튼 크기 변형

| 크기 | 높이 | 패딩 | 폰트 크기 |
|------|------|------|----------|
| Small | 32px | 8px 12px | 14px |
| Medium | 40px | 10px 20px | 14px |
| Large | 48px | 12px 24px | 16px |

### 6.2 입력 필드 (Input Fields)

```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-300);
  border-radius: 0.5rem;
  font-size: var(--text-base);
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
}
```

**예시**:
```
┌──────────────────────────────────────┐
│  프로젝트 제목을 입력하세요...         │
└──────────────────────────────────────┘
```

### 6.3 카드 (Cards)

#### 프로젝트 카드
```css
.project-card {
  background: var(--bg-primary);
  border: 1px solid var(--neutral-200);
  border-radius: 0.75rem; /* 12px */
  padding: 1.5rem;
  transition: all 0.2s;
}

.project-card:hover {
  border-color: var(--primary-500);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
```

**카드 내부 구조**:
```
┌────────────────────────────────┐
│  마법사의 여정              ⋮   │  ← 제목 + 메뉴
│  판타지                         │  ← 장르 (작게)
│                                 │
│  오래된 마법사가 젊은...        │  ← 시놉시스 (2줄)
│                                 │
│  ─────────────────────────     │
│  12,345 단어  |  5일 전 수정    │  ← 메타 정보
└────────────────────────────────┘
```

### 6.4 모달 (Modal)

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  position: relative;
  max-width: 500px;
  margin: 10vh auto;
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}
```

**모달 구조**:
```
┌────────────────────────────────────────┐
│  새 프로젝트 만들기                 ✕  │  ← 헤더
├────────────────────────────────────────┤
│                                         │
│  프로젝트 제목 *                        │
│  ┌───────────────────────────────────┐│
│  │ 제목을 입력하세요...              ││
│  └───────────────────────────────────┘│
│                                         │
│  장르                                   │
│  ┌───────────────────────────────────┐│
│  │ 판타지 ▼                          ││
│  └───────────────────────────────────┘│
│                                         │
├────────────────────────────────────────┤
│                     [취소]  [만들기]   │  ← 푸터
└────────────────────────────────────────┘
```

### 6.5 드롭다운 (Dropdown)

```css
.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--neutral-300);
  border-radius: 0.5rem;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  margin-top: 0.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--neutral-200);
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 200px;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: var(--bg-secondary);
}
```

### 6.6 챕터 리스트 아이템

```
┌─────────────────────────────────────┐
│  📄  Chapter 1: The Beginning    ⋮  │  ← 활성 상태
├─────────────────────────────────────┤  (배경: primary-50)
│  📄  Chapter 2: Journey Begins      │
│  📄  Chapter 3: Dark Forest         │
│                                      │
│  + 새 챕터 추가                      │
└─────────────────────────────────────┘
```

```css
.chapter-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.chapter-item:hover {
  background: var(--bg-secondary);
}

.chapter-item.active {
  background: var(--primary-50);
  color: var(--primary-700);
  font-weight: 500;
}
```

---

## 7. 아이콘 시스템

### 7.1 아이콘 라이브러리

**추천**: Lucide Icons (React)

```bash
npm install lucide-react
```

### 7.2 아이콘 크기

```css
--icon-xs: 14px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

### 7.3 주요 아이콘 매핑

| 기능 | 아이콘 | 크기 |
|------|--------|------|
| 프로젝트 | `BookOpen` | 20px |
| 챕터 | `FileText` | 16px |
| 새로 만들기 | `Plus` | 16px |
| 설정 | `Settings` | 20px |
| 저장됨 | `Check` | 16px |
| 내보내기 | `Download` | 20px |
| 삭제 | `Trash2` | 16px |
| 편집 | `Edit3` | 16px |
| 검색 | `Search` | 20px |
| 메뉴 | `Menu` | 24px |
| 닫기 | `X` | 20px |
| 굵게 | `Bold` | 18px |
| 기울임 | `Italic` | 18px |

---

## 8. 애니메이션 & 인터랙션

### 8.1 트랜지션 타이밍

```css
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;

/* Easing */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

### 8.2 공통 애니메이션

#### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s var(--ease-out);
}
```

#### Slide In (사이드바)
```css
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
```

#### Scale (모달)
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 8.3 호버 효과

```css
/* 버튼 */
.interactive-element {
  transition: all var(--transition-base) var(--ease-in-out);
}

.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 링크 */
a {
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color var(--transition-base);
}

a:hover {
  text-decoration-color: currentColor;
}
```

---

## 9. 에디터 특별 디자인

### 9.1 에디터 툴바

```
┌─────────────────────────────────────────────────────┐
│  [B] [I] [U] │ [H1] [H2] [H3] │ [•] [1] │ [""]    │
└─────────────────────────────────────────────────────┘
```

```css
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--neutral-200);
  background: var(--bg-secondary);
}

.toolbar-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
}

.toolbar-button:hover {
  background: var(--neutral-200);
}

.toolbar-button.active {
  background: var(--primary-100);
  color: var(--primary-700);
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--neutral-300);
  margin: 0 0.5rem;
}
```

### 9.2 에디터 컨텐츠 스타일

```css
.editor-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 5rem;
  min-height: calc(100vh - 104px);
}

.editor-content {
  font-family: var(--font-editor);
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-primary);
}

/* 선택 영역 하이라이트 */
.editor-content ::selection {
  background: var(--primary-100);
  color: var(--primary-900);
}

/* 포커스 상태 */
.editor-content:focus {
  outline: none;
}
```

### 9.3 자동 저장 인디케이터

```
[저장 중... ⟳]  →  [저장됨 ✓]
```

```css
.save-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: var(--text-sm);
  transition: all 0.3s;
}

.save-indicator.saving {
  background: var(--warning);
  color: white;
}

.save-indicator.saved {
  background: var(--success);
  color: white;
  animation: pulse 0.5s;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## 10. 다크 모드 전환

### 10.1 토글 버튼

```
☀️  ◯━━━  🌙    (라이트 모드)
☀️  ━━━◯  🌙    (다크 모드)
```

```css
.theme-toggle {
  position: relative;
  width: 60px;
  height: 32px;
  background: var(--neutral-200);
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.3s;
}

.theme-toggle-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.theme-toggle.dark .theme-toggle-thumb {
  transform: translateX(28px);
}
```

### 10.2 전환 애니메이션

```css
/* 부드러운 색상 전환 */
* {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}
```

---

## 11. 상태 & 피드백

### 11.1 토스트 알림

```
┌──────────────────────────────────┐
│  ✓  프로젝트가 생성되었습니다.    │
└──────────────────────────────────┘
```

```css
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--neutral-200);
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: slideInUp 0.3s ease;
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast.success {
  border-left: 4px solid var(--success);
}

.toast.error {
  border-left: 4px solid var(--error);
}
```

### 11.2 로딩 스피너

```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--neutral-200);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 11.3 빈 상태 (Empty State)

```
┌─────────────────────────────────────┐
│                                      │
│          📚                          │
│                                      │
│     아직 프로젝트가 없습니다          │
│     첫 소설을 시작해보세요!           │
│                                      │
│     ┌──────────────────┐            │
│     │  + 새 프로젝트    │            │
│     └──────────────────┘            │
│                                      │
└─────────────────────────────────────┘
```

```css
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state-title {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state-description {
  font-size: var(--text-base);
  margin-bottom: 2rem;
}
```

---

## 12. 접근성 (Accessibility)

### 12.1 포커스 스타일

```css
/* 키보드 포커스만 표시 */
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* 마우스 클릭 시 outline 제거 */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### 12.2 색상 대비

- **WCAG AA 준수**: 본문 텍스트 대비율 최소 4.5:1
- **큰 텍스트**: 대비율 최소 3:1

| 조합 | 대비율 | 통과 |
|------|--------|------|
| `--text-primary` / `--bg-primary` | 16:1 | ✅ AAA |
| `--primary-500` / white | 4.8:1 | ✅ AA |

### 12.3 스크린 리더 지원

```html
<!-- 버튼 -->
<button aria-label="새 프로젝트 만들기">
  <PlusIcon />
</button>

<!-- 입력 필드 -->
<label for="project-title" class="sr-only">프로젝트 제목</label>
<input id="project-title" placeholder="제목을 입력하세요" />

<!-- 로딩 -->
<div role="status" aria-live="polite">
  저장 중...
</div>
```

---

## 13. 모바일 디자인

### 13.1 모바일 헤더

```
┌─────────────────────────┐
│ ☰  마법사의 여정    ⋮  │
└─────────────────────────┘
```

### 13.2 모바일 에디터

```
┌─────────────────────────┐
│ ←  Chapter 1       💾   │  ← 상단 바
├─────────────────────────┤
│                         │
│  Once upon a time...    │
│                         │
│  (전체 화면)            │
│                         │
├─────────────────────────┤
│ [B][I][U] [H1][H2] [••] │  ← 하단 툴바
└─────────────────────────┘
```

### 13.3 터치 타겟

```css
/* 최소 44x44px (Apple HIG) */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* 버튼 간격 */
.mobile-toolbar {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
}
```

---

## 14. 성능 최적화

### 14.1 이미지 최적화

```jsx
// Next.js Image 컴포넌트 사용
import Image from 'next/image';

<Image
  src="/cover.jpg"
  width={300}
  height={400}
  alt="프로젝트 커버"
  loading="lazy"
/>
```

### 14.2 폰트 로딩

```jsx
// next/font 사용
import { Noto_Serif_KR } from 'next/font/google';

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});
```

### 14.3 스켈레톤 로딩

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-200) 25%,
    var(--neutral-100) 50%,
    var(--neutral-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 15. 디자인 체크리스트 (MVP)

### Phase 1 필수 구현

- [ ] 컬러 시스템 (라이트 + 다크)
- [ ] 타이포그래피 (시스템 폰트 + 에디터 폰트)
- [ ] 버튼 (Primary, Secondary, Danger)
- [ ] 입력 필드
- [ ] 카드 (프로젝트 카드)
- [ ] 모달
- [ ] 에디터 레이아웃
- [ ] 에디터 툴바
- [ ] 챕터 리스트
- [ ] 자동 저장 인디케이터
- [ ] 토스트 알림
- [ ] 모바일 반응형
- [ ] 다크 모드 토글

### Phase 2 추가

- [ ] 드롭다운 메뉴
- [ ] 드래그 앤 드롭 인터랙션
- [ ] 고급 애니메이션
- [ ] 캐릭터 카드 디자인
- [ ] 통계 차트

---

## 16. 디자인 시스템 구현 예시

### 16.1 Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'sans-serif'],
        editor: ['Noto Serif KR', 'serif'],
      },
      spacing: {
        // 8px 기반
      },
    },
  },
  darkMode: 'class',
};
```

### 16.2 shadcn/ui 컴포넌트 활용

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
```

---

## 17. 참고 디자인 시스템

### 영감을 얻을 수 있는 시스템

1. **Notion**: 에디터 디자인
2. **Linear**: 모던한 UI/UX
3. **Obsidian**: 다크 모드, 타이포그래피
4. **Scrivener**: 챕터 구조
5. **Google Docs**: 협업 인터페이스

---

## 마무리

> [!TIP]
> **디자인 우선순위 (MVP)**
>
> 1. ✅ **에디터 경험**: 타이포그래피 + 자동 저장
> 2. ✅ **직관적 내비게이션**: 챕터 리스트
> 3. ✅ **다크 모드**: 장시간 작업 지원
> 4. ✅ **반응형**: 모바일 기본 지원
>
> 화려한 애니메이션보다 **빠르고 안정적인 경험**이 우선입니다!

---

이 디자인 가이드는 Figma나 디자인 도구 없이도 **개발하면서 바로 적용할 수 있도록** 작성되었습니다.
