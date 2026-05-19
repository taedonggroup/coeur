"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const SESSION_SECRET = process.env.SESSION_SECRET;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !SESSION_SECRET) {
    return {
      error:
        "서버에 ADMIN_USERNAME / ADMIN_PASSWORD / SESSION_SECRET 환경변수가 설정되지 않았습니다.",
    };
  }

  // 길이 다를 때 즉시 reject (timingSafeEqual은 같은 길이 요구). 같은 길이로 패딩 후 비교.
  const safeEq = (a: string, b: string) => {
    const A = Buffer.from(a);
    const B = Buffer.from(b);
    if (A.length !== B.length) {
      // 같은 길이 더미 버퍼와 비교해 시간 측정 차이 최소화
      timingSafeEqual(A, Buffer.alloc(A.length));
      return false;
    }
    return timingSafeEqual(A, B);
  };
  const userOk = safeEq(username, ADMIN_USERNAME);
  const passOk = safeEq(password, ADMIN_PASSWORD);
  if (!userOk || !passOk) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  const token = await createSessionToken(username, SESSION_SECRET);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // open redirect 방지: /admin 로 시작 + 외부 URL 차단
  const safeNext =
    /^\/admin(\/[\w\-\/\[\]]*)?$/.test(nextPath) ? nextPath : "/admin";
  redirect(safeNext);
}
