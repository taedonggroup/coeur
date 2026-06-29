import { HomeHero } from "@/components/HomeHero";
import { getPageContent } from "@/lib/content";

export default async function Home() {
  const home = await getPageContent("home");
  return (
    <>
      {/* 손글씨 로고 애니메이션이 빈 화면을 그리지 않도록 logo.png를 선로딩.
          (이미지가 늦게 떠서 로고가 "툭" 나타나는 팝인 방지 — 2026-06 검토) */}
      <link rel="preload" as="image" href="/logo.png" fetchPriority="high" />
      <HomeHero content={home} />
    </>
  );
}
