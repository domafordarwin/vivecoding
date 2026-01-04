# Technical Requirements Document (TRD)
## 소설 쓰기 웹 애플리케이션 - MVP

### 1. 시스템 아키텍처

#### 1.1 전체 구조 (MVP 간소화)
```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Next.js 14+ (React 18+)                        │   │
│  │   - App Router                                    │   │
│  │   - Server Components                             │   │
│  │   - Client Components (에디터)                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Next.js API Routes                              │   │
│  │   - RESTful API                                   │   │
│  │   - Authentication Middleware                     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │  S3/Storage  │  │
│  │  (Supabase)  │  │   (Cache)    │  │   (Files)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

### 2. 기술 스택 (MVP)

#### 2.1 Frontend
- **Framework**: Next.js 14+ (App Router)
- **언어**: TypeScript 5+
- **UI 라이브러리**:
  - React 18+
  - Tailwind CSS
  - shadcn/ui (컴포넌트)
- **에디터**:
  - **Tiptap** (추천 - Lexical보다 간단)
- **상태 관리**:
  - Zustand (클라이언트 상태)
  - React Query (서버 상태)
- **폼 관리**: React Hook Form + Zod

#### 2.2 Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **API**: RESTful (tRPC는 Phase 2)
- **인증**: NextAuth.js 또는 Supabase Auth
- **ORM**: Prisma

#### 2.3 Database
- **주 데이터베이스**: PostgreSQL (Supabase)
- **캐시**: Redis (Upstash) - 선택사항
- **검색**: PostgreSQL Full-Text Search (Phase 2)

#### 2.4 Infrastructure
- **호스팅**: Vercel
- **파일 스토리지**: Supabase Storage 또는 AWS S3
- **CDN**: Vercel Edge Network
- **모니터링**: Sentry (선택), Vercel Analytics

#### 2.5 개발 도구
- **버전 관리**: Git + GitHub
- **CI/CD**: GitHub Actions
- **테스팅**: Vitest (유닛 테스트) - Phase 2
- **린팅**: ESLint + Prettier
- **타입 체킹**: TypeScript strict mode

---

### 3. 데이터베이스 스키마 (MVP)

```sql
-- Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(50), -- 'email', 'google', 'kakao'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects 테이블
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  word_count INT DEFAULT 0,
  target_word_count INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chapters 테이블
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  word_count INT DEFAULT 0,
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_chapters_project_id ON chapters(project_id);
CREATE INDEX idx_chapters_order ON chapters(project_id, order_index);
```

**Phase 2로 연기된 테이블**:
- `characters` (캐릭터)
- `world_building` (세계관)
- `chapter_versions` (버전 히스토리)
- `comments` (피드백)
- `writing_sessions` (통계)

---

### 4. API 설계 (MVP)

#### 4.1 인증 API

```typescript
POST /api/auth/register
Body: { email, username, password }
Response: { user, token }

POST /api/auth/login
Body: { email, password }
Response: { user, token }

POST /api/auth/logout
Response: { success: true }

GET /api/auth/me
Response: { user }
```

#### 4.2 프로젝트 API

```typescript
GET /api/projects
Response: { projects: Project[] }

POST /api/projects
Body: { title, description, genre, targetWordCount }
Response: { project: Project }

GET /api/projects/:id
Response: { project: Project }

PUT /api/projects/:id
Body: { title?, description?, genre?, status? }
Response: { project: Project }

DELETE /api/projects/:id
Response: { success: true }
```

#### 4.3 챕터 API

```typescript
GET /api/projects/:projectId/chapters
Response: { chapters: Chapter[] }

POST /api/projects/:projectId/chapters
Body: { title, content, orderIndex }
Response: { chapter: Chapter }

GET /api/chapters/:id
Response: { chapter: Chapter }

PUT /api/chapters/:id
Body: { title?, content?, orderIndex? }
Response: { chapter: Chapter }

DELETE /api/chapters/:id
Response: { success: true }
```

#### 4.4 자동 저장 API

```typescript
POST /api/chapters/:id/autosave
Body: { content, wordCount }
Response: { success: true, savedAt: timestamp }
```

#### 4.5 내보내기 API (간소화)

```typescript
POST /api/projects/:id/export
Body: { format: 'txt' | 'docx' }
Response: { downloadUrl: string }
```

**Phase 2/3로 연기**:
- PDF export
- ePub export

---

### 5. 핵심 기능 구현 상세 (MVP)

#### 5.1 에디터 구현 (Tiptap)

```typescript
// Tiptap 에디터 설정
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

