import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Coeur 스튜디오와 함께할 프로젝트를 제안해 주세요. 1영업일 내 회신드립니다.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <header className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-5">
          Contact
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
          이야기를 <span className="italic">시작해볼까요.</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
            프로젝트 문의
          </p>
          <a
            href="mailto:hello@coeur.studio"
            className="font-display text-2xl sm:text-3xl hover:underline underline-offset-4 decoration-white/50"
          >
            hello@coeur.studio
          </a>
          <p className="mt-3 text-sm text-white/45 leading-relaxed">
            공간 기획·디자인·리노베이션 모두 환영합니다.
            <br />
            평균 1영업일 이내 회신드립니다.
          </p>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
            스튜디오
          </p>
          <p className="text-white/85 text-lg">Seoul · Korea</p>
          <p className="mt-2 text-sm text-white/45">
            방문 미팅은 사전 예약 후 가능합니다.
          </p>
        </section>
      </div>

      <section className="mt-16 border-t border-white/10 pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
          Social
        </p>
        <div className="flex gap-7 text-sm">
          <a href="#" className="text-white/70 hover:text-white transition-colors">
            Instagram
          </a>
          <a href="#" className="text-white/70 hover:text-white transition-colors">
            Behance
          </a>
        </div>
      </section>
    </article>
  );
}
