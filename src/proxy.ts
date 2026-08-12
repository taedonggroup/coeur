import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// AI 검색엔진 크롤러 감지 → 대시보드 수집구로 보고 (AEO 봇 크롤링 추적)
// kind: "answer" = 사용자 질문에 답하려고 지금 우리 글을 여는 것(의미 큼),
//       "crawl"  = 질문과 무관한 학습·색인용 수집. 대시보드가 이 둘을 나눠 보여준다.
// ※ seolin-website/middleware.ts 와 목록을 맞춰 유지할 것.
const AI_BOTS: { re: RegExp; label: string; kind: "answer" | "crawl" }[] = [
  { re: /ChatGPT-User/i, label: "ChatGPT", kind: "answer" },
  { re: /GPTBot|OAI-SearchBot/i, label: "ChatGPT", kind: "crawl" },
  { re: /Claude-User/i, label: "Claude", kind: "answer" },
  { re: /ClaudeBot|Claude-Web|Claude-SearchBot|anthropic-ai/i, label: "Claude", kind: "crawl" },
  { re: /Perplexity-User/i, label: "Perplexity", kind: "answer" },
  { re: /PerplexityBot/i, label: "Perplexity", kind: "crawl" },
  { re: /Google-Extended/i, label: "Gemini", kind: "crawl" },
  { re: /CCBot/i, label: "CommonCrawl", kind: "crawl" },
  { re: /Bytespider|TikTokSpider/i, label: "TikTok", kind: "crawl" },
  { re: /Amazonbot/i, label: "Amazon", kind: "crawl" },
  { re: /Applebot-Extended/i, label: "Apple", kind: "crawl" },
  { re: /meta-externalfetcher/i, label: "Meta", kind: "answer" },
  { re: /meta-externalagent|FacebookBot/i, label: "Meta", kind: "crawl" },
  { re: /cohere-ai|cohere-training-data-crawler/i, label: "Cohere", kind: "crawl" },
  { re: /YouBot/i, label: "Youcom", kind: "crawl" },
  { re: /MistralAI-User/i, label: "Mistral", kind: "answer" },
  { re: /DuckAssistBot/i, label: "DuckDuckGo", kind: "answer" },
];
const TRACK = "https://dash.taedong.ai.kr/api/track";
// 안내판·지도·아이콘 같은 비콘텐츠 방문은 신고하지 않는다 — 실제 글 읽기만 집계
const NON_CONTENT =
  /^\/(robots\.txt|sitemap|favicon|llms|\.well-known)|\.(xml|txt|ico|png|jpe?g|webp|gif|svg|css|js|map|woff2?|ttf)$/i;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // AI 봇 크롤링 감지 (실패해도 무시 — 사이트엔 영향 없음)
  const ua = req.headers.get("user-agent") || "";
  const bot = AI_BOTS.find((b) => b.re.test(ua));
  if (bot && !NON_CONTENT.test(pathname)) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 1500);
      // path: 어떤 글을 읽어갔는지 / ip: 명함 위조 검증용(대시보드가 공식 IP 대역과 대조)
      const path = encodeURIComponent(pathname);
      const ip = encodeURIComponent(
        (req.headers.get("x-forwarded-for") || "").split(",")[0].trim(),
      );
      await fetch(
        `${TRACK}?site=coeur&bot=${bot.label}&kind=${bot.kind}&path=${path}&ip=${ip}`,
        { signal: ctrl.signal },
      ).catch(() => {});
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
