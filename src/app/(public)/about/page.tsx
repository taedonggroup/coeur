import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import { DisplayText } from "@/components/DisplayText";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getPageContent("about");
  return {
    title: about.eyebrow,
    description: about.paragraphs[0]?.slice(0, 150),
  };
}

export default async function AboutPage() {
  const about = await getPageContent("about");
  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <header className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-5">
          {about.eyebrow}
        </p>
        <h1 className="font-display leading-[1.15] sm:leading-[1.05] tracking-tight">
          <DisplayText page="about" field="heading1" content={about} />
          <br />
          <DisplayText
            page="about"
            field="heading2"
            content={about}
            className="italic"
          />
        </h1>
      </header>

      <div className="space-y-6 text-white/70 leading-relaxed text-lg">
        {about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <section className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-white/10 pt-12">
        {[
          { label: "서비스", items: about.services },
          { label: "영역", items: about.areas },
          { label: "스튜디오", items: about.studio },
        ].map((col) => (
          <div key={col.label}>
            <p className="text-xs uppercase tracking-[0.05em] text-white/40 mb-3">
              {col.label}
            </p>
            <ul className="space-y-1.5 text-white/80">
              {col.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </article>
  );
}
