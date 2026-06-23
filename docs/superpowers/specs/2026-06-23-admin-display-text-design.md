# 관리자 디스플레이 텍스트 — 데스크톱/모바일 분리 + 폰트 크기

- 작성일: 2026-06-23
- 작성: Claude Code (CTO 에이전트)
- 상태: 승인됨 (CEO)

## 목표

관리자(CEO/운영자, 비개발자)가 핵심 디스플레이 텍스트에 대해:
1. 데스크톱과 모바일에서 **다른 문구**를 설정 (선택적 오버라이드)
2. **글자 크기(px)**를 데스크톱·모바일 각각 직접 조절

## 적용 범위 (핵심 디스플레이 텍스트 7개)

| 페이지 | 필드 | 기본 크기 (모바일/데스크톱) |
|---|---|---|
| home | tagline | 24 / 30 px |
| home | subtagline | 14 / 16 px |
| about | heading1, heading2 | 48 / 60 px |
| portfolio | heading1, heading2 | 48 / 60 px |
| contact | heading1, heading2 | 48 / 60 px |

나머지 필드(버튼 라벨, 폼 라벨, SEO 메타 등)는 기존 단일 입력 유지.

## 데이터 모델 (Approach A — 가산형)

기존 문자열 키(`tagline` 등)는 **데스크톱 문구**로 그대로 유지. 페이지 콘텐츠에 보조 객체 `display`만 추가.

```jsonc
{
  "tagline": "공간의 본질을 디자인합니다.",   // 데스크톱 문구 (불변)
  "display": {
    "tagline": { "mobileText": "공간의 본질", "fontDesktopPx": 34, "fontMobilePx": 22 }
  }
}
```

- `mobileText` 빈 값 → 데스크톱 문구 사용 (선택적 오버라이드)
- `fontDesktopPx`/`fontMobilePx` 빈 값(null) → 레지스트리 기본값 사용 (현재 외관 보존)
- 폰트 px는 **12~160으로 클램프**
- 기존 데이터 마이그레이션 불필요 (display 없으면 기본값으로 fallback)

## 반응형 폰트 (JS 없이)

`globals.css`:
```css
.display-text { font-size: var(--fs-m); }
@media (min-width: 640px) { .display-text { font-size: var(--fs-d); } }
```
컴포넌트가 `style={{ "--fs-m": "22px", "--fs-d": "34px" }}` 주입. 모바일 문구는 `sm:hidden`/`hidden sm:inline` span 토글로 렌더(깜빡임 없음, 서버 컴포넌트 호환).

## 컴포넌트/파일

신규:
- `src/lib/display-fields.ts` — 레지스트리(필드·기본px·라벨), `clampFontPx`, `resolveDisplay(page, field, content)`, `isDisplayField`
- `src/components/DisplayText.tsx` — 서버 호환 렌더 헬퍼 (no hooks)

수정:
- `src/app/globals.css` — `.display-text` 규칙
- `src/components/HomeHero.tsx` — tagline/subtagline DisplayText 적용
- `src/app/(public)/{about,portfolio,contact}/page.tsx` — 헤드라인 DisplayText 적용
- `src/lib/content.ts` — `PageContent`에 optional `display` 노출
- `src/app/admin/content/[page]/page.tsx` — display 설정을 ContentEditor에 전달
- `src/components/admin/ContentEditor.tsx` — display 필드는 4입력 카드(데스크톱 문구/모바일 문구/데스크톱 px/모바일 px)
- `src/app/admin/content/actions.ts` — `__display.<field>.<prop>` 파싱·화이트리스트·클램프·저장

## 보안

- display 중첩 키 화이트리스트: 레지스트리에 등록된 필드명 + `mobileText|fontDesktopPx|fontMobilePx`만 허용 (proto pollution 차단 유지)
- px는 정수 파싱 + 12~160 클램프, 비정상 값은 null 처리
- 기존 `requireAdmin()` 가드 그대로

## 검증

- `pnpm lint` + `pnpm typecheck` + `pnpm build` 통과
- 데스크톱/모바일 스크린샷 시각 회귀 (기본값일 때 현재와 동일해야 함)
- 모바일 실기기 확인 후 완료 선언
- 디자인 토큰/팔레트 변경 없음 (폰트 크기·문구만) → DESIGN.md 위반 없음
