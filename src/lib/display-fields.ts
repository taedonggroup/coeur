// 핵심 디스플레이 텍스트 레지스트리.
// 관리자에서 데스크톱/모바일 문구 분리 + 폰트 크기(px) 조절을 허용하는 필드 정의.
// 여기에 등록된 (page, field)만 display 설정을 가질 수 있다 (화이트리스트).

export const FONT_PX_MIN = 12;
export const FONT_PX_MAX = 160;

// display 설정의 허용 속성 (proto pollution 방지용 화이트리스트)
export const DISPLAY_PROPS = [
  "mobileText",
  "fontDesktopPx",
  "fontMobilePx",
] as const;

export type DisplaySetting = {
  mobileText?: string;
  fontDesktopPx?: number | null;
  fontMobilePx?: number | null;
};

export type DisplayMap = Record<string, DisplaySetting>;

type DisplayFieldDef = {
  /** 기본 데스크톱 폰트 크기(px) — 현재 디자인과 1:1 (sm: 클래스) */
  defaultDesktopPx: number;
  /** 기본 모바일 폰트 크기(px) — 현재 디자인과 1:1 (기본 클래스) */
  defaultMobilePx: number;
  /** 관리자 카드 라벨 */
  label: string;
};

export const DISPLAY_FIELDS = {
  home: {
    tagline: {
      defaultDesktopPx: 30,
      defaultMobilePx: 24,
      label: "메인 태그라인",
    },
    subtagline: {
      defaultDesktopPx: 16,
      defaultMobilePx: 14,
      label: "보조 문구",
    },
  },
  about: {
    heading1: {
      defaultDesktopPx: 60,
      defaultMobilePx: 48,
      label: "헤드라인 윗줄",
    },
    heading2: {
      defaultDesktopPx: 60,
      defaultMobilePx: 48,
      label: "헤드라인 아랫줄",
    },
  },
  portfolio: {
    heading1: {
      defaultDesktopPx: 60,
      defaultMobilePx: 48,
      label: "헤드라인 앞부분",
    },
    heading2: {
      defaultDesktopPx: 60,
      defaultMobilePx: 48,
      label: "헤드라인 뒷부분",
    },
  },
  contact: {
    heading1: {
      defaultDesktopPx: 60,
      defaultMobilePx: 48,
      label: "헤드라인 앞부분",
    },
    heading2: {
      defaultDesktopPx: 60,
      defaultMobilePx: 48,
      label: "헤드라인 뒷부분",
    },
  },
} as const satisfies Record<string, Record<string, DisplayFieldDef>>;

export type DisplayPage = keyof typeof DISPLAY_FIELDS;

export function isDisplayField(page: string, field: string): boolean {
  const pageDef = (
    DISPLAY_FIELDS as Record<string, Record<string, DisplayFieldDef>>
  )[page];
  return Boolean(
    pageDef && Object.prototype.hasOwnProperty.call(pageDef, field),
  );
}

export function getDisplayFieldDef(
  page: string,
  field: string,
): DisplayFieldDef | null {
  if (!isDisplayField(page, field)) return null;
  return (DISPLAY_FIELDS as Record<string, Record<string, DisplayFieldDef>>)[
    page
  ][field];
}

/** px 문자열/숫자를 12~160 정수로 클램프. 비정상 값은 null. */
export function clampFontPx(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : parseInt(String(value ?? "").trim(), 10);
  if (!Number.isFinite(n)) return null;
  return Math.min(FONT_PX_MAX, Math.max(FONT_PX_MIN, Math.round(n)));
}

export type ResolvedDisplay = {
  desktopText: string;
  /** 데스크톱과 다른 모바일 문구 (없으면 null → 데스크톱 사용) */
  mobileText: string | null;
  /** 적용할 데스크톱 폰트 크기(px) */
  fontDesktopPx: number;
  /** 적용할 모바일 폰트 크기(px) */
  fontMobilePx: number;
};

/**
 * 페이지 콘텐츠 + display 설정을 합쳐 렌더에 필요한 최종 값으로 해석.
 * content[field]는 데스크톱 문구(문자열), content.display[field]는 보조 설정.
 */
export function resolveDisplay(
  page: string,
  field: string,
  content: Record<string, unknown>,
): ResolvedDisplay {
  const def = getDisplayFieldDef(page, field);
  // mobileRaw와 동일하게 trim해 비교 — 데스크톱 문구 앞뒤 공백 유무로
  // 의미상 동일한 모바일 문구가 불필요한 토글을 만들지 않도록.
  const desktopText = String(content[field] ?? "").trim();
  const display = (content.display as DisplayMap | undefined)?.[field] ?? {};

  const mobileRaw =
    typeof display.mobileText === "string" ? display.mobileText.trim() : "";
  const fontDesktopPx = clampFontPx(display.fontDesktopPx);
  const fontMobilePx = clampFontPx(display.fontMobilePx);

  return {
    desktopText,
    mobileText:
      mobileRaw.length > 0 && mobileRaw !== desktopText ? mobileRaw : null,
    fontDesktopPx: fontDesktopPx ?? def?.defaultDesktopPx ?? 16,
    fontMobilePx: fontMobilePx ?? def?.defaultMobilePx ?? 16,
  };
}
