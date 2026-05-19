"use server";

import { requireAdmin } from "@/lib/auth";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { InquiryStatus } from "@prisma/client";

const VALID: InquiryStatus[] = ["NEW", "READ", "REPLIED", "ARCHIVED"];

export async function setStatus(id: string, status: string) {
  await requireAdmin();
  if (!VALID.includes(status as InquiryStatus)) return;
  await db.inquiry.update({
    where: { id },
    data: { status: status as InquiryStatus },
  });
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin");
}

export async function saveNote(id: string, note: string) {
  await requireAdmin();
  await db.inquiry.update({
    where: { id },
    data: { adminNote: note || null },
  });
  revalidatePath(`/admin/inquiries/${id}`);
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  await db.inquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}
