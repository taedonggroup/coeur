import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/app/admin/page";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = [
  { key: "ALL", label: "전체" },
  { key: "NEW", label: "신규" },
  { key: "READ", label: "읽음" },
  { key: "REPLIED", label: "회신 완료" },
  { key: "ARCHIVED", label: "보관" },
] as const;

export default async function InquiriesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = STATUS_FILTERS.find((f) => f.key === status) ?? STATUS_FILTERS[0];

  const inquiries = await db.inquiry.findMany({
    where:
      filter.key === "ALL"
        ? undefined
        : { status: filter.key as "NEW" | "READ" | "REPLIED" | "ARCHIVED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">문의</h1>
          <p className="text-white/55 text-sm mt-2">
            고객 문의를 확인하고 상태를 관리합니다.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((f) => {
          const active = f.key === filter.key;
          return (
            <Link
              key={f.key}
              href={f.key === "ALL" ? "/admin/inquiries" : `/admin/inquiries?status=${f.key}`}
              className={`text-xs uppercase tracking-[0.05em] px-3.5 py-2 rounded-full whitespace-nowrap transition-colors ${
                active
                  ? "bg-white text-black"
                  : "border border-white/15 text-white/70 hover:text-white hover:border-white/40"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {inquiries.length === 0 ? (
        <p className="text-sm text-white/40 py-14 border border-dashed border-white/15 rounded-sm text-center">
          해당 조건의 문의가 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {inquiries.map((q) => (
            <li key={q.id}>
              <Link
                href={`/admin/inquiries/${q.id}`}
                className="flex items-center gap-4 sm:gap-6 py-5 hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
              >
                <div className="hidden sm:flex flex-col items-center w-20 shrink-0">
                  <p className="text-xs text-white/40 tabular-nums">
                    {new Date(q.createdAt).toLocaleDateString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                  <p className="text-[10px] text-white/30 tabular-nums">
                    {new Date(q.createdAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <p className="text-base text-white/90 truncate">{q.name}</p>
                    <p className="text-xs text-white/40">{q.email}</p>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-1">
                    {q.category ? `[${q.category}] ` : ""}
                    {q.message}
                  </p>
                </div>
                <StatusBadge status={q.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs text-white/35">
        총 {inquiries.length}건
      </p>
    </div>
  );
}
