"use server";

import { updateTag, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { DEFAULT_SITE_CONTENT } from "@/lib/content-defaults";

export type ContentSaveState = { ok: boolean; message: string };

export async function saveContent(
  _prev: ContentSaveState,
  formData: FormData
): Promise<ContentSaveState> {
  const page = String(formData.get("__page") ?? "");
  if (!(page in DEFAULT_SITE_CONTENT)) {
    return { ok: false, message: "알 수 없는 페이지입니다." };
  }

  const defaults = (
    DEFAULT_SITE_CONTENT as unknown as Record<string, Record<string, unknown>>
  )[page];
  const current = (await db.sitePage.findUnique({ where: { page } }))?.content ?? {};

  const next: Record<string, unknown> = { ...(current as object) };

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("__")) continue;
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
