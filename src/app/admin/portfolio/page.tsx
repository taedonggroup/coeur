import Link from "next/link";
import Image from "next/image";
import { getAllProjectsForAdmin } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  const projects = await getAllProjectsForAdmin();
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">포트폴리오</h1>
          <p className="text-white/55 text-sm mt-2">
            카드 추가·수정·삭제와 공개 여부, 순서를 관리합니다.
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/85 transition-colors"
        >
          + 새 프로젝트
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-white/40 py-12 border border-dashed border-white/15 rounded-sm text-center">
          아직 등록된 프로젝트가 없습니다.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/portfolio/${p.id}`}
                className="group block rounded-md overflow-hidden ring-1 ring-white/10 hover:ring-white/30 transition"
              >
                <div className="relative aspect-[4/3] bg-white/5">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.imageAlt || p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {!p.published && (
                      <span className="text-[10px] uppercase tracking-[0.05em] px-2 py-1 rounded-full bg-black/70 text-white/70 backdrop-blur">
                        비공개
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-[0.05em] px-2 py-1 rounded-full bg-black/70 text-white/70 backdrop-blur">
                      #{p.order}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xs tabular-nums text-white/40">
                      {p.number}
                    </p>
                    <p className="text-xs text-white/40">{p.year}</p>
                  </div>
                  <h2 className="font-display text-xl mt-1.5 text-white/90 group-hover:text-white transition-colors">
                    {p.title}
                  </h2>
                  <p className="text-xs text-white/50 mt-1">
                    {p.category} · {p.location}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
