# Coding Convention
## 소설 쓰기 웹 애플리케이션

---

## 1. 개요

이 문서는 프로젝트의 **일관된 코드 품질**과 **협업 효율성**을 위한 코딩 컨벤션을 정의합니다.

### 1.1 핵심 원칙

1. **가독성**: 코드는 작성하는 시간보다 읽는 시간이 더 많다
2. **일관성**: 프로젝트 전체에서 동일한 스타일 유지
3. **단순성**: 복잡한 로직보다 명확한 로직 우선
4. **타입 안전성**: TypeScript의 이점을 최대한 활용

---

## 2. 프로젝트 구조

### 2.1 폴더 구조

```
novel-writer/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # 대시보드 라우트 그룹
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── editor/
│   │   │           └── page.tsx
│   │   └── settings/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── projects/
│   │   └── chapters/
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── dialog.tsx
│   ├── editor/                   # 에디터 관련
│   │   ├── Editor.tsx
│   │   ├── Toolbar.tsx
│   │   └── AutoSave.tsx
│   ├── project/                  # 프로젝트 관련
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectList.tsx
│   │   └── CreateProjectModal.tsx
│   └── layout/                   # 레이아웃 컴포넌트
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/                          # 유틸리티 & 헬퍼
│   ├── utils.ts
│   ├── db.ts                     # Prisma 클라이언트
│   ├── auth.ts                   # NextAuth 설정
│   └── validations/              # Zod 스키마
│       ├── project.ts
│       └── chapter.ts
├── hooks/                        # Custom React Hooks
│   ├── useAutoSave.ts
│   ├── useProject.ts
│   └── useChapter.ts
├── types/                        # TypeScript 타입
│   ├── index.ts
│   ├── project.ts
│   └── chapter.ts
├── prisma/                       # Prisma 스키마
│   ├── schema.prisma
│   └── migrations/
├── public/                       # 정적 파일
├── styles/                       # 글로벌 스타일
│   └── globals.css
├── .env.local                    # 환경 변수
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 2.2 파일 명명 규칙

| 타입 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `ProjectCard.tsx` |
| 유틸리티 함수 | camelCase | `utils.ts`, `formatDate.ts` |
| 훅 (Hooks) | camelCase + use 접두사 | `useAutoSave.ts` |
| 타입/인터페이스 | PascalCase | `project.ts`, `types.ts` |
| API 라우트 | kebab-case | `route.ts` |
| 페이지 | 소문자 | `page.tsx`, `layout.tsx` |

---

## 3. TypeScript 규칙

### 3.1 기본 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 3.2 타입 정의

#### ✅ 좋은 예

```typescript
// types/project.ts
export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  genre: string | null;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProjectInput = Pick<Project, 'title' | 'description' | 'genre'>;

export type UpdateProjectInput = Partial<CreateProjectInput>;
```

#### ❌ 나쁜 예

```typescript
// any 사용 금지
const project: any = { ... };

// implicit any
function updateProject(data) { ... }
```

### 3.3 타입 vs 인터페이스

**인터페이스 사용**:
- 객체 형태의 데이터 구조
- 확장 가능성이 있는 경우

```typescript
interface User {
  id: string;
  email: string;
}

interface Author extends User {
  username: string;
}
```

**타입 사용**:
- Union, Intersection
- Utility Types 활용

```typescript
type Status = 'draft' | 'in_progress' | 'completed';

type ProjectWithChapters = Project & {
  chapters: Chapter[];
};
```

### 3.4 제네릭

```typescript
// API 응답 타입
interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}

// 사용 예시
type ProjectResponse = ApiResponse<Project>;
type ChaptersResponse = ApiResponse<Chapter[]>;
```

---

## 4. React 컴포넌트 규칙

### 4.1 컴포넌트 구조

```typescript
// components/project/ProjectCard.tsx
import { FC } from 'react';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  // 1. Hooks
  const [isHovered, setIsHovered] = useState(false);

  // 2. Event Handlers
  const handleEdit = () => {
    onEdit?.(project.id);
  };

  // 3. Render Helpers
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR').format(date);
  };

  // 4. Return JSX
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

// 기본 export는 사용하지 않음 (Named export 선호)
```

### 4.2 Props 정의

```typescript
// ✅ 좋은 예
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// ❌ 나쁜 예
interface ButtonProps {
  variant: string;  // 너무 광범위
  size: any;        // any 금지
  onClick: Function; // Function 타입 금지
}
```

### 4.3 조건부 렌더링

```typescript
// ✅ 좋은 예
{isLoading && <Spinner />}
{error && <ErrorMessage message={error} />}
{projects.length === 0 ? <EmptyState /> : <ProjectList projects={projects} />}

