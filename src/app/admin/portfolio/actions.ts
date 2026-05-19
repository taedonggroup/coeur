"use server";

import { requireAdmin } from "@/lib/auth";

import { updateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";

const ProjectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "slug 필수")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 사용"),
  number: z.string().trim().min(1).max(8),
  title: z.string().trim().min(1, "제목 필수").max(200),
  category: z.string().trim().min(1, "분류 필수").max(80),
  year: z.string().trim().min(1).max(20),
  location: z.string().trim().max(120),
  imageUrl: z.string().trim().url("이미지 URL이 유효하지 않습니다."),
  imageAlt: z.string().trim().max(200),
  href: z.string().trim().max(500),
  order: z.coerce.number().int().min(0).max(99999),
  published: z.coerce.boolean(),
});

export type ProjectFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

function parseForm(formData: FormData) {
  return ProjectSchema.safeParse({
    slug: formData.get("slug"),
    number: formData.get("number"),
    title: formData.get("title"),
    category: formData.get("category"),
    year: formData.get("year"),
    location: formData.get("location"),
    imageUrl: formData.get("imageUrl"),
    imageAlt: formData.get("imageAlt"),
    href: formData.get("href") || "#",
    order: formData.get("order") || "0",
    published: formData.get("published") === "on" ? true : false,
  });
}

function fieldErrors(parsed: ReturnType<typeof parseForm>) {
  if (parsed.success) return {};
  const out: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as string;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

function invalidate() {
  updateTag("projects");
  revalidatePath("/portfolio");
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "입력값을 확인해 주세요.",
      fieldErrors: fieldErrors(parsed),
    };
  }
  try {
    await db.project.create({ data: parsed.data });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique")) {
      return {
        ok: false,
        message: "이미 같은 slug를 가진 프로젝트가 있습니다.",
        fieldErrors: { slug: "중복된 slug" },
      };
    }
    console.error("[project] save failed", e);
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }
  invalidate();
  redirect("/admin/portfolio");
}

export async function updateProject(
  id: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "입력값을 확인해 주세요.",
      fieldErrors: fieldErrors(parsed),
    };
  }
  try {
    await db.project.update({ where: { id }, data: parsed.data });
  } catch (e) {
    console.error("[project] save failed", e);
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }
  invalidate();
  return { ok: true, message: "저장되었습니다." };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.project.delete({ where: { id } });
  invalidate();
  redirect("/admin/portfolio");
}
