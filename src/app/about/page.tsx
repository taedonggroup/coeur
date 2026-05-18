import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Coeur는 프랑스어로 '마음의 중심'을 뜻합니다. 공간의 본질과 사람의 감정을 잇는 디자인 스튜디오입니다.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <header className="mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-5">
          About
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
          공간의 마음,
          <br />
          <span className="italic">Coeur.</span>
        </h1>
      </header>

      <div className="space-y-6 text-white/70 leading-relaxed text-lg">
        <p>
          Coeur는 프랑스어로 &lsquo;심장&rsquo; 또는 &lsquo;마음의 중심&rsquo;을
          뜻합니다. 우리는 공간이 단순한 물리적 구조가 아니라, 그 안에 머무는
          사람들의 시간과 감정을 담는 매개라고 믿습니다.
        </p>
        <p>
          주거·상업·호스피탤리티 영역에서 브랜드 정체성과 사용자 경험을 잇는
          공간을 디자인합니다. 디자인은 정직해야 하고, 정직한 디자인은 오래
          사랑받습니다.
        </p>
      </div>

      <section className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-white/10 pt-12">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
            서비스
          </p>
          <ul className="space-y-1.5 text-white/80">
            <li>공간 컨설팅</li>
            <li>인테리어 디자인</li>
            <li>브랜드 공간 기획</li>
            <li>리노베이션</li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
            영역
          </p>
          <ul className="space-y-1.5 text-white/80">
            <li>Residential · 주거</li>
            <li>Commercial · 상업</li>
            <li>Hospitality · F&amp;B</li>
            <li>Workplace · 오피스</li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
            스튜디오
          </p>
          <ul className="space-y-1.5 text-white/80">
            <li>Founded · 2026</li>
            <li>Based · Seoul</li>
            <li>Studio · Coeur</li>
          </ul>
        </div>
      </section>
    </article>
  );
}
