import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPageContent, getProjects } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPageContent("portfolio");
  return { title: p.eyebrow, description: p.subtitle };
}

export default async function PortfolioPage() {
  const [content, projects] = await Promise.all([
    getPageContent("portfolio"),
    getProjects(),
  ]);

  return (
    <article className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <header className="mb-14 sm:mb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-5">
          {content.eyebrow}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
            {content.heading1} <span className="font-display">{content.heading2}</span>
          </h1>
          <p className="text-base text-white/65 max-w-sm leading-relaxed">{content.subtitle}</p>
        </div>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-14 sm:gap-y-20">
        {projects.map((p, i) => (
          <li key={p.id} className={i % 2 === 1 ? "sm:mt-16" : ""}>
            <Link href={p.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white/[0.04] ring-1 ring-white/[0.06]">
                <Image
                  src={p.imageUrl}
                  alt={p.imageAlt || p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="pointer-events-none absolute left-5 bottom-5 right-5 flex items-end justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                    {p.category}
                  </span>
                  <span className="text-[10px] tabular-nums text-white/60">
                    {p.year}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs tabular-nums text-white/35">{p.number}</p>
                  <h2 className="font-display text-2xl sm:text-[1.7rem] leading-tight mt-1 transition-colors group-hover:text-white text-white/90">
                    {p.title}
                  </h2>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-white/40">{p.location}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-20 text-sm text-white/40">{content.footnote}</p>
    </article>
  );
}