function Editor({ chapterId, initialContent }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '이야기를 시작하세요...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // 디바운스된 자동 저장
      debouncedSave(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
}

// 자동 저장 (5초 디바운스)
const debouncedSave = useDebouncedCallback(
  async (content: string) => {
    await fetch(`/api/chapters/${chapterId}/autosave`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  5000
);
```

#### 5.2 단어 수 카운팅

```typescript
function countWords(html: string): number {
  // HTML 태그 제거
  const text = html.replace(/<[^>]*>/g, '');
  // 공백으로 분리하여 단어 수 계산
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// 실시간 업데이트
useEffect(() => {
  if (editor) {
    const wordCount = countWords(editor.getHTML());
    setWordCount(wordCount);
  }
}, [editor?.state.doc]);
```

#### 5.3 파일 내보내기 (간소화)

```typescript
// TXT 내보내기
async function exportToTXT(projectId: string) {
  const project = await getProjectWithChapters(projectId);
  
  const text = project.chapters
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(chapter => `# ${chapter.title}\n\n${chapter.content}`)
    .join('\n\n---\n\n');

  return text;
}

// DOCX 내보내기 (docx 라이브러리)
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';

async function exportToDOCX(projectId: string) {
  const project = await getProjectWithChapters(projectId);

  const doc = new Document({
    sections: [{
      children: project.chapters
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .flatMap(chapter => [
          new Paragraph({
            text: chapter.title,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: stripHtml(chapter.content),
          }),
        ]),
    }],
  });

  return await Packer.toBuffer(doc);
}
```

---

### 6. 성능 최적화 (MVP)

#### 6.1 프론트엔드
- **코드 스플리팅**: 에디터 dynamic import
- **이미지 최적화**: Next.js Image
- **폰트 최적화**: next/font

```typescript
// 에디터 동적 로딩
const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});
```

#### 6.2 백엔드
- **데이터베이스 인덱싱**: 주요 쿼리 인덱스
- **간단한 캐싱**: React Query의 staleTime 활용

#### 6.3 에디터 성능
```typescript
// 디바운싱으로 불필요한 저장 방지
const debouncedSave = useDebouncedCallback(save, 5000);

// 대용량 텍스트 처리 (Phase 2)
// - 가상 스크롤 (react-window)
```

---

### 7. 보안 요구사항

#### 7.1 인증 및 인가
- JWT 토큰 (httpOnly 쿠키)
- NextAuth.js 사용

#### 7.2 데이터 보호
- 비밀번호 bcrypt 해싱
- HTTPS 강제 (Vercel 자동)
- CORS 설정
- Rate Limiting (선택 - Phase 2)

#### 7.3 입력 검증
```typescript
// Zod 스키마
const createChapterSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().max(100000),
  orderIndex: z.number().int().min(0),
});
```

---

### 8. 배포 전략

#### 8.1 CI/CD (간소화)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        run: vercel --prod
```

#### 8.2 환경
- **Development**: 로컬
- **Production**: Vercel

---

### 9. MVP에서 제외된 복잡한 구현

다음 기능들은 구현 난이도가 높아 **제외**합니다:

#### 9.1 실시간 협업
- ❌ WebSocket (Socket.io)
- ❌ Operational Transformation
- ❌ CRDT 알고리즘
- ❌ 멀티 커서

**이유**: 2-3개월 단독 소요, 매우 복잡

#### 9.2 오프라인 지원
- ❌ Service Worker
- ❌ IndexedDB
- ❌ 동기화 로직

#### 9.3 고급 파일 변환
- ❌ PDF 생성 (Puppeteer)
- ❌ ePub 생성

---

### 10. 기술 부채 관리

- 코드 리뷰 (선택)
- 주석 및 문서화
- TypeScript strict mode 유지

---

## MVP 핵심 원칙

> [!IMPORTANT]
> **"완벽보다 완성"**
> 
> MVP는 다음 4가지 핵심 가치만 제공합니다:
> 1. ✅ 글쓰기 (에디터 + 자동 저장)
> 2. ✅ 관리 (프로젝트 + 챕터)
> 3. ✅ 내보내기 (TXT + DOCX)
> 4. ✅ 통계 (단어 수)
> 
> 이 4가지만 잘 작동하면 **사용 가능한 제품**입니다!
