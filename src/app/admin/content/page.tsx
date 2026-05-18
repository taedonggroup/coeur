import Link from "next/link";

const PAGES = [
  { key: "site", label: "사이트 메타", desc: "사이트 제목·설명·푸터" },
  { key: "home", label: "홈", desc: "히어로 태그라인·CTA 버튼" },
  { key: "about", label: "About", desc: "소개 문구·서비스/영역/스튜디오" },
  { key: "portfolio", label: "포트폴리오 헤더", desc: "포트폴리오 페이지의 헤더 문구" },
  { key: "contact", label: "Contact", desc: "이메일·스튜디오 정보·폼 라벨" },
];

export default function ContentIndex() {
  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl mb-2">콘텐츠</h1>
      <p className="text-white/55 text-sm mb-10">
        페이지를 선택해 텍스트를 자유롭게 수정할 수 있습니다.
      </p>
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {PAGES.map((p) => (
          <li key={p.key}>
            <Link
              href={`/admin/content/${p.key}`}
              className="flex items-center justify-between py-5 hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
            >
              <div>
                <p className="text-base text-white/90">{p.label}</p>
                <p className="text-xs text-white/40 mt-1">{p.desc}</p>
              </div>
              <span className="text-white/40">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
