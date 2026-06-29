import { HomeHero } from "@/components/HomeHero";
import { getPageContent } from "@/lib/content";

export default async function Home() {
  const home = await getPageContent("home");
  // 로고 팝인 방지는 HandwritingLogo가 이미지 로드 완료 후 애니메이션을 시작하는
  // 방식으로 처리한다(preload 링크는 SVG <image>와 매칭이 안 돼 콘솔 경고가 나서 제거).
  return <HomeHero content={home} />;
}
