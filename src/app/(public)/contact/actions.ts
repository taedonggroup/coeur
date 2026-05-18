"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const InquirySchema = z.object({
  name: z.string().trim().min(1, "성함을 입력해 주세요.").max(100),
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다.").max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  category: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(5, "내용을 5자 이상 적어 주세요.").max(5000),
  // 봇 차단용 hidden 필드 (사람은 비워둠)
  website: z.string().optional(),
});

export type InquiryFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "category" | "message", string>>;
};

export async function submitInquiry(
  _prev: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    category: String(formData.get("category") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  // honeypot — bot이 채운 hidden 필드면 성공처럼 응답하되 저장 안 함
  if (raw.website.trim().length > 0) {
    return { ok: true, message: "감사합니다." };
  }

  const parsed = InquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: InquiryFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof fieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      message: "입력 내용을 확인해 주세요.",
      fieldErrors,
    };
  }

  try {
    await db.inquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        category: parsed.data.category || null,
        message: parsed.data.message,
      },
    });
    revalidatePath("/admin/inquiries");
    return {
      ok: true,
      message: "문의가 정상적으로 전송되었습니다. 빠르게 회신드리겠습니다.",
    };
  } catch (error) {
    console.error("inquiry create failed", error);
    return {
      ok: false,
      message: "문의 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
