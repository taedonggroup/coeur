import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  StatusControl,
  NoteEditor,
  DeleteInquiry,
} from "@/components/admin/InquiryDetail";


export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = await db.inquiry.findUnique({ where: { id } });
  if (!q) notFound();

  // 신규 문의를 처음 열면 자동으로 '읽음' 상태로 (재검증은 다음 navigation에서)
  if (q.status === "NEW") {
    await db.inquiry.update({ where: { id }, data: { status: "READ" } });
    q.status = "READ";
  }

  return (
    <div>
      <Link
        href="/admin/inquiries"
        className="text-xs text-white/55 hover:text-white"
      >
        ← 문의 목록
      </Link>

      <header className="mt-3 mb-8 flex items-start justify-between gap-5">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">{q.name}</h1>
          <p className="text-white/55 text-sm mt-2">
            <a
              href={`mailto:${q.email}`}
              className="text-white/80 hover:text-white underline-offset-4 hover:underline"
            >
              {q.email}
            </a>
            {q.phone && <span> · {q.phone}</span>}
            {q.category && <span> · {q.category}</span>}
          </p>
          <p className="text-xs text-white/40 mt-1.5">
            {new Date(q.createdAt).toLocaleString("ko-KR")}
          </p>
        </div>
        <DeleteInquiry id={q.id} />
      </header>

      <section className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-3">
          상태
        </p>
        <StatusControl id={q.id} initial={q.status} />
      </section>

      <section className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-3">
          문의 내용
        </p>
        <div className="rounded-sm border border-white/10 bg-white/[0.02] p-5 text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
          {q.message}
        </div>
      </section>

      <section className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-3">
          내부 메모
        </p>
        <NoteEditor id={q.id} initial={q.adminNote} />
      </section>

      <div className="border-t border-white/10 pt-6 flex flex-wrap gap-3 text-sm">
        <a
          href={`mailto:${q.email}?subject=Coeur — 문의에 회신드립니다`}
          className="px-5 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/85 transition-colors"
        >
          이메일로 회신하기 ↗
        </a>
      </div>
    </div>
  );
}
