import type { Metadata } from "next";
import Image from "next/image";
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
  location: string;
  image: string;
  alt: string;
  href: string;
};

// 임시 큐레이션 이미지(Unsplash, 공간 디자인 톤). 실제 작업물로 교체 예정.
const projects: Project[] = [
  {
    id: "01",
    title: "Apartment in Hannam",
    category: "Residential",
    year: "2026",
    location: "Seoul",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80&auto=format&fit=crop",
    alt: "Modern apartment living room with natural light",
    href: "#",
  },
  {
    id: "02",
    title: "Studio Cafe — Yongsan",
    category: "F&B",
    year: "2026",
    location: "Seoul",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80&auto=format&fit=crop",
    alt: "Minimal cafe interior with warm wood tones",
    href: "#",
  },
  {
    id: "03",
    title: "Showroom — Seongsu",
    category: "Commercial",
    year: "2025",
    location: "Seoul",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80&auto=format&fit=crop",
    alt: "Concrete commercial showroom space",
    href: "#",
  },
  {
    id: "04",
    title: "Stay — Jeju",
    category: "Hospitality",
    year: "2025",
    location: "Jeju",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80&auto=format&fit=crop",
    alt: "Quiet hotel bedroom overlooking nature",
    href: "#",
  },
];

export default function PortfolioPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <header className="mb-14 sm:mb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-5">
          Portfolio
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
            선택된 <span className="italic">작업들.</span>
          </h1>
          <p className="text-sm text-white/50 max-w-xs">
            주거·상업·호스피탤리티 영역에서 진행한 프로젝트.
          </p>
        </div>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-14 sm:gap-y-20">
        {projects.map((p, i) => (
          <li
            key={p.id}
            className={
              // 두 번째·네 번째 카드를 살짝 아래로 오프셋해 정적인 그리드를 깸
              i % 2 === 1 ? "sm:mt-16" : ""
            }
          >
            <Link href={p.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white/[0.04] ring-1 ring-white/[0.06]">
                <Image
                  src={p.image}
                  alt={p.alt}
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
                  <p className="text-xs tabular-nums text-white/35">{p.id}</p>
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

      <p className="mt-20 text-sm text-white/40">
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
