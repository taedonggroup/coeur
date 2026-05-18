import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Coeur가 작업한 공간들. 주거·상업·호스피탤리티 영역에서 진행한 선택된 프로젝트.",
};

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
};

const projects: Project[] = [
  { id: "01", title: "Apartment in Hannam", category: "Residential", year: "2026" },
  { id: "02", title: "Studio Cafe — Yongsan", category: "F&B", year: "2026" },
  { id: "03", title: "Showroom — Seongsu", category: "Commercial", year: "2025" },
  { id: "04", title: "Stay — Jeju", category: "Hospitality", year: "2025" },
];

export default function PortfolioPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <header className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-5">
          Portfolio
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
          선택된 <span className="italic">작업들.</span>
        </h1>
      </header>

      <ul className="border-y border-white/10 divide-y divide-white/10">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              href="#"
              className="group flex items-baseline justify-between gap-6 py-7 sm:py-9 transition-colors hover:bg-white/[0.02] -mx-6 px-6"
            >
              <div className="flex items-baseline gap-5 sm:gap-8 min-w-0">
                <span className="text-xs sm:text-sm text-white/30 tabular-nums shrink-0">
                  {p.id}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl truncate group-hover:translate-x-1 transition-transform">
                  {p.title}
                </h2>
              </div>
              <div className="hidden sm:flex shrink-0 gap-10 text-sm text-white/45">
                <span>{p.category}</span>
                <span className="tabular-nums">{p.year}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-14 text-sm text-white/40">
        새로운 작업들은 곧 공개됩니다. 협업 문의는{" "}
        <Link
          href="/contact"
          className="text-white/70 underline underline-offset-4 hover:text-white"
        >
          Contact
        </Link>
        에서.
      </p>
    </article>
  );
}
