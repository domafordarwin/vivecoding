# 🚀 URGENT: Week 1 개발 시작 요청

## 현재 상황
- ✅ 문서 작성 완료 (PRD, TRD, development-tasks.md 등)
- ❌ **실제 코드 구현은 0%** 상태
- ❌ app/page.tsx는 Next.js 기본 템플릿 그대로

## 🎯 즉시 시작할 작업

**[development-tasks.md](./development-tasks.md)의 Week 1 작업을 실제로 구현해주세요!**

### Week 1 - Day 1-2 작업 (환경 설정)

아래 작업을 **실제로 코드로 구현**해주세요:

#### 1. 필수 패키지 설치
```bash
npm install prisma @prisma/client
npm install next-auth@beta
npm install zod react-hook-form @hookform/resolvers
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install bcryptjs
npm install -D @types/bcryptjs
```

#### 2. Prisma 설정
- `prisma/schema.prisma` 파일 생성
- User 모델 정의
- Supabase PostgreSQL 연결
- 마이그레이션 실행

#### 3. NextAuth.js 설정
- `app/api/auth/[...nextauth]/route.ts` 생성
- 이메일/비밀번호 프로바이더 설정
- Google OAuth 설정
- 환경 변수 설정 (.env.local)

#### 4. 기본 UI 컴포넌트
- `components/ui/button.tsx` (shadcn/ui)
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `lib/utils.ts` (cn 함수)

#### 5. 회원가입/로그인 페이지
- `app/register/page.tsx` 생성
- `app/login/page.tsx` 생성
- 폼 검증 (Zod)
- API 라우트 생성

---

## ⚠️ 중요 지시사항

1. **문서 작성 금지**: 더 이상 문서(MD 파일)를 만들지 마세요
2. **실제 코드 작성**: .tsx, .ts 파일을 만들어주세요
3. **작동하는 기능**: 실제로 회원가입/로그인이 되어야 합니다
4. **순서대로**: development-tasks.md의 순서를 따라주세요

---

## 📋 체크리스트

완료되면 다음이 가능해야 합니다:

- [ ] `npm run dev` 실행 시 에러 없이 작동
- [ ] `/register` 페이지에서 회원가입 가능
- [ ] `/login` 페이지에서 로그인 가능
- [ ] Prisma로 데이터베이스 연결됨
- [ ] NextAuth.js 세션 작동

---

## 🔥 지금 바로 시작하세요!

**development-tasks.md의 2.1 초기 설정 태스크부터 실제 코드 구현을 시작해주세요.**
