import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedSlugs } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

// published 프로젝트를 빌드 시 정적 생성 (신규 프로젝트는 on-demand로 생성됨).
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Coeur" };
  const desc = [project.category, project.year, project.location]
    .filter(Boolean)
    .join(" · ");
  return {
    title: `${project.title} — Coeur`,
    description: desc,
    openGraph: {
      title: project.title,
      description: desc,
      images: project.imageUrl ? [{ url: project.imageUrl }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const meta = [project.category, project.year, project.location].filter(
    Boolean,
  );
  const hasExternal =
    project.href && project.href !== "#" && project.href.trim() !== "";

  return (
    <article className="mx-auto max-w-5xl px-6 pt-32 pb-24">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
      >
        <span aria-hidden>←</span> 포트폴리오
      </Link>

      <header className="mt-8 mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs tabular-nums text-white/35 mb-2">
            {project.number}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl leading-tight tracking-tight text-white/95">
            {project.title}
          </h1>
        </div>
        {meta.length > 0 && (
          <p className="text-xs uppercase tracking-[0.2em] text-white/55 whitespace-nowrap">
            {meta.join(" · ")}
          </p>
        )}
      </header>

      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-white/[0.04] ring-1 ring-white/[0.06]">
        <Image
          src={project.imageUrl}
          alt={project.imageAlt || project.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      {hasExternal && (
        <div className="mt-10">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/90 hover:border-white/50 hover:bg-white/5 transition-colors"
          >
            프로젝트 보기 <span aria-hidden>↗</span>
          </a>
        </div>
      )}

      <div className="mt-16 border-t border-white/10 pt-8">
        <Link
          href="/portfolio"
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          ← 다른 작업 보기
        </Link>
      </div>
    </article>
  );
}
