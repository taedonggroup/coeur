import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export async function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const hit = AI_BOTS.find((b) => b.re.test(ua));
  if (hit) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 1500);
      await fetch(`${TRACK}?site=coeur&bot=${hit.label}`, { signal: ctrl.signal }).catch(() => {});
      clearTimeout(t);
    } catch {}
  }
  return NextResponse.next();
}

export const config = {
  // 페이지 경로에서만 (정적파일·이미지 제외)
  matcher: "/((?!_next/static|_next/image|favicon.ico|.*\\.).*)",
};
