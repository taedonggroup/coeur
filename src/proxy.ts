import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// AI 검색엔진 크롤러 감지 → 대시보드 수집구로 보고 (AEO 봇 크롤링 추적)
const AI_BOTS: { re: RegExp; label: string }[] = [
  { re: /GPTBot|OAI-SearchBot|ChatGPT-User/i, label: "ChatGPT" },
  { re: /ClaudeBot|Claude-Web|anthropic-ai/i, label: "Claude" },
  { re: /PerplexityBot/i, label: "Perplexity" },
  { re: /Google-Extended/i, label: "Gemini" },
  { re: /CCBot/i, label: "CommonCrawl" },
  { re: /Bytespider|Amazonbot|cohere-ai|YouBot|Applebot-Extended|Meta-ExternalAgent/i, label: "Other" },
];
const TRACK = "https://dashboard-beta-eight-76.vercel.app/api/track";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // AI 봇 크롤링 감지 (실패해도 무시 — 사이트엔 영향 없음)
  const ua = req.headers.get("user-agent") || "";
  const bot = AI_BOTS.find((b) => b.re.test(ua));
  if (bot) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 1500);
      await fetch(`${TRACK}?site=coeur&bot=${bot.label}`, {
        signal: ctrl.signal,
      }).catch(() => {});
      clearTimeout(t);
    } catch {}
  }

  // /admin/* (단, /admin/login 제외) 인증 필요 — 기존 로직
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(
      token,
      process.env.SESSION_SECRET ?? ""
    );
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      if (pathname !== "/admin") url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
