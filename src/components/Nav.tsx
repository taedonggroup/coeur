"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

// 서버에서는 false, 클라이언트 하이드레이션 이후 true를 반환한다.
// 정적 prerender 시점의 usePathname()은 실제 경로를 반환하지 못해
// 서버(비활성)/클라이언트(활성) 렌더가 어긋나 하이드레이션이 깨지므로
// (React #418 → 트리 전체 하이드레이션 실패 → 히어로 로고 애니메이션 멈춤),
// active 스타일은 하이드레이션이 끝난 뒤에만 적용해 첫 렌더를 일치시킨다.
const noopSubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function Nav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-background/70 border-b border-white/5"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-white/90 hover:text-white transition-colors"
          aria-label="Coeur 홈"
        >
          coeur
        </Link>
        <nav className="flex gap-6 sm:gap-9 text-sm" aria-label="주 메뉴">
          {items.map(({ href, label }) => {
            const active =
              hydrated &&
              (href === "/" ? pathname === "/" : pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative transition-colors py-1",
                  active ? "text-white" : "text-white/55 hover:text-white",
                )}
              >
                {label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
