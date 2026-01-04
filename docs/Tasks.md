# Development Tasks for AI
## Novel Writer Web App - MVP Implementation

이 문서는 AI가 단계별로 구현할 수 있는 개별 태스크들을 자연어로 정의합니다.
각 태스크는 관련 문서와 디자인 레퍼런스를 포함합니다.

---

## 📋 Task Index

- [Phase 0: 프로젝트 초기 설정](#phase-0-프로젝트-초기-설정)
- [Phase 1: 인증 시스템](#phase-1-인증-시스템)
- [Phase 2: 프로젝트 관리](#phase-2-프로젝트-관리)
- [Phase 3: 챕터 관리](#phase-3-챕터-관리)
- [Phase 4: 에디터 구현](#phase-4-에디터-구현)
- [Phase 5: 내보내기 기능](#phase-5-내보내기-기능)

---

## Phase 0: 프로젝트 초기 설정

### Task 0.1: Next.js 프로젝트 초기화

**목표**: TypeScript와 Tailwind CSS가 설정된 Next.js 14 프로젝트를 생성합니다.

**참고 문서**:
- `docs/TRD_Novel_Writing_App.md` - 섹션 2.1 (Frontend 기술 스택)
- `docs/coding-convention.md` - 섹션 2.1 (폴더 구조)

**구현 내용**:
1. Next.js 14 프로젝트를 App Router 모드로 생성하세요
2. TypeScript를 strict 모드로 설정하세요
3. Tailwind CSS를 설치하고 기본 설정을 완료하세요
4. 프로젝트 폴더 구조를 다음과 같이 생성하세요:
   - `app/` (Next.js App Router)
   - `components/` (React 컴포넌트)
   - `lib/` (유틸리티 함수)
   - `hooks/` (Custom React Hooks)
   - `types/` (TypeScript 타입 정의)
   - `styles/` (글로벌 스타일)

**완료 기준**:
- `npm run dev` 실행 시 개발 서버가 정상 작동
- TypeScript 컴파일 에러 없음
- Tailwind CSS가 정상적으로 적용됨

---

### Task 0.2: Tailwind 테마 설정

**목표**: 디자인 시스템에 맞는 Tailwind 커스텀 테마를 설정합니다.

**참고 문서**:
- `docs/DESIGN_GUIDE_Novel_Writing_App.md` - 섹션 2 (컬러 시스템)
- `Design/stitch_welcome_onboarding/login_screen/code.html` (Tailwind 설정 예시)

**디자인 레퍼런스**:
```
Primary Color: #3c83f6
Background Light: #f5f7f8
Background Dark: #101722
Font Display: "Noto Serif", serif
Font Sans: "Noto Sans", sans-serif
```

**구현 내용**:
1. `tailwind.config.js` 파일을 수정하여 커스텀 컬러를 추가하세요:
   - `primary`: #3c83f6
   - `background-light`: #f5f7f8
   - `background-dark`: #101722
   - `surface-dark`: #1c2430

2. 폰트 패밀리를 설정하세요:
   - `display`: Noto Serif (제목용)
   - `sans`: Noto Sans (본문용)

3. 다크 모드를 `class` 전략으로 설정하세요

4. 커스텀 borderRadius를 추가하세요 (lg: 0.5rem, xl: 0.75rem, 2xl: 1rem)

**완료 기준**:
- Tailwind 설정 파일이 정상적으로 작동
- 커스텀 컬러와 폰트가 사용 가능
- 다크 모드 클래스 전략 적용 완료

---

### Task 0.3: Prisma 설정 및 데이터베이스 연결

**목표**: Prisma ORM을 설정하고 Supabase PostgreSQL에 연결합니다.

**참고 문서**:
- `docs/database-design.md` - 섹션 3.1 (Prisma Schema)
- `docs/TRD_Novel_Writing_App.md` - 섹션 2.2 (Backend)

**구현 내용**:
1. Prisma를 설치하고 초기화하세요
2. `.env.local` 파일을 생성하고 `DATABASE_URL` 환경 변수를 설정하세요 (실제 값은 placeholder)
3. `prisma/schema.prisma` 파일에 기본 설정을 작성하세요:
   - provider를 "postgresql"로 설정
   - generator client를 "prisma-client-js"로 설정

4. MVP에 필요한 3개의 모델을 정의하세요:
   - `User` (id, email, username, passwordHash, avatarUrl, provider, createdAt, updatedAt)
   - `Project` (id, userId, title, description, genre, status, wordCount, targetWordCount, createdAt, updatedAt)
   - `Chapter` (id, projectId, title, content, wordCount, orderIndex, createdAt, updatedAt)

5. 적절한 관계와 인덱스를 설정하세요

**완료 기준**:
- Prisma schema가 올바르게 정의됨
- `npx prisma generate` 실행 성공
- `lib/db.ts`에 Prisma Client 인스턴스 생성 완료

---

### Task 0.4: shadcn/ui 설치 및 기본 컴포넌트 추가

**목표**: shadcn/ui를 설치하고 기본 UI 컴포넌트들을 추가합니다.

**참고 문서**:
- `docs/TRD_Novel_Writing_App.md` - 섹션 2.1 (Frontend)
- `docs/coding-convention.md` - 섹션 2.1 (프로젝트 구조)

**구현 내용**:
1. shadcn/ui를 초기화하세요
2. 다음 컴포넌트들을 설치하세요:
   - `button`
   - `input`
   - `dialog`
   - `label`
   - `select`
   - `textarea`

3. `components/ui/` 폴더에 컴포넌트들이 생성되었는지 확인하세요

4. `lib/utils.ts`에 `cn()` 유틸리티 함수가 생성되었는지 확인하세요

**완료 기준**:
- shadcn/ui 컴포넌트가 정상적으로 설치됨
- Tailwind와 통합되어 스타일링이 적용됨
- TypeScript 타입 에러 없음

---

## Phase 1: 인증 시스템

### Task 1.1: NextAuth.js 설정

**목표**: NextAuth.js를 설정하고 기본 인증 구조를 만듭니다.

**참고 문서**:
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.3 (사용자 계정 및 인증)
- `docs/TRD_Novel_Writing_App.md` - 섹션 2.2 (Backend - 인증)
- `docs/database-design.md` - 섹션 4.1 (users 테이블)

**구현 내용**:
1. NextAuth.js와 필요한 어댑터를 설치하세요
2. `app/api/auth/[...nextauth]/route.ts` 파일을 생성하세요
3. `lib/auth.ts`에 NextAuth 설정을 작성하세요:
   - Credentials Provider (이메일/비밀번호) 설정
   - Google Provider 설정 (CLIENT_ID, CLIENT_SECRET 환경 변수)
   - Kakao Provider 설정
   - Prisma Adapter 연결

4. JWT 전략을 사용하도록 설정하세요
5. 세션 콜백을 설정하여 user.id를 세션에 포함시키세요

**완료 기준**:
- NextAuth.js가 정상적으로 설정됨
- `/api/auth/signin` 엔드포인트 접근 가능
- 환경 변수가 올바르게 설정됨 (NEXTAUTH_SECRET, NEXTAUTH_URL)

---

### Task 1.2: 회원가입 페이지 구현

**목표**: 이메일/비밀번호 회원가입 페이지를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 1 (신규 사용자 온보딩 플로우)
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.3 (사용자 계정 및 인증)

**디자인 레퍼런스**:
- 회원가입 페이지는 로그인 페이지와 유사한 디자인을 사용
- `Design/stitch_welcome_onboarding/login_screen/code.html` 참고

**구현 내용**:
1. `app/(auth)/register/page.tsx` 파일을 생성하세요
2. React Hook Form과 Zod를 사용하여 폼을 구현하세요
3. 다음 필드를 포함하세요:
   - Email (이메일 형식 검증)
   - Username (3-50자, 필수)
   - Password (8자 이상, 필수)
   - Password Confirm (비밀번호 일치 검증)

4. 폼 제출 시:
   - 비밀번호를 bcryptjs로 해싱하세요
   - `/api/auth/register` API를 호출하세요
   - 성공 시 로그인 페이지로 리다이렉트하세요
   - 실패 시 에러 메시지를 표시하세요

5. 소셜 로그인 버튼도 포함하세요 (Google, Kakao)

**완료 기준**:
- 회원가입 폼이 정상적으로 작동
- 입력 검증이 올바르게 동작
- 회원가입 성공 시 데이터베이스에 사용자 생성됨
- 에러 처리가 적절히 구현됨

---

### Task 1.3: 회원가입 API 구현

**목표**: 회원가입을 처리하는 API Route를 구현합니다.

**참고 문서**:
- `docs/coding-convention.md` - 섹션 6.1 (API Route 구조)
- `docs/database-design.md` - 섹션 4.1 (users 테이블)

**구현 내용**:
1. `app/api/auth/register/route.ts` 파일을 생성하세요
2. POST 메서드를 구현하세요:
   - 요청 body를 Zod로 검증하세요 (email, username, password)
   - 이메일 중복을 확인하세요
   - 사용자명 중복을 확인하세요
   - 비밀번호를 bcryptjs로 해싱하세요 (salt rounds: 12)
   - Prisma를 사용하여 새 사용자를 생성하세요
   - 성공 시 201 상태 코드와 사용자 정보 반환 (비밀번호 제외)
   - 실패 시 적절한 에러 코드 반환 (400, 409, 500)

3. 에러 처리:
   - 이메일 중복: 409 Conflict
   - 검증 실패: 400 Bad Request
   - 서버 에러: 500 Internal Server Error

**완료 기준**:
- POST `/api/auth/register` 엔드포인트가 정상 작동
- 중복 체크가 올바르게 동작
- 비밀번호가 해싱되어 저장됨
- 에러 응답이 적절히 반환됨

---

### Task 1.4: 로그인 페이지 구현

**목표**: 이메일/비밀번호 및 소셜 로그인 페이지를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 1 (신규 사용자 온보딩 플로우)
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.3 (사용자 계정 및 인증)

**디자인 레퍼런스**:
- `Design/stitch_welcome_onboarding/login_screen/code.html` (로그인 화면 디자인)

**구현 내용**:
1. `app/(auth)/login/page.tsx` 파일을 생성하세요
2. 디자인 레퍼런스를 참고하여 다음 요소들을 구현하세요:
   - Novel Writer 로고와 헤더
   - 이메일 입력 필드 (메일 아이콘 포함)
   - 비밀번호 입력 필드 (visibility 토글 버튼 포함)
   - "Forgot Password?" 링크
   - "Log In" Primary 버튼
   - "Or continue with" 구분선
   - Google 로그인 버튼 (SVG 아이콘 포함)
   - Kakao 로그인 버튼 (노란색 배경)
   - "Create an Account" 링크

3. NextAuth의 `signIn()` 함수를 사용하여 로그인을 구현하세요:
   - 이메일/비밀번호 로그인: `signIn('credentials', {...})`
   - Google 로그인: `signIn('google')`
   - Kakao 로그인: `signIn('kakao')`

4. 로그인 성공 시 `/projects` 페이지로 리다이렉트하세요
5. 실패 시 에러 메시지를 표시하세요

6. 다크 모드를 지원하세요:
   - 배경색: light mode `#f5f7f8`, dark mode `#101722`
   - 입력 필드: dark mode에서 `#1c2533` 배경

**완료 기준**:
- 로그인 페이지가 디자인 레퍼런스와 일치
- 이메일/비밀번호 로그인이 정상 작동
- 소셜 로그인 버튼이 작동 (실제 OAuth 연결은 환경 변수 필요)
- 다크 모드가 정상적으로 적용됨
- 에러 처리가 구현됨

---

### Task 1.5: 웰컴 온보딩 페이지 구현

**목표**: 신규 사용자를 위한 온보딩 슬라이더 페이지를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 1.1 (단계별 상세 - 랜딩 페이지)

**디자인 레퍼런스**:
- `Design/stitch_welcome_onboarding/welcome_\_onboarding/code.html` (온보딩 화면)

**구현 내용**:
1. `app/welcome/page.tsx` 파일을 생성하세요
2. 디자인 레퍼런스를 참고하여 다음 요소들을 구현하세요:
   - 상단 헤더: "Novel Writer" 타이틀과 "Skip" 버튼
   - 3개의 온보딩 슬라이드 (수평 스크롤):
     - Slide 1: "Distraction-Free Writing" - 타자기 이미지
     - Slide 2: "Master Your Plot" - 플롯 다이어그램 이미지
     - Slide 3: "Creativity Everywhere" - 멀티 디바이스 싱크 이미지
   - 페이지 인디케이터 (하단, 현재 슬라이드 표시)
   - "Create Account" Primary 버튼
   - "I already have an account" Secondary 버튼

3. 슬라이드 기능을 구현하세요:
   - CSS `snap-x snap-mandatory`를 사용한 수평 스크롤
   - 현재 슬라이드에 맞춰 페이지 인디케이터 업데이트
   - 좌우 스와이프 제스처 지원

4. 버튼 동작:
   - "Skip" 버튼: `/login`으로 이동
   - "Create Account" 버튼: `/register`로 이동
   - "I already have an account" 버튼: `/login`으로 이동

**완료 기준**:
- 온보딩 페이지가 디자인 레퍼런스와 일치
- 슬라이드 스크롤이 부드럽게 작동
- 페이지 인디케이터가 정확히 표시됨
- 모든 버튼이 올바른 페이지로 이동
- 모바일과 데스크톱 모두에서 반응형 작동

---

### Task 1.6: 세션 미들웨어 구현

**목표**: 인증이 필요한 페이지를 보호하는 미들웨어를 구현합니다.

**참고 문서**:
- `docs/coding-convention.md` - 섹션 14.2 (인증 체크)
- `docs/development-tasks.md` - Phase 1, 섹션 3.2 (인증 기능 구현)

**구현 내용**:
1. `middleware.ts` 파일을 프로젝트 루트에 생성하세요
2. NextAuth의 `withAuth` 미들웨어를 사용하여 인증 체크를 구현하세요
3. 보호할 경로를 정의하세요:
   - `/projects/*` (프로젝트 관련 모든 페이지)
   - `/api/projects/*` (프로젝트 API)
   - `/api/chapters/*` (챕터 API)

4. 인증되지 않은 사용자는 `/login`으로 리다이렉트하세요
5. 로그인/회원가입 페이지는 인증된 사용자가 접근 시 `/projects`로 리다이렉트하세요

6. matcher 설정:
   ```typescript
   export const config = {
     matcher: ['/projects/:path*', '/api/projects/:path*', '/api/chapters/:path*']
   }
   ```

**완료 기준**:
- 미들웨어가 정상적으로 작동
- 비인증 사용자가 보호된 페이지 접근 시 로그인 페이지로 리다이렉트
- 인증된 사용자는 정상적으로 보호된 페이지 접근 가능
- API 라우트도 동일하게 보호됨

---

## Phase 2: 프로젝트 관리

### Task 2.1: 프로젝트 목록 페이지 구현 (대시보드)

**목표**: 사용자의 프로젝트 목록을 표시하는 대시보드 페이지를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 2 (새 소설 프로젝트 생성 플로우)
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.2 (프로젝트 관리)

**디자인 레퍼런스**:
- `Design/stitch_welcome_onboarding/project_list_(dashboard)/code.html` (프로젝트 목록 화면)

**구현 내용**:
1. `app/(dashboard)/projects/page.tsx` 파일을 생성하세요
2. 디자인 레퍼런스를 참고하여 다음 요소들을 구현하세요:
   - **헤더**:
     - 좌측: 햄버거 메뉴 아이콘 (모바일용)
     - 중앙: "My Bookshelf" 타이틀
     - 우측: 사용자 프로필 이미지

   - **검색 바**:
     - 검색 아이콘과 "Search titles or genres" placeholder

   - **필터 칩**:
     - "All Projects" (활성화 - Primary 색상)
     - "Sci-Fi", "Fantasy", "Mystery", "Romance" (비활성화)
     - 수평 스크롤 가능

   - **프로젝트 카드 목록**:
     - 각 카드는 좌측에 책 표지 썸네일 (96px width, 2:3 aspect ratio)
     - 장르 배지 (색상 구분: Sci-Fi=파랑, Fantasy=황금, Mystery=보라, Romance=분홍)
     - 프로젝트 제목 (굵게, 큰 폰트)
     - 시놉시스 (2줄 말줄임)
     - 하단 메타데이터:
       - 단어 수 (아이콘 포함)
       - 최종 수정 시간
     - 우측 상단: 더보기 메뉴 (⋮)

   - **Floating Action Button** (우측 하단):
     - "+ New Project" 버튼 (Primary 색상, 그림자 효과)

3. 데이터 페칭:
   - React Query (`@tanstack/react-query`)를 사용하세요
   - `/api/projects` GET 엔드포인트에서 프로젝트 목록을 가져오세요
   - 로딩 상태: Skeleton UI 표시
   - 에러 상태: 에러 메시지 표시
   - 빈 상태: "아직 프로젝트가 없습니다" 메시지와 "새 프로젝트" 버튼

4. 프로젝트 카드 클릭 시 `/projects/[id]` 페이지로 이동하세요

**완료 기준**:
- 대시보드가 디자인 레퍼런스와 일치
- 프로젝트 목록이 정상적으로 로딩됨
- 로딩/에러/빈 상태가 적절히 처리됨
- 카드 호버 효과가 작동 (그림자, scale 변환)
- Floating Action Button이 고정 위치에 표시됨
- 다크 모드가 정상적으로 적용됨

---

### Task 2.2: 프로젝트 목록 조회 API 구현

**목표**: 사용자의 프로젝트 목록을 반환하는 API를 구현합니다.

**참고 문서**:
- `docs/database-design.md` - 섹션 5.1 (프로젝트 목록 조회)
- `docs/coding-convention.md` - 섹션 6.1 (API Route 구조)

**구현 내용**:
1. `app/api/projects/route.ts` 파일을 생성하세요
2. GET 메서드를 구현하세요:
   - `getServerSession()`으로 현재 로그인한 사용자 확인
   - 세션이 없으면 401 Unauthorized 반환
   - Prisma를 사용하여 해당 사용자의 프로젝트 목록 조회:
     ```typescript
     const projects = await prisma.project.findMany({
       where: { userId: session.user.id },
       orderBy: { updatedAt: 'desc' },
       include: {
         _count: {
           select: { chapters: true }
         }
       }
     });
     ```
   - 200 상태 코드와 함께 프로젝트 배열 반환
   - 에러 발생 시 500 상태 코드 반환

3. 응답 형식:
   ```json
   {
     "data": [
       {
         "id": "uuid",
         "title": "프로젝트 제목",
         "description": "시놉시스",
         "genre": "Fantasy",
         "wordCount": 12500,
         "updatedAt": "2026-01-04T...",
         "_count": { "chapters": 5 }
       }
     ],
     "success": true
   }
   ```

**완료 기준**:
- GET `/api/projects` 엔드포인트가 정상 작동
- 인증된 사용자의 프로젝트만 반환됨
- 최신 수정 순으로 정렬됨
- 챕터 개수가 포함됨
- 에러 처리가 적절히 구현됨

---

### Task 2.3: 새 프로젝트 생성 모달 구현

**목표**: 새 프로젝트를 생성하는 모달 컴포넌트를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 2.1 (프로젝트 생성 폼)
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.2 (프로젝트 관리)

**디자인 레퍼런스**:
- `Design/stitch_welcome_onboarding/new_project_modal/code.html` (프로젝트 생성 모달)

**구현 내용**:
1. `components/project/CreateProjectModal.tsx` 파일을 생성하세요
2. shadcn/ui의 Dialog 컴포넌트를 사용하여 모달을 구현하세요
3. 디자인 레퍼런스를 참고하여 다음 요소들을 구현하세요:
   - **모달 헤더**:
     - 상단 드래그 핸들 (시각적 요소)
     - "New Novel" 제목
     - "Start your next masterpiece" 부제

   - **폼 필드**:
     - Project Title (필수):
       - 입력 필드 우측에 edit 아이콘
       - Placeholder: "Enter novel title..."
       - autofocus 속성

     - Genre (선택):
       - Select 드롭다운
       - 옵션: Fantasy, Science Fiction, Romance, Thriller, Mystery, Horror, Literary Fiction, Non-Fiction
       - Placeholder: "Select a genre"
       - 우측에 arrow_drop_down 아이콘

     - Synopsis (선택):
       - Textarea (140px 높이)
       - "(Optional)" 라벨
       - Placeholder: "What is your story about? Briefly describe the plot, main characters, or theme."

   - **푸터 액션**:
     - "Cancel" 버튼 (Secondary - 투명 배경, border)
     - "Create" 버튼 (Primary - + 아이콘 포함)

4. React Hook Form + Zod를 사용하여 폼 검증을 구현하세요:
   ```typescript
   const schema = z.object({
     title: z.string().min(1, '제목은 필수입니다').max(255),
     genre: z.string().optional(),
     description: z.string().max(1000).optional(),
   });
   ```

5. "Create" 버튼 클릭 시:
   - `useCreateProject` mutation을 호출하세요
   - 성공 시: 모달 닫기, 토스트 알림 표시, 프로젝트 목록 새로고침
   - 실패 시: 에러 메시지 표시

6. 다크 모드 스타일:
   - 모달 배경: `#111418`
   - 입력 필드 배경: `#1b2027`
   - 테두리: `#3b4454`

**완료 기준**:
- 모달이 디자인 레퍼런스와 일치
- 폼 검증이 정상 작동
- 프로젝트 생성이 성공적으로 처리됨
- 에러 처리가 적절히 구현됨
- 다크 모드가 정상적으로 적용됨
- 모달 닫기/열기 애니메이션이 부드러움

---

### Task 2.4: 프로젝트 생성 API 구현

**목표**: 새 프로젝트를 생성하는 API를 구현합니다.

**참고 문서**:
- `docs/database-design.md` - 섹션 4.2 (projects 테이블)
- `docs/coding-convention.md` - 섹션 6.1 (API Route 구조)

**구현 내용**:
1. `app/api/projects/route.ts` 파일에 POST 메서드를 추가하세요
2. POST 메서드를 구현하세요:
   - `getServerSession()`으로 인증 확인 (없으면 401 반환)
   - 요청 body를 Zod로 검증:
     ```typescript
     const createProjectSchema = z.object({
       title: z.string().min(1).max(255),
       description: z.string().max(1000).optional(),
       genre: z.string().max(100).optional(),
     });
     ```
   - Prisma를 사용하여 새 프로젝트 생성:
     ```typescript
     const project = await prisma.project.create({
       data: {
         ...validatedData,
         userId: session.user.id,
         status: 'draft',
         wordCount: 0,
       }
     });
     ```
   - 첫 번째 챕터를 자동으로 생성:
     ```typescript
     await prisma.chapter.create({
       data: {
         projectId: project.id,
         title: 'Chapter 1',
         content: '',
         wordCount: 0,
         orderIndex: 0,
       }
     });
     ```
   - 201 상태 코드와 함께 생성된 프로젝트 반환

3. 에러 처리:
   - 검증 실패: 400 Bad Request (Zod 에러 상세 포함)
   - 서버 에러: 500 Internal Server Error

**완료 기준**:
- POST `/api/projects` 엔드포인트가 정상 작동
- 프로젝트와 첫 챕터가 동시에 생성됨
- 입력 검증이 올바르게 동작
- 에러 응답이 적절히 반환됨

---

### Task 2.5: React Query 설정 및 훅 구현

**목표**: React Query를 설정하고 프로젝트 관련 커스텀 훅을 구현합니다.

**참고 문서**:
- `docs/coding-convention.md` - 섹션 6.2 (클라이언트 데이터 페칭)
- `docs/TRD_Novel_Writing_App.md` - 섹션 2.1 (상태 관리)

**구현 내용**:
1. `@tanstack/react-query`를 설치하세요
2. `app/providers.tsx` 파일을 생성하여 QueryClientProvider를 설정하세요:
   ```typescript
   'use client';

   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { useState } from 'react';

   export function Providers({ children }: { children: React.ReactNode }) {
     const [queryClient] = useState(() => new QueryClient({
       defaultOptions: {
         queries: {
           staleTime: 60 * 1000, // 1분
         },
       },
     }));

     return (
       <QueryClientProvider client={queryClient}>
         {children}
       </QueryClientProvider>
     );
   }
   ```

3. `app/layout.tsx`에서 Providers로 감싸세요

4. `hooks/useProjects.ts` 파일을 생성하여 프로젝트 관련 훅들을 구현하세요:
   - `useProjects()`: 프로젝트 목록 조회
   - `useProject(id)`: 단일 프로젝트 조회
   - `useCreateProject()`: 프로젝트 생성
   - `useUpdateProject()`: 프로젝트 수정
   - `useDeleteProject()`: 프로젝트 삭제

5. 각 mutation 성공 시 캐시를 invalidate하여 목록을 자동 새로고침하세요

**완료 기준**:
- React Query가 정상적으로 설정됨
- 모든 훅이 타입 안전하게 구현됨
- 캐시 invalidation이 정상 작동
- optimistic updates가 적용됨 (선택사항)

---

### Task 2.6: 프로젝트 수정 기능 구현

**목표**: 기존 프로젝트의 정보를 수정하는 기능을 구현합니다.

**참고 문서**:
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.2 (프로젝트 관리 - 수정)
- `docs/development-tasks.md` - Phase 2, 섹션 4.2 (API 구현)

**구현 내용**:
1. `app/api/projects/[id]/route.ts` 파일을 생성하세요
2. PUT 메서드를 구현하세요:
   - 세션 확인 (비인증 시 401)
   - URL에서 프로젝트 ID 추출
   - 프로젝트 존재 여부 확인
   - 프로젝트 소유권 확인 (userId 일치 확인, 불일치 시 403 Forbidden)
   - 요청 body를 Zod로 검증 (title, description, genre, status)
   - Prisma로 프로젝트 업데이트
   - 200 상태 코드와 함께 업데이트된 프로젝트 반환

3. `components/project/EditProjectModal.tsx` 컴포넌트를 생성하세요:
   - CreateProjectModal과 유사한 UI
   - 기존 프로젝트 데이터로 폼 초기화
   - "Update" 버튼으로 변경
   - `useUpdateProject` 훅 사용

4. 프로젝트 카드의 더보기 메뉴에 "Edit" 옵션 추가:
   - 클릭 시 EditProjectModal 열기
   - 모달에 선택된 프로젝트 데이터 전달

**완료 기준**:
- PUT `/api/projects/[id]` 엔드포인트가 정상 작동
- 소유권 검증이 올바르게 동작
- 프로젝트 수정이 성공적으로 처리됨
- UI가 즉시 업데이트됨 (React Query 캐시 invalidation)

---

### Task 2.7: 프로젝트 삭제 기능 구현

**목표**: 프로젝트를 삭제하는 기능을 구현합니다.

**참고 문서**:
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.2 (프로젝트 관리 - 삭제)
- `docs/database-design.md` - 섹션 4.2 (ON DELETE CASCADE)

**구현 내용**:
1. `app/api/projects/[id]/route.ts` 파일에 DELETE 메서드를 추가하세요:
   - 세션 확인
   - 프로젝트 소유권 확인
   - Prisma로 프로젝트 삭제 (CASCADE로 챕터도 자동 삭제됨)
   - 200 상태 코드와 성공 메시지 반환

2. `components/project/DeleteConfirmDialog.tsx` 컴포넌트를 생성하세요:
   - shadcn/ui의 AlertDialog 컴포넌트 사용
   - "정말 삭제하시겠습니까?" 메시지
   - 프로젝트 제목 표시
   - "모든 챕터가 함께 삭제됩니다" 경고 문구
   - "Cancel" 및 "Delete" 버튼 (Delete는 빨간색)

3. 프로젝트 카드의 더보기 메뉴에 "Delete" 옵션 추가:
   - 클릭 시 DeleteConfirmDialog 열기
   - 확인 시 `useDeleteProject` mutation 실행
   - 성공 시 토스트 알림 표시

**완료 기준**:
- DELETE `/api/projects/[id]` 엔드포인트가 정상 작동
- 확인 다이얼로그가 표시됨
- 삭제 시 챕터도 함께 삭제됨 (CASCADE)
- UI에서 프로젝트가 즉시 제거됨
- 에러 처리가 적절히 구현됨

---

## Phase 3: 챕터 관리

### Task 3.1: 챕터 목록 사이드바 구현

**목표**: 프로젝트의 챕터 목록을 표시하는 사이드바를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 3.1 (에디터 화면 MVP)
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.2 (챕터 관리)

**디자인 레퍼런스**:
- `Design/stitch_welcome_onboarding/editor_(chapter_view)/code.html` (에디터 화면)

**구현 내용**:
1. `components/chapter/ChapterSidebar.tsx` 파일을 생성하세요
2. 다음 요소들을 구현하세요:
   - **사이드바 헤더**:
     - "Chapters" 타이틀
     - 챕터 개수 표시 (예: "12 chapters")

   - **챕터 리스트**:
     - 각 챕터 아이템은 다음 포함:
       - 📄 문서 아이콘
       - 챕터 제목 (예: "Chapter 1: The Beginning")
       - 단어 수 (작은 텍스트)
     - 현재 선택된 챕터는 Primary 색상 배경 (`#3c83f6` 10% opacity)
     - 호버 시 배경색 변경
     - 클릭 시 해당 챕터 로드

   - **새 챕터 버튼**:
     - 하단에 "+ 새 챕터" 버튼
     - 클릭 시 새 챕터 생성

3. 챕터 목록은 `orderIndex` 순으로 정렬하세요

4. 모바일에서는 사이드바를 숨기고 햄버거 메뉴로 토글하세요:
   - 768px 이하: 사이드바 숨김, 드로어로 표시
   - 768px 이상: 280px 고정 폭 사이드바

**완료 기준**:
- 사이드바가 정상적으로 렌더링됨
- 챕터 목록이 순서대로 표시됨
- 현재 챕터가 하이라이트됨
- 새 챕터 버튼이 작동
- 반응형 동작이 정상적으로 작동

---

### Task 3.2: 챕터 목록 조회 API 구현

**목표**: 특정 프로젝트의 챕터 목록을 반환하는 API를 구현합니다.

**참고 문서**:
- `docs/database-design.md` - 섹션 5.2 (챕터 목록 조회)
- `docs/coding-convention.md` - 섹션 6.1 (API Route 구조)

**구현 내용**:
1. `app/api/projects/[id]/chapters/route.ts` 파일을 생성하세요
2. GET 메서드를 구현하세요:
   - 세션 확인
   - 프로젝트 ID로 프로젝트 존재 확인
   - 프로젝트 소유권 확인
   - Prisma로 챕터 목록 조회:
     ```typescript
     const chapters = await prisma.chapter.findMany({
       where: { projectId },
       orderBy: { orderIndex: 'asc' },
       select: {
         id: true,
         title: true,
         wordCount: true,
         orderIndex: true,
         updatedAt: true,
       }
     });
     ```
   - 200 상태 코드와 함께 챕터 배열 반환

3. POST 메서드를 구현하세요 (새 챕터 생성):
   - 요청 body 검증 (title, content)
   - 다음 orderIndex 계산 (가장 큰 orderIndex + 1)
   - 새 챕터 생성
   - 201 상태 코드와 함께 생성된 챕터 반환

**완료 기준**:
- GET `/api/projects/[id]/chapters` 엔드포인트가 정상 작동
- 챕터가 orderIndex 순으로 반환됨
- POST로 새 챕터 생성이 정상 작동
- 소유권 검증이 올바르게 동작

---

### Task 3.3: 챕터 CRUD API 구현

**목표**: 개별 챕터의 CRUD API를 구현합니다.

**참고 문서**:
- `docs/development-tasks.md` - Phase 3, 섹션 5.2 (API 구현)
- `docs/database-design.md` - 섹션 4.3 (chapters 테이블)

**구현 내용**:
1. `app/api/chapters/[id]/route.ts` 파일을 생성하세요

2. GET 메서드 (챕터 상세 조회):
   - 세션 확인
   - 챕터 조회 (project 관계 포함)
   - 프로젝트 소유권 확인
   - 챕터 내용 반환

3. PUT 메서드 (챕터 수정):
   - 요청 body 검증 (title, content)
   - 소유권 확인
   - 챕터 업데이트
   - content가 변경되면 wordCount 재계산:
     ```typescript
     const wordCount = content.replace(/<[^>]*>/g, '')
       .trim()
       .split(/\s+/)
       .filter(Boolean).length;
     ```
   - 프로젝트의 totalWordCount도 업데이트

4. DELETE 메서드 (챕터 삭제):
   - 소유권 확인
   - 챕터 삭제
   - 이후 챕터들의 orderIndex 재조정:
     ```typescript
     await prisma.chapter.updateMany({
       where: {
         projectId: chapter.projectId,
         orderIndex: { gt: chapter.orderIndex }
       },
       data: {
         orderIndex: { decrement: 1 }
       }
     });
     ```

**완료 기준**:
- 모든 CRUD 엔드포인트가 정상 작동
- 단어 수가 자동으로 계산됨
- orderIndex가 올바르게 관리됨
- 에러 처리가 적절히 구현됨

---

### Task 3.4: 챕터 자동 저장 API 구현

**목표**: 에디터에서 작성 중인 내용을 자동으로 저장하는 API를 구현합니다.

**참고 문서**:
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.1 (에디터 기능 - 자동 저장)
- `docs/development-tasks.md` - Phase 3, 섹션 5.2 (API 구현)

**구현 내용**:
1. `app/api/chapters/[id]/autosave/route.ts` 파일을 생성하세요
2. POST 메서드를 구현하세요:
   - 세션 확인
   - 챕터 소유권 확인
   - 요청 body에서 content 추출
   - 단어 수 계산
   - 챕터 업데이트 (content, wordCount만)
   - 저장 시간을 포함한 성공 응답 반환:
     ```json
     {
       "success": true,
       "savedAt": "2026-01-04T12:34:56.789Z",
       "wordCount": 1234
     }
     ```

3. 최적화:
   - 5초 내 중복 요청은 무시 (debounce)
   - 변경사항이 없으면 저장하지 않음

**완료 기준**:
- POST `/api/chapters/[id]/autosave` 엔드포인트가 정상 작동
- 5초 간격으로 호출해도 안정적으로 동작
- 단어 수가 정확히 계산됨
- 성능이 최적화됨 (불필요한 DB 쓰기 최소화)

---

### Task 3.5: useChapters 훅 구현

**목표**: 챕터 관련 React Query 훅을 구현합니다.

**참고 문서**:
- `docs/coding-convention.md` - 섹션 5 (Custom Hooks 규칙)
- `docs/TRD_Novel_Writing_App.md` - 섹션 2.1 (상태 관리)

**구현 내용**:
1. `hooks/useChapters.ts` 파일을 생성하세요
2. 다음 훅들을 구현하세요:

   - `useChapters(projectId)`: 챕터 목록 조회
     ```typescript
     export const useChapters = (projectId: string) => {
       return useQuery({
         queryKey: ['chapters', projectId],
         queryFn: async () => {
           const res = await fetch(`/api/projects/${projectId}/chapters`);
           if (!res.ok) throw new Error('Failed to fetch chapters');
           return res.json();
         },
         enabled: !!projectId,
       });
     };
     ```

   - `useChapter(id)`: 단일 챕터 조회

   - `useCreateChapter(projectId)`: 챕터 생성

   - `useUpdateChapter()`: 챕터 수정

   - `useDeleteChapter()`: 챕터 삭제

   - `useAutoSaveChapter(chapterId)`: 자동 저장
     - debounce 5초 적용
     - 이전 content와 비교하여 변경 시만 저장

3. 각 mutation 성공 시 캐시 invalidate

**완료 기준**:
- 모든 훅이 타입 안전하게 구현됨
- 자동 저장이 5초 간격으로 동작
- 캐시 관리가 올바르게 작동
- 에러 처리가 적절히 구현됨

---

## Phase 4: 에디터 구현

### Task 4.1: Tiptap 에디터 설정

**목표**: Tiptap 리치 텍스트 에디터를 설치하고 기본 설정을 완료합니다.

**참고 문서**:
- `docs/TRD_Novel_Writing_App.md` - 섹션 5.1 (에디터 구현 Tiptap)
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.1 (에디터 기능)

**구현 내용**:
1. Tiptap 관련 패키지들을 설치하세요:
   ```bash
   npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-underline
   ```

2. `components/editor/Editor.tsx` 파일을 생성하세요
3. useEditor 훅으로 에디터를 초기화하세요:
   ```typescript
   'use client';

   import { useEditor, EditorContent } from '@tiptap/react';
   import StarterKit from '@tiptap/starter-kit';
   import Placeholder from '@tiptap/extension-placeholder';
   import Underline from '@tiptap/extension-underline';

   export const Editor = ({ content, onChange }) => {
     const editor = useEditor({
       extensions: [
         StarterKit,
         Placeholder.configure({
           placeholder: '이야기를 시작하세요...',
         }),
         Underline,
       ],
       content,
       onUpdate: ({ editor }) => {
         onChange(editor.getHTML());
       },
       editorProps: {
         attributes: {
           class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none',
         },
       },
     });

     return <EditorContent editor={editor} />;
   };
   ```

4. 에디터 스타일링:
   - 폰트: Noto Serif (18px)
   - 줄 간격: 1.8
   - 최대 너비: 900px (중앙 정렬)
   - 패딩: 상하 64px, 좌우 80px

**완료 기준**:
- Tiptap 에디터가 정상적으로 렌더링됨
- 기본 텍스트 입력이 가능
- Placeholder가 표시됨
- 에디터 스타일이 가독성 좋게 적용됨

---

### Task 4.2: 에디터 툴바 구현

**목표**: 텍스트 포매팅을 위한 툴바를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 3.2 (에디터 기능 MVP)
- `docs/DESIGN_GUIDE_Novel_Writing_App.md` - 섹션 9.1 (에디터 툴바)

**디자인 레퍼런스**:
- `Design/stitch_welcome_onboarding/editor_(chapter_view)/code.html` (에디터 하단 툴바)

**구현 내용**:
1. `components/editor/Toolbar.tsx` 파일을 생성하세요
2. 디자인 레퍼런스를 참고하여 하단 고정 툴바를 구현하세요:
   - **텍스트 포매팅 그룹**:
     - Bold (굵게) 버튼: `editor.chain().focus().toggleBold().run()`
     - Italic (기울임) 버튼: `editor.chain().focus().toggleItalic().run()`
     - Underline (밑줄) 버튼: `editor.chain().focus().toggleUnderline().run()`

   - **구분선** (세로)

   - **제목 포매팅 그룹**:
     - Heading 1 버튼: `editor.chain().focus().toggleHeading({ level: 1 }).run()`
     - Heading 2 버튼: `editor.chain().focus().toggleHeading({ level: 2 }).run()`

   - **리스트 그룹**:
     - Bullet List (비순서 리스트)
     - Ordered List (순서 리스트)

   - **구분선** (세로)

   - **히스토리 그룹**:
     - Undo 버튼
     - Redo 버튼 (비활성화 시 opacity 50%)

   - **키보드 숨김 버튼** (모바일):
     - Primary 색상 배경
     - keyboard_hide 아이콘

3. 활성 상태 표시:
   - 현재 적용된 포맷은 Primary 색상 배경 (20% opacity)
   - 예: 굵게가 적용된 텍스트에서는 Bold 버튼 하이라이트

4. 툴바 위치:
   - 화면 하단 고정 (fixed bottom)
   - 모바일: 전체 너비
   - 데스크톱: 최대 900px 중앙 정렬

**완료 기준**:
- 툴바가 디자인 레퍼런스와 일치
- 모든 포매팅 버튼이 정상 작동
- 활성 상태가 정확히 표시됨
- Undo/Redo가 정상 작동
- 모바일에서 하단에 고정됨

---

### Task 4.3: 에디터 페이지 레이아웃 구현

**목표**: 챕터 에디터 전체 페이지 레이아웃을 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 3.1 (에디터 화면 MVP)

**디자인 레퍼런스**:
- `Design/stitch_welcome_onboarding/editor_(chapter_view)/code.html` (에디터 전체 화면)

**구현 내용**:
1. `app/(dashboard)/projects/[id]/editor/page.tsx` 파일을 생성하세요
2. 디자인 레퍼런스를 참고하여 다음 구조를 구현하세요:

   - **헤더** (상단 고정):
     - 좌측: 뒤로 가기 버튼 (← 아이콘)
     - 중앙: 프로젝트명과 챕터 정보:
       - 상단: 프로젝트 제목 (작은 텍스트, 회색)
       - 하단: "Chapter 3" (굵게) + 드롭다운 아이콘
     - 우측:
       - 자동 저장 상태 표시 (데스크톱만): "☁ Saved" (Primary 색상)
       - 더보기 메뉴 (⋮)

   - **메인 에디터 영역**:
     - 최대 너비 900px, 중앙 정렬
     - 상단 패딩 24px, 하단 패딩 128px (툴바 공간)

     - 챕터 커버 이미지:
       - 21:9 aspect ratio
       - 둥근 모서리 (12px)
       - 그림자 효과
       - 우측 하단: 이미지 변경 버튼
       - 호버 시 scale 효과 (1.05)

     - 챕터 제목 입력:
       - 큰 폰트 (36px)
       - 굵게
       - 배경 투명
       - Placeholder: "Chapter Title"

     - Tiptap 에디터 컴포넌트

   - **하단 툴바**:
     - Toolbar 컴포넌트 포함
     - 툴바 위에 단어 수 표시:
       - "342 words • 2 mins read"
       - 반투명 배경, 우측 정렬

3. URL에서 챕터 ID를 가져와 해당 챕터 로드
4. 에디터 내용 변경 시 자동 저장 훅 호출

**완료 기준**:
- 에디터 페이지가 디자인 레퍼런스와 일치
- 챕터 로딩이 정상적으로 작동
- 모든 UI 요소가 올바르게 배치됨
- 반응형 레이아웃이 정상 작동 (모바일/데스크톱)

---

### Task 4.4: 자동 저장 기능 구현

**목표**: 에디터에서 5초마다 자동으로 저장하는 기능을 구현합니다.

**참고 문서**:
- `docs/coding-convention.md` - 섹션 5.1 (Hook 명명)
- `docs/TRD_Novel_Writing_App.md` - 섹션 5.1 (에디터 구현 - 자동 저장)

**구현 내용**:
1. `hooks/useAutoSave.ts` 파일을 생성하세요
2. useDebouncedCallback을 사용하여 5초 debounce를 구현하세요:
   ```typescript
   import { useEffect, useRef, useCallback } from 'react';
   import { useDebouncedCallback } from 'use-debounce';

   interface UseAutoSaveOptions {
     chapterId: string;
     onSave: (content: string) => Promise<void>;
     delay?: number;
   }

   export const useAutoSave = ({
     chapterId,
     onSave,
     delay = 5000,
   }: UseAutoSaveOptions) => {
     const previousContent = useRef<string>('');

     const debouncedSave = useDebouncedCallback(
       async (content: string) => {
         if (content === previousContent.current) return;

         try {
           await onSave(content);
           previousContent.current = content;
         } catch (error) {
           console.error('Autosave failed:', error);
         }
       },
       delay
     );

     return {
       save: debouncedSave,
       isDirty: () => previousContent.current !== '',
     };
   };
   ```

3. 에디터 컴포넌트에서 사용:
   ```typescript
   const { save } = useAutoSave({
     chapterId,
     onSave: async (content) => {
       await autoSaveMutation.mutateAsync({ content });
     },
   });

   // Editor onUpdate에서 호출
   onUpdate: ({ editor }) => {
     const content = editor.getHTML();
     save(content);
   }
   ```

4. 저장 상태 표시:
   - 저장 중: "Saving..." (회전 아이콘)
   - 저장 완료: "Saved" (체크 아이콘, Primary 색상)
   - 저장 실패: "Failed to save" (경고 아이콘, 빨간색)

**완료 기준**:
- 타이핑 후 5초가 지나면 자동으로 저장됨
- 저장 상태가 정확히 표시됨
- 변경사항이 없으면 저장하지 않음
- 에러 발생 시 적절한 메시지 표시

---

### Task 4.5: 단어 수 카운팅 구현

**목표**: 실시간으로 단어 수를 계산하고 표시하는 기능을 구현합니다.

**참고 문서**:
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.1 (단어/문자 수 실시간 카운트)
- `docs/coding-convention.md` - 섹션 10.2 (JSDoc)

**구현 내용**:
1. `lib/countWords.ts` 파일을 생성하세요:
   ```typescript
   /**
    * HTML 문자열에서 단어 수를 계산합니다.
    * HTML 태그를 제거한 후 공백 기준으로 분리합니다.
    *
    * @param html - HTML 형식의 문자열
    * @returns 단어 수
    *
    * @example
    * ```ts
    * countWords('<p>Hello world</p>'); // 2
    * countWords('<p>안녕하세요 <strong>세계</strong></p>'); // 2
    * ```
    */
   export function countWords(html: string): number {
     // HTML 태그 제거
     const text = html.replace(/<[^>]*>/g, '');

     // 앞뒤 공백 제거 후 공백으로 분리
     const words = text.trim().split(/\s+/).filter(Boolean);

     return words.length;
   }

   /**
    * HTML 문자열에서 문자 수를 계산합니다.
    *
    * @param html - HTML 형식의 문자열
    * @returns 문자 수 (공백 포함)
    */
   export function countCharacters(html: string): number {
     const text = html.replace(/<[^>]*>/g, '');
     return text.length;
   }

   /**
    * 단어 수를 기반으로 예상 읽기 시간을 계산합니다.
    * (평균 분당 200단어 기준)
    *
    * @param wordCount - 단어 수
    * @returns 예상 읽기 시간 (분)
    */
   export function estimateReadingTime(wordCount: number): number {
     const wordsPerMinute = 200;
     return Math.ceil(wordCount / wordsPerMinute);
   }
   ```

2. 에디터 하단에 단어 수 표시 컴포넌트를 추가하세요:
   - "342 words • 2 mins read" 형식
   - 반투명 배경 (dark:bg-gray-900/80)
   - 백드롭 블러 효과
   - 우측 하단 위치 (툴바 위)

3. 에디터 내용 변경 시 실시간으로 업데이트:
   ```typescript
   const wordCount = useMemo(() => {
     return countWords(editor?.getHTML() || '');
   }, [editor?.state.doc]);

   const readingTime = useMemo(() => {
     return estimateReadingTime(wordCount);
   }, [wordCount]);
   ```

4. 프로젝트의 총 단어 수도 계산하여 대시보드에 표시

**완료 기준**:
- 단어 수가 정확히 계산됨
- 실시간으로 업데이트됨
- 읽기 시간이 표시됨
- 성능 문제 없음 (useMemo 사용)

---

### Task 4.6: 키보드 단축키 구현

**목표**: 에디터에서 사용할 수 있는 키보드 단축키를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 3.2 (단축키)
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.1 (키보드 단축키 지원)

**구현 내용**:
1. Tiptap의 기본 단축키는 이미 StarterKit에 포함되어 있습니다:
   - `Ctrl/Cmd + B`: Bold
   - `Ctrl/Cmd + I`: Italic
   - `Ctrl/Cmd + U`: Underline
   - `Ctrl/Cmd + Z`: Undo
   - `Ctrl/Cmd + Shift + Z`: Redo

2. 커스텀 단축키를 추가하세요:
   ```typescript
   import { Extension } from '@tiptap/core';

   const CustomKeymap = Extension.create({
     name: 'customKeymap',

     addKeyboardShortcuts() {
       return {
         // Ctrl/Cmd + S: 수동 저장
         'Mod-s': () => {
           this.editor.commands.blur(); // 포커스 제거하여 저장 트리거
           return true; // 기본 브라우저 동작 방지
         },

         // Ctrl/Cmd + /: 툴바 포커스
         'Mod-/': () => {
           // 툴바의 첫 번째 버튼에 포커스
           document.querySelector<HTMLButtonElement>('[data-toolbar-button]')?.focus();
           return true;
         },

         // Esc: 집중 모드 토글 (Phase 2)
         'Escape': () => {
           // 집중 모드 토글 로직
           return false;
         },
       };
     },
   });
   ```

3. 에디터에 Extension 추가:
   ```typescript
   const editor = useEditor({
     extensions: [
       StarterKit,
       Underline,
       CustomKeymap,
     ],
     ...
   });
   ```

4. 단축키 도움말 모달 추가 (선택사항):
   - `?` 키로 열기
   - 모든 사용 가능한 단축키 목록 표시

**완료 기준**:
- `Ctrl+S`로 수동 저장이 가능
- 기본 포매팅 단축키가 모두 작동
- 브라우저 기본 동작이 방지됨 (Ctrl+S에서 저장 다이얼로그 안 뜸)

---

## Phase 5: 내보내기 기능

### Task 5.1: TXT 내보내기 구현

**목표**: 프로젝트를 TXT 파일로 내보내는 기능을 구현합니다.

**참고 문서**:
- `docs/TRD_Novel_Writing_App.md` - 섹션 5.3 (파일 내보내기)
- `docs/PRD_Novel_Writing_App.md` - 섹션 3.4 (데이터 관리 - 내보내기)

**구현 내용**:
1. `lib/export/txt.ts` 파일을 생성하세요:
   ```typescript
   import { Project, Chapter } from '@prisma/client';

   interface ProjectWithChapters extends Project {
     chapters: Chapter[];
   }

   /**
    * 프로젝트를 TXT 형식으로 변환합니다.
    *
    * @param project - 챕터를 포함한 프로젝트 데이터
    * @returns TXT 문자열
    */
   export function exportToTXT(project: ProjectWithChapters): string {
     const lines: string[] = [];

     // 프로젝트 제목
     lines.push(project.title);
     lines.push('='.repeat(project.title.length));
     lines.push('');

     // 장르
     if (project.genre) {
       lines.push(`Genre: ${project.genre}`);
       lines.push('');
     }

     // 시놉시스
     if (project.description) {
       lines.push('Synopsis:');
       lines.push(project.description);
       lines.push('');
     }

     lines.push('-'.repeat(60));
     lines.push('');

     // 챕터들 (orderIndex 순)
     const sortedChapters = project.chapters.sort(
       (a, b) => a.orderIndex - b.orderIndex
     );

     sortedChapters.forEach((chapter, index) => {
       // 챕터 제목
       lines.push(`# ${chapter.title}`);
       lines.push('');

       // HTML 태그 제거하여 플레인 텍스트로 변환
       const plainText = stripHtml(chapter.content || '');
       lines.push(plainText);

       // 챕터 구분선 (마지막 챕터 제외)
       if (index < sortedChapters.length - 1) {
         lines.push('');
         lines.push('-'.repeat(60));
         lines.push('');
       }
     });

     return lines.join('\n');
   }

   /**
    * HTML에서 태그를 제거하고 플레인 텍스트로 변환합니다.
    */
   function stripHtml(html: string): string {
     return html
       .replace(/<br\s*\/?>/gi, '\n')
       .replace(/<\/p>/gi, '\n\n')
       .replace(/<[^>]*>/g, '')
       .trim();
   }
   ```

2. `app/api/projects/[id]/export/route.ts` 파일을 생성하세요:
   ```typescript
   export async function POST(
     request: NextRequest,
     { params }: { params: { id: string } }
   ) {
     const session = await getServerSession(authOptions);
     if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

     const { format } = await request.json();

     // 프로젝트와 챕터 조회
     const project = await prisma.project.findUnique({
       where: { id: params.id },
       include: {
         chapters: {
           orderBy: { orderIndex: 'asc' }
         }
       }
     });

     if (!project || project.userId !== session.user.id) {
       return NextResponse.json({ error: 'Not found' }, { status: 404 });
     }

     if (format === 'txt') {
       const content = exportToTXT(project);
       const filename = `${project.title}.txt`;

       return new NextResponse(content, {
         headers: {
           'Content-Type': 'text/plain; charset=utf-8',
           'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
         },
       });
     }

     return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
   }
   ```

**완료 기준**:
- TXT 파일이 정상적으로 생성됨
- 챕터 순서가 올바르게 유지됨
- HTML이 깔끔한 플레인 텍스트로 변환됨
- 파일명이 프로젝트 제목으로 설정됨

---

### Task 5.2: DOCX 내보내기 구현

**목표**: 프로젝트를 DOCX 파일로 내보내는 기능을 구현합니다.

**참고 문서**:
- `docs/TRD_Novel_Writing_App.md` - 섹션 5.3 (파일 내보내기 - DOCX)
- `docs/development-tasks.md` - Phase 5, 섹션 7.1 (내보내기 구현)

**구현 내용**:
1. `docx` 라이브러리를 설치하세요:
   ```bash
   npm install docx
   ```

2. `lib/export/docx.ts` 파일을 생성하세요:
   ```typescript
   import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
   import { Project, Chapter } from '@prisma/client';

   interface ProjectWithChapters extends Project {
     chapters: Chapter[];
   }

   /**
    * 프로젝트를 DOCX 형식으로 변환합니다.
    *
    * @param project - 챕터를 포함한 프로젝트 데이터
    * @returns DOCX Buffer
    */
   export async function exportToDOCX(
     project: ProjectWithChapters
   ): Promise<Buffer> {
     const sortedChapters = project.chapters.sort(
       (a, b) => a.orderIndex - b.orderIndex
     );

     const doc = new Document({
       sections: [{
         properties: {},
         children: [
           // 제목 페이지
           new Paragraph({
             text: project.title,
             heading: HeadingLevel.TITLE,
             alignment: 'center',
             spacing: { after: 400 },
           }),

           // 장르
           ...(project.genre ? [
             new Paragraph({
               children: [
                 new TextRun({
                   text: `Genre: ${project.genre}`,
                   italics: true,
                 }),
               ],
               alignment: 'center',
               spacing: { after: 200 },
             }),
           ] : []),

           // 시놉시스
           ...(project.description ? [
             new Paragraph({
               text: 'Synopsis',
               heading: HeadingLevel.HEADING_2,
               spacing: { before: 400, after: 200 },
             }),
             new Paragraph({
               text: project.description,
               spacing: { after: 400 },
             }),
           ] : []),

           // 페이지 구분
           new Paragraph({
             text: '',
             pageBreakBefore: true,
           }),

           // 챕터들
           ...sortedChapters.flatMap((chapter, index) => {
             const paragraphs: Paragraph[] = [];

             // 챕터 제목
             paragraphs.push(
               new Paragraph({
                 text: chapter.title,
                 heading: HeadingLevel.HEADING_1,
                 spacing: { before: 400, after: 300 },
                 pageBreakBefore: index > 0,
               })
             );

             // 챕터 내용 (HTML 파싱)
             const content = parseHtmlToParagraphs(chapter.content || '');
             paragraphs.push(...content);

             return paragraphs;
           }),
         ],
       }],
     });

     return await Packer.toBuffer(doc);
   }

   /**
    * 간단한 HTML을 Paragraph 배열로 변환합니다.
    */
   function parseHtmlToParagraphs(html: string): Paragraph[] {
     const paragraphs: Paragraph[] = [];

     // <p> 태그로 분리
     const pTags = html.match(/<p[^>]*>(.*?)<\/p>/gs) || [];

     pTags.forEach((pTag) => {
       // 태그 내용 추출
       let text = pTag.replace(/<p[^>]*>|<\/p>/g, '');

       // TextRun 배열 생성 (굵게, 기울임 등 처리)
       const runs: TextRun[] = [];

       // 간단한 파싱: <strong>, <em>, <u> 지원
       const segments = text.split(/(<strong>|<\/strong>|<em>|<\/em>|<u>|<\/u>)/);

       let isBold = false;
       let isItalic = false;
       let isUnderline = false;

       segments.forEach((segment) => {
         if (segment === '<strong>') isBold = true;
         else if (segment === '</strong>') isBold = false;
         else if (segment === '<em>') isItalic = true;
         else if (segment === '</em>') isItalic = false;
         else if (segment === '<u>') isUnderline = true;
         else if (segment === '</u>') isUnderline = false;
         else if (segment) {
           runs.push(new TextRun({
             text: segment.replace(/<[^>]*>/g, ''),
             bold: isBold,
             italics: isItalic,
             underline: isUnderline ? {} : undefined,
           }));
         }
       });

       paragraphs.push(new Paragraph({
         children: runs,
         spacing: { after: 200 },
       }));
     });

     return paragraphs;
   }
   ```

3. API Route에 DOCX 처리 추가:
   ```typescript
   if (format === 'docx') {
     const buffer = await exportToDOCX(project);
     const filename = `${project.title}.docx`;

     return new NextResponse(buffer, {
       headers: {
         'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
       },
     });
   }
   ```

**완료 기준**:
- DOCX 파일이 정상적으로 생성됨
- 제목, 장르, 시놉시스가 포함됨
- 챕터가 새 페이지에서 시작됨
- 기본 포매팅(굵게, 기울임, 밑줄)이 유지됨
- MS Word에서 정상적으로 열림

---

### Task 5.3: 내보내기 UI 구현

**목표**: 내보내기 형식을 선택하고 다운로드하는 UI를 구현합니다.

**참고 문서**:
- `docs/USER_FLOW_Novel_Writing_App.md` - 섹션 4 (프로젝트 내보내기 플로우)
- `docs/development-tasks.md` - Phase 5, 섹션 7.1 (내보내기 구현)

**구현 내용**:
1. `components/project/ExportModal.tsx` 파일을 생성하세요
2. shadcn/ui Dialog를 사용하여 모달을 구현하세요:
   - **모달 헤더**:
     - "Export Project" 제목
     - "Download your novel in various formats" 부제

   - **형식 선택**:
     - TXT 옵션:
       - 📄 아이콘
       - "Plain Text (.txt)" 제목
       - "Simple text format, compatible everywhere" 설명
       - 라디오 버튼

     - DOCX 옵션:
       - 📝 아이콘
       - "Microsoft Word (.docx)" 제목
       - "Preserves formatting, editable in Word" 설명
       - 라디오 버튼

   - **푸터 액션**:
     - "Cancel" 버튼
     - "Download" Primary 버튼 (다운로드 아이콘 포함)

3. 다운로드 로직:
   ```typescript
   const handleDownload = async (format: 'txt' | 'docx') => {
     setIsLoading(true);

     try {
       const response = await fetch(`/api/projects/${projectId}/export`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ format }),
       });

       if (!response.ok) throw new Error('Export failed');

       // Blob으로 변환
       const blob = await response.blob();
       const url = window.URL.createObjectURL(blob);

       // 다운로드 트리거
       const a = document.createElement('a');
       a.href = url;
       a.download = `${project.title}.${format}`;
       document.body.appendChild(a);
       a.click();

       // 정리
       window.URL.revokeObjectURL(url);
       document.body.removeChild(a);

       toast.success('File downloaded successfully');
       onClose();
     } catch (error) {
       toast.error('Failed to export project');
     } finally {
       setIsLoading(false);
     }
   };
   ```

4. 프로젝트 상세 페이지 또는 더보기 메뉴에 "Export" 버튼 추가

**완료 기준**:
- 모달이 깔끔하게 디자인됨
- 형식 선택이 라디오 버튼으로 동작
- 다운로드 버튼 클릭 시 파일이 다운로드됨
- 로딩 상태가 표시됨
- 에러 처리가 적절히 구현됨

---

## 🎯 완료 체크리스트

### Phase 0: 프로젝트 초기 설정
- [ ] Task 0.1: Next.js 프로젝트 초기화
- [ ] Task 0.2: Tailwind 테마 설정
- [ ] Task 0.3: Prisma 설정 및 데이터베이스 연결
- [ ] Task 0.4: shadcn/ui 설치

### Phase 1: 인증 시스템
- [ ] Task 1.1: NextAuth.js 설정
- [ ] Task 1.2: 회원가입 페이지 구현
- [ ] Task 1.3: 회원가입 API 구현
- [ ] Task 1.4: 로그인 페이지 구현
- [ ] Task 1.5: 웰컴 온보딩 페이지 구현
- [ ] Task 1.6: 세션 미들웨어 구현

### Phase 2: 프로젝트 관리
- [ ] Task 2.1: 프로젝트 목록 페이지 구현
- [ ] Task 2.2: 프로젝트 목록 조회 API 구현
- [ ] Task 2.3: 새 프로젝트 생성 모달 구현
- [ ] Task 2.4: 프로젝트 생성 API 구현
- [ ] Task 2.5: React Query 설정 및 훅 구현
- [ ] Task 2.6: 프로젝트 수정 기능 구현
- [ ] Task 2.7: 프로젝트 삭제 기능 구현

### Phase 3: 챕터 관리
- [ ] Task 3.1: 챕터 목록 사이드바 구현
- [ ] Task 3.2: 챕터 목록 조회 API 구현
- [ ] Task 3.3: 챕터 CRUD API 구현
- [ ] Task 3.4: 챕터 자동 저장 API 구현
- [ ] Task 3.5: useChapters 훅 구현

### Phase 4: 에디터 구현
- [ ] Task 4.1: Tiptap 에디터 설정
- [ ] Task 4.2: 에디터 툴바 구현
- [ ] Task 4.3: 에디터 페이지 레이아웃 구현
- [ ] Task 4.4: 자동 저장 기능 구현
- [ ] Task 4.5: 단어 수 카운팅 구현
- [ ] Task 4.6: 키보드 단축키 구현

### Phase 5: 내보내기 기능
- [ ] Task 5.1: TXT 내보내기 구현
- [ ] Task 5.2: DOCX 내보내기 구현
- [ ] Task 5.3: 내보내기 UI 구현

---

## 📚 추가 참고 사항

### 공통 가이드라인
1. 모든 컴포넌트는 TypeScript strict 모드에서 타입 에러 없이 작동해야 합니다
2. 모든 API는 적절한 에러 처리를 포함해야 합니다
3. 모든 사용자 입력은 Zod로 검증되어야 합니다
4. 모든 UI는 라이트/다크 모드를 지원해야 합니다
5. 모든 페이지는 모바일 반응형이어야 합니다

### 디자인 시스템 준수
- Primary Color: `#3c83f6`
- Font Display: `Noto Serif` (제목)
- Font Sans: `Noto Sans` (본문)
- Border Radius: `0.5rem` (lg), `0.75rem` (xl)
- 애니메이션: `transition-all duration-200`

### 성능 가이드
- 이미지는 Next.js Image 컴포넌트 사용
- 에디터는 dynamic import로 로딩
- React Query로 서버 상태 캐싱
- useMemo/useCallback로 불필요한 리렌더링 방지

---

**문서 버전**: 1.0.0
**최종 수정일**: 2026-01-04
**작성자**: AI Development Team
