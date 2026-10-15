import type { Metadata } from "next";
import { preload } from "react-dom";
import { LoginForm } from "@/components/admin/LoginForm";
import "./login.css";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

// 태동 통일 로그인 모양(2026-10-15) — 글꼴은 계정센터 공개 파일을 쓴다(login.css 의 @font-face 와 같은 주소).
const FONT_URL = "https://id.taedong.ai.kr/fonts/PretendardVariable.woff2";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  preload(FONT_URL, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <div className="tl-wrap">
      <div className="tl-box">
        <h1 className="tl-sr">Coeur 관리자 로그인</h1>
        {/* eslint-disable-next-line @next/next/no-img-element -- 글자 로고 SVG 한 장, 최적화 불필요 */}
        <img
          className="tl-logo"
          src="/brand/wordmark-navy.svg"
          alt="태동 TEDONG"
          width={196}
          height={40}
        />
        <p className="tl-service">Coeur 관리자</p>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
