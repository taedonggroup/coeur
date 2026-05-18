import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-white mb-2">coeur · admin</h1>
        <p className="text-sm text-white/50 mb-10">
          관리자 계정으로 로그인해 주세요.
        </p>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
