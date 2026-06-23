"use server";

import { requireAdmin } from "@/lib/auth";

import { updateTag, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { DEFAULT_SITE_CONTENT } from "@/lib/content-defaults";
import {
  isDisplayField,
  clampFontPx,
  type DisplayMap,
  type DisplaySetting,
} from "@/lib/display-fields";

export type ContentSaveState = { ok: boolean; message: string };

export async function saveContent(
  _prev: ContentSaveState,
  formData: FormData,
): Promise<ContentSaveState> {
  await requireAdmin();
  const page = String(formData.get("__page") ?? "");
  if (!(page in DEFAULT_SITE_CONTENT)) {
    return { ok: false, message: "알 수 없는 페이지입니다." };
  }

  const defaults = (
    DEFAULT_SITE_CONTENT as unknown as Record<string, Record<string, unknown>>
  )[page];
  const current =
    (await db.sitePage.findUnique({ where: { page } }))?.content ?? {};

  const next: Record<string, unknown> = { ...(current as object) };

  // 1) 일반 텍스트 필드 (데스크톱 문구 포함)
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("__")) continue;
    // 화이트리스트: DEFAULT_SITE_CONTENT에 정의된 키만 허용
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) continue;
    const original = defaults[key];
    const raw = String(value);

    if (Array.isArray(original)) {
      next[key] = raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else {
      next[key] = raw;
    }
  }

  // 2) 디스플레이 설정 (__display.<field>.<prop>) — 레지스트리 화이트리스트 + px 클램프
  const display: DisplayMap = {};
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("__display.")) continue;
    const parts = key.split(".");
    if (parts.length !== 3) continue;
    const [, field, prop] = parts;
    if (!isDisplayField(page, field)) continue;

    const setting: DisplaySetting = display[field] ?? {};
    const raw = String(value).trim();

    if (prop === "mobileText") {
      if (raw.length > 0) setting.mobileText = raw;
    } else if (prop === "fontDesktopPx" || prop === "fontMobilePx") {
      if (raw.length > 0) {
        const px = clampFontPx(raw);
        if (px !== null) setting[prop] = px;
      }
    } else {
      continue; // 허용되지 않은 prop
    }

    if (Object.keys(setting).length > 0) display[field] = setting;
  }

  if (Object.keys(display).length > 0) {
    next.display = display;
  } else {
    delete next.display;
  }

  await db.sitePage.upsert({
    where: { page },
    update: { content: next as object },
    create: { page, content: next as object },
  });

  // 모든 페이지 콘텐츠 캐시 무효화 + 영향받는 라우트
  updateTag(`site-page:${page}`);
  revalidatePath(`/`);
  revalidatePath(`/${page}`);

  return { ok: true, message: "저장되었습니다." };
}
