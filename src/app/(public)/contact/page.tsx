import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageContent("contact");
  return { title: c.eyebrow, description: c.inquirySubtitle };
}

export default async function ContactPage() {
  const c = await getPageContent("contact");

  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <header className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-5">
          {c.eyebrow}
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
          {c.heading1} <span className="italic">{c.heading2}</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-14">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
            {c.inquiryLabel}
          </p>
          <a
            href={`mailto:${c.email}`}
            className="font-display text-2xl sm:text-3xl hover:underline underline-offset-4 decoration-white/50"
          >
            {c.email}
          </a>
          <p className="mt-3 text-sm text-white/45 leading-relaxed whitespace-pre-line">
            {c.inquirySubtitle}
          </p>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
            {c.studioLabel}
          </p>
          <p className="text-white/85 text-lg">{c.studioCity}</p>
          <p className="mt-2 text-sm text-white/45">{c.studioNote}</p>
        </section>
      </div>

      <section className="border-t border-white/10 pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
          문의 폼
        </p>
        <ContactForm
          labels={{
            name: c.formNameLabel,
            email: c.formEmailLabel,
            phone: c.formPhoneLabel,
            category: c.formCategoryLabel,
            message: c.formMessageLabel,
            submit: c.formSubmitLabel,
          }}
        />
      </section>

      <section className="mt-16 border-t border-white/10 pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          Social
        </p>
        <div className="flex gap-7 text-sm">
          <a
            href={c.socialInstagram}
            className="text-white/70 hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href={c.socialBehance}
            className="text-white/70 hover:text-white transition-colors"
          >
            Behance
          </a>
        </div>
      </section>
    </article>
  );
}
