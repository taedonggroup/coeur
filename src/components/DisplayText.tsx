import type { CSSProperties, ElementType } from "react";
import { resolveDisplay } from "@/lib/display-fields";

type Props = {
  page: string;
  field: string;
  content: Record<string, unknown>;
  /** 렌더할 태그 (기본 span) */
  as?: ElementType;
  className?: string;
};

/**
 * 디스플레이 텍스트 렌더 헬퍼 (서버/클라이언트 컴포넌트 모두 호환 — 훅 없음).
 * - 폰트 크기: CSS 변수(--fs-m / --fs-d)로 주입, globals.css의 .display-text가 반응형 적용
 * - 모바일 문구 오버라이드: sm:hidden / hidden sm:inline span 토글 (JS 없이)
 */
export function DisplayText({ page, field, content, as, className }: Props) {
  const Tag = (as ?? "span") as ElementType;
  const r = resolveDisplay(page, field, content);

  const style = {
    "--fs-d": `${r.fontDesktopPx}px`,
    "--fs-m": `${r.fontMobilePx}px`,
  } as CSSProperties;

  const cls = ["display-text", className].filter(Boolean).join(" ");

  if (r.mobileText) {
    return (
      <Tag className={cls} style={style}>
        <span className="sm:hidden">{r.mobileText}</span>
        <span className="hidden sm:inline">{r.desktopText}</span>
      </Tag>
    );
  }

  return (
    <Tag className={cls} style={style}>
      {r.desktopText}
    </Tag>
  );
}