// ❌ 나쁜 예
{isLoading ? <Spinner /> : null}  // 간단한 경우 && 사용
{projects.length && <ProjectList />}  // 0이 렌더링될 수 있음
```

### 4.4 상태 관리

```typescript
// ✅ 좋은 예 - 타입 추론
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// 복잡한 상태는 reducer 사용
interface EditorState {
  content: string;
  wordCount: number;
  isSaving: boolean;
}

type EditorAction =
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'UPDATE_WORD_COUNT'; payload: number };

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'UPDATE_WORD_COUNT':
      return { ...state, wordCount: action.payload };
    default:
      return state;
  }
};
```

---

## 5. Custom Hooks 규칙

### 5.1 Hook 명명

```typescript
// hooks/useAutoSave.ts
import { useEffect, useRef } from 'react';

interface UseAutoSaveOptions {
  delay?: number;
  onSave: (content: string) => Promise<void>;
}

export const useAutoSave = (content: string, options: UseAutoSaveOptions) => {
  const { delay = 5000, onSave } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      onSave(content);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, delay, onSave]);
};
```

### 5.2 Hook 사용 예시

```typescript
// 컴포넌트에서 사용
const EditorComponent = () => {
  const [content, setContent] = useState('');

  useAutoSave(content, {
    delay: 5000,
    onSave: async (content) => {
      await saveChapter(chapterId, content);
    },
  });

  return <Editor value={content} onChange={setContent} />;
};
```

---

## 6. API & 데이터 페칭

### 6.1 API Route 구조

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';

const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  genre: z.string().max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = await db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ data: projects, success: true });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const project = await db.project.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { data: project, success: true },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 6.2 클라이언트 데이터 페칭 (React Query)

```typescript
// hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, CreateProjectInput } from '@/types/project';

export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      return data.data;
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
```

---

## 7. 스타일링 규칙

### 7.1 Tailwind CSS 사용

```typescript
// ✅ 좋은 예
<button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
  Submit
</button>

// ✅ 조건부 클래스
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === 'primary' && "primary-class"
)} />

// ❌ 나쁜 예 - 인라인 스타일
<div style={{ color: 'red', fontSize: '16px' }}>Text</div>
```

### 7.2 클래스 순서

```typescript
// 권장 순서: Layout → Spacing → Typography → Visual → Interaction
<div className="
  flex items-center justify-between
  px-4 py-2 gap-2
  text-base font-medium
  bg-white border rounded-lg
  hover:bg-gray-50 transition-colors
">
  Content
</div>
```

---

## 8. 에러 처리

### 8.1 Try-Catch 블록

```typescript
// ✅ 좋은 예
async function saveChapter(id: string, content: string) {
  try {
    const response = await fetch(`/api/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to save chapter:', error);
    throw error; // 상위로 전파
  }
}

// 컴포넌트에서 사용
const handleSave = async () => {
  try {
    await saveChapter(chapterId, content);
    toast.success('저장되었습니다');
  } catch (error) {
    toast.error('저장에 실패했습니다');
  }
};
```

### 8.2 에러 바운더리

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>오류가 발생했습니다.</div>;
    }

    return this.props.children;
  }
}
```

---

## 9. 성능 최적화

### 9.1 메모이제이션

```typescript
import { memo, useMemo, useCallback } from 'react';

// 컴포넌트 메모이제이션
export const ProjectCard = memo(({ project }: ProjectCardProps) => {
  return <div>{project.title}</div>;
});

// 값 메모이제이션
const sortedProjects = useMemo(() => {
  return projects.sort((a, b) => b.updatedAt - a.updatedAt);
}, [projects]);

// 함수 메모이제이션
const handleClick = useCallback(() => {
  onEdit(project.id);
}, [project.id, onEdit]);
```

### 9.2 동적 임포트

```typescript
// 에디터는 무거우므로 동적 로딩
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/editor/Editor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});
```

---

## 10. 주석 & 문서화

### 10.1 주석 규칙

```typescript
// ✅ 좋은 예 - "왜"를 설명
// 자동 저장은 5초 지연 후 실행됨 (네트워크 부하 감소)
const AUTO_SAVE_DELAY = 5000;

// ✅ 복잡한 로직 설명
/**
 * 챕터 순서를 재정렬합니다.
 * 드래그 앤 드롭 후 order_index를 업데이트합니다.
 *
 * @param chapterId - 이동할 챕터 ID
 * @param newIndex - 새로운 위치
 */
async function reorderChapter(chapterId: string, newIndex: number) {
  // ...
}

// ❌ 나쁜 예 - "무엇"을 반복
// count를 1 증가시킴
setCount(count + 1);
```

### 10.2 JSDoc

```typescript
/**
 * 단어 수를 계산합니다.
 * HTML 태그를 제거한 후 공백 기준으로 분리합니다.
 *
 * @param html - HTML 형식의 문자열
 * @returns 단어 수
 *
 * @example
 * ```ts
 * countWords('<p>Hello world</p>'); // 2
 * ```
 */
