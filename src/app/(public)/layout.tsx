import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getPageContent } from "@/lib/content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getPageContent("site");
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer
        tagline={site.footerTagline}
        copyrightTemplate={site.copyright}
      />
    </>
  );
}
