import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "./logout/actions";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/content", label: "콘텐츠" },
  { href: "/admin/portfolio", label: "포트폴리오" },
  { href: "/admin/inquiries", label: "문의" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-md bg-black/60">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-display text-xl tracking-wide">
              coeur · admin
            </Link>
            <nav className="hidden sm:flex gap-6 text-sm">
              {navItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="text-white/65 hover:text-white transition-colors"
                >
                  {it.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-white/55 hover:text-white transition-colors"
            >
              사이트 열기 ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs text-white/55 hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
        <nav className="sm:hidden border-t border-white/10 px-6 py-3 flex gap-5 text-xs overflow-x-auto">
          {navItems.map((it) => (
            <Link key={it.href} href={it.href} className="text-white/65 hover:text-white whitespace-nowrap">
              {it.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">{children}</main>
    </div>
  );
}
