import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [newInquiries, totalInquiries, totalProjects, latest] = await Promise.all([
    db.inquiry.count({ where: { status: "NEW" } }),
    db.inquiry.count(),
    db.project.count(),
    db.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        category: true,
        createdAt: true,
        status: true,
      },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl mb-2">대시보드</h1>
      <p className="text-white/55 text-sm mb-10">
        오늘도 좋은 하루입니다.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <Stat label="신규 문의" value={newInquiries} href="/admin/inquiries?status=NEW" highlight />
        <Stat label="전체 문의" value={totalInquiries} href="/admin/inquiries" />
        <Stat label="포트폴리오" value={totalProjects} href="/admin/portfolio" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-[0.2em] text-white/55">
            최근 문의
          </h2>
          <Link
            href="/admin/inquiries"
            className="text-xs text-white/55 hover:text-white"
          >
            전체 보기 →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="text-sm text-white/40 py-8 border border-dashed border-white/10 rounded-sm text-center">
            아직 들어온 문의가 없습니다.
          </p>
        ) : (
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {latest.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/admin/inquiries/${q.id}`}
                  className="flex items-baseline justify-between gap-4 py-4 hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white/85 truncate">{q.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {q.category ?? "분류 없음"} ·{" "}
                      {new Date(q.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <StatusBadge status={q.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  highlight = false,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md border p-5 transition-colors ${
        highlight
          ? "border-white/40 bg-white/[0.04] hover:border-white/60"
          : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</p>
      <p className="mt-2 font-display text-4xl tabular-nums">{value}</p>
    </Link>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    NEW: { label: "신규", cls: "bg-white/10 text-white" },
    READ: { label: "읽음", cls: "bg-white/5 text-white/60" },
    REPLIED: { label: "회신 완료", cls: "bg-emerald-500/15 text-emerald-200" },
    ARCHIVED: { label: "보관", cls: "bg-white/5 text-white/40" },
  };
  const m = map[status] ?? map.NEW;
  return (
    <span
      className={`text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full whitespace-nowrap ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