export function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  return text.trim().split(/\s+/).filter(Boolean).length;
}
```

---

## 11. 테스트 (Phase 2)

### 11.1 유닛 테스트

```typescript
// lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { countWords } from '../utils';

describe('countWords', () => {
  it('should count words correctly', () => {
    expect(countWords('Hello world')).toBe(2);
  });

  it('should strip HTML tags', () => {
    expect(countWords('<p>Hello <strong>world</strong></p>')).toBe(2);
  });

  it('should handle empty string', () => {
    expect(countWords('')).toBe(0);
  });
});
```

---

## 12. Git Commit 규칙

### 12.1 커밋 메시지 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 12.2 Type 종류

| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새 기능 | `feat(editor): add autosave feature` |
| `fix` | 버그 수정 | `fix(api): handle null user session` |
| `docs` | 문서 수정 | `docs: update README` |
| `style` | 코드 스타일 (포맷팅) | `style: fix linting errors` |
| `refactor` | 리팩토링 | `refactor(hooks): simplify useAutoSave` |
| `test` | 테스트 추가/수정 | `test: add unit tests for utils` |
| `chore` | 빌드/설정 변경 | `chore: update dependencies` |

### 12.3 예시

```bash
# 좋은 예
git commit -m "feat(editor): add word count indicator"
git commit -m "fix(api): prevent duplicate project creation"

# 나쁜 예
git commit -m "update"
git commit -m "fix bug"
git commit -m "asdfasdf"
```

---

## 13. 환경 변수 관리

### 13.1 .env 파일

```bash
# .env.local (로컬 개발)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# .env.production (프로덕션)
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
```

### 13.2 환경 변수 접근

```typescript
// ✅ 좋은 예 - 타입 안전
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

// 또는 zod로 검증
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
});

const env = envSchema.parse(process.env);
```

---

## 14. 보안 규칙

### 14.1 사용자 입력 검증

```typescript
// ✅ 항상 Zod로 검증
import { z } from 'zod';

const chapterSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().max(100000),
});

// API에서 사용
const validatedData = chapterSchema.parse(body);
```

### 14.2 인증 체크

```typescript
// 모든 보호된 API에서 세션 확인
const session = await getServerSession(authOptions);

if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// 리소스 소유권 확인
const project = await db.project.findUnique({
  where: { id: projectId },
});

if (project.userId !== session.user.id) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### 14.3 SQL Injection 방지

```typescript
// ✅ Prisma 사용 (자동 이스케이핑)
await db.project.findMany({
  where: {
    userId: session.user.id,
    title: { contains: searchTerm },
  },
});

// ❌ 절대 금지 - Raw SQL with user input
await db.$executeRaw`SELECT * FROM projects WHERE title = ${userInput}`;
```

---

## 15. 린팅 & 포맷팅

### 15.1 ESLint 설정

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 15.2 Prettier 설정

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

### 15.3 Pre-commit Hook

```json
// package.json
{
  "scripts": {
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## 16. 코드 리뷰 체크리스트

### 16.1 리뷰어 체크리스트

- [ ] 타입 안전성: `any` 사용 여부
- [ ] 에러 처리: try-catch 적절히 사용
- [ ] 성능: 불필요한 리렌더링 방지
- [ ] 보안: 사용자 입력 검증
- [ ] 테스트: 핵심 로직 테스트 작성
- [ ] 접근성: ARIA 속성, 키보드 접근성
- [ ] 네이밍: 의미 있는 변수/함수명
- [ ] 주석: 복잡한 로직 설명

---

## 17. 안티패턴 (피해야 할 것들)

### 17.1 React 안티패턴

```typescript
// ❌ useEffect 의존성 배열 누락
useEffect(() => {
  fetchData(userId);
}, []); // userId 의존성 누락!

// ✅ 올바른 방법
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ❌ 상태 직접 변경
const [items, setItems] = useState([]);
items.push(newItem); // 절대 금지!

// ✅ 올바른 방법
setItems([...items, newItem]);
```

### 17.2 TypeScript 안티패턴

```typescript
// ❌ 타입 단언 남용
const data = response as Project; // 위험!

// ✅ 타입 가드 사용
function isProject(data: unknown): data is Project {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data
  );
}

if (isProject(data)) {
  // data는 Project 타입
}
```

---

## 18. 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

---

## 마무리

> [!IMPORTANT]
> **핵심 원칙 3가지**
>
> 1. ✅ **타입 안전성**: any 금지, strict 모드
> 2. ✅ **일관성**: 같은 패턴 반복 사용
> 3. ✅ **단순성**: 복잡한 로직보다 명확한 로직
>
> 이 컨벤션은 팀의 합의에 따라 업데이트될 수 있습니다.

---

**버전**: 1.0.0
**최종 수정일**: 2026-01-04
