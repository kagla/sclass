# S-Class 학원 관리 시스템

학원 운영에 필요한 종합 관리 웹 애플리케이션입니다.

## 기술 스택

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TailwindCSS v4** + **shadcn/ui**
- **Prisma 6** + **MySQL**
- **Auth.js v5** (Credentials, JWT 세션, 역할 기반 접근제어)
- **PortOne** (이니시스) 결제 + 정기결제
- **next-themes** 다크모드

## 주요 기능

| 기능 | 설명 |
|------|------|
| 인증/권한 | 로그인, 회원가입, 역할별 접근제어 (관리자/강사/학부모/학생) |
| 학원 설정 | 학원 기본 정보, 연락처, 운영시간, 비전 관리 |
| 인원 관리 | 강사/학생/학부모 CRUD, 학부모-학생 연결 |
| 과목/시간표 | 과목 CRUD, 강사 배정, 수강등록, 주간 시간표 그리드 (충돌 감지) |
| 출결/성적 | 일괄 출결 체크, 성적 입력/조회 |
| 게시판 | 공지/학부모/문의 3종 게시판, 댓글/대댓글, 파일 첨부 |
| 결제 | PortOne(이니시스) 일회/정기결제, 구독 관리, 웹훅 처리 |
| 상담 신청 | 비로그인 공개 폼, 비밀번호로 조회/수정, 관리자 상태 관리 |
| 식단표 | 주간 식단 에디터 |
| 합격수기 | CRUD + 공개 갤러리 |
| 공개 사이트 | 랜딩, 학원소개, 교육과정, 강사소개, 입학안내, 커뮤니티 |

## 시작하기

### 사전 요구사항

- Node.js 18+
- MySQL 8+

### 설치

```bash
npm install
```

### 환경 변수

`.env` 파일을 프로젝트 루트에 생성합니다.

```env
DATABASE_URL="mysql://sclass:sclass@localhost:3306/sclass"
AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"

# PortOne 결제 (선택)
NEXT_PUBLIC_PORTONE_STORE_ID=""
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=""
PORTONE_IMP_KEY=""
PORTONE_IMP_SECRET=""
```

### 데이터베이스 설정

```bash
# 스키마 동기화
npx prisma db push

# 시드 데이터 생성 (관리자 계정 + 기본 학원 + 게시판)
npm run db:seed

# (선택) Prisma Studio로 데이터 확인
npm run db:studio
```

### 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

### 기본 관리자 계정

- 이메일: `admin@sclass.kr`
- 비밀번호: `admin123`

## 프로젝트 구조

```
src/
├── app/
│   ├── (public)/        # 공개 웹사이트
│   ├── (auth)/          # 로그인/회원가입
│   ├── dashboard/       # 관리자 대시보드
│   └── api/             # API 라우트 (인증, 업로드, 웹훅)
├── actions/             # Server Actions
├── components/
│   ├── ui/              # shadcn/ui 컴포넌트
│   ├── dashboard/       # 대시보드 컴포넌트
│   ├── forms/           # 폼 컴포넌트
│   ├── payment/         # 결제 컴포넌트
│   └── public/          # 공개 사이트 컴포넌트
├── lib/                 # 유틸리티 (DB, 인증, 상수, 결제)
└── types/               # TypeScript 타입
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run db:push` | Prisma 스키마 DB 동기화 |
| `npm run db:seed` | 시드 데이터 생성 |
| `npm run db:studio` | Prisma Studio 실행 |
