import { HomeHero } from "@/components/HomeHero";
import { getPageContent } from "@/lib/content";

export default async function Home() {
  const home = await getPageContent("home");
  return <HomeHero content={home} />;
}
