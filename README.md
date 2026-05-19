# coeur — 공간 디자인 스튜디오 웹사이트

> 다크 톤 미니멀 풀스택 웹사이트 + 풀 CMS + 문의 관리

## 라이브
- **공개 사이트**: https://coeurworks.kr · https://coeur-tau.vercel.app
- **관리자**: https://coeur-tau.vercel.app/admin

## 기술 스택
- Next.js 16.2 (App Router · Turbopack · proxy 미들웨어)
- React 19.2 · TypeScript strict
- Prisma 6 · PostgreSQL (Vercel-managed Neon)
- Tailwind CSS 4.3 · shadcn/ui base
- Framer Motion 12 · Cormorant Garamond + Geist Sans
- @vercel/blob (이미지 업로드)
- HMAC-SHA256 쿠키 세션 + 로그인 rate limit (DB-기반)

## 페이지 구조
```
공개      /  /about  /portfolio  /contact         (서버 컴포넌트, DB 콘텐츠)
관리자    /admin/{login,content,portfolio,inquiries}
API       /api/upload  (Vercel Blob, 인증 필요)
SEO       /robots.txt  /sitemap.xml               (자동 생성)
```

## 로컬 개발

```bash
# 1) Postgres 실행 (brew services start postgresql@16)
createdb coeur_dev

# 2) 환경변수
cp .env.local.example .env.local  # DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET

# 3) 마이그레이션 + 시드
pnpm install
npx prisma migrate dev
npx prisma db seed

# 4) 개발 서버
pnpm dev
```

## 배포 (Vercel)

- GitHub push → 자동 빌드 (Vercel github 연동)
- 빌드 스크립트: `prisma generate && prisma migrate deploy && prisma db seed && next build`
- 환경변수 (Production):
  - DATABASE_URL (Vercel-managed Neon, 자동 주입)
  - BLOB_READ_WRITE_TOKEN (Vercel Blob, 자동 주입)
  - ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET (수동, sensitive)

### 비밀번호 / 세션 비밀키 교체

비밀번호 노출 의심 / 정기 교체 시:

```bash
# 1) 새 값 생성
node -e "console.log(require('crypto').randomBytes(12).toString('base64').replace(/[+\/=]/g,'').slice(0,16))"  # ADMIN_PASSWORD
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # SESSION_SECRET

# 2) Vercel 환경변수 업데이트
vercel env rm ADMIN_PASSWORD production
vercel env add ADMIN_PASSWORD production   # 새 값 입력, sensitive=y

vercel env rm SESSION_SECRET production
vercel env add SESSION_SECRET production   # 새 값 입력, sensitive=y

# 3) 재배포 → 이전 세션 모두 무효화 (SESSION_SECRET 교체 효과)
vercel --prod --yes
```

`SESSION_SECRET` 교체 시 모든 활성 세션이 즉시 무효화되어 사실상 "전 세션 강제 로그아웃" 기능으로 동작합니다.

## 보안

- ✅ Server Action 단계의 `requireAdmin()` 가드 (미들웨어 우회 차단)
- ✅ HMAC 서명 constant-time XOR 비교 (Edge runtime 호환)
- ✅ 비밀번호 timing-safe 비교 (`crypto.timingSafeEqual`)
- ✅ 로그인 rate limit: IP당 15분 5회 실패 시 잠금
- ✅ Open redirect allowlist (`/admin/...`만 허용)
- ✅ SVG 업로드 거부 (XSS 방지) + MIME→확장자 강제 매핑
- ✅ 콘텐츠 JSON 키 화이트리스트 (proto pollution 방지)
- ✅ 보안 헤더 5종: HSTS / X-Frame DENY / X-Content nosniff / Referrer / Permissions
- ✅ honeypot 봇 차단 (Contact 폼)

## 관리자 운영

### 로그인
https://coeur-tau.vercel.app/admin → ADMIN_USERNAME / ADMIN_PASSWORD

### 콘텐츠 편집
- `/admin/content` → 5개 페이지 (site / home / about / portfolio / contact)
- 텍스트 입력 → 저장 → 즉시 공개 사이트 반영 (캐시 무효화)

### 포트폴리오 관리
- `/admin/portfolio` → 카드 추가 / 수정 / 삭제 / 정렬 / 공개 토글
- 이미지: 드래그·드롭 업로드 (Vercel Blob, 8MB, PNG/JPG/WebP/AVIF/GIF)
- 또는 외부 URL 직접 입력

### 문의 관리
- `/admin/inquiries` → 상태 필터 (신규 / 읽음 / 회신 완료 / 보관)
- 상세에서 상태 변경, 내부 메모, 이메일 회신 링크
- 자동: 신규 문의 상세 첫 열람 시 '읽음'으로 전환

### 로그인 시도 로그
DB의 `LoginAttempt` 테이블에 IP / 시각 / 성공여부 / username 기록.

```sql
-- 최근 24시간 실패 시도
SELECT ip, username, "attemptedAt" FROM "LoginAttempt"
WHERE ok = false AND "attemptedAt" > now() - interval '24 hours'
ORDER BY "attemptedAt" DESC;
```

## 라이선스

태동그룹 · coeur 고객사 프로젝트

---
최종 업데이트: 2026-05-19
