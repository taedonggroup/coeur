"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { db } from "@/lib/db";

export type LoginState = { error?: string };

// Rate limit 정책: 15분 동안 같은 IP에서 실패 5회 → 추가 15분 잠금
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

async function checkRateLimit(ip: string): Promise<{ blocked: boolean; remaining: number }> {
  const since = new Date(Date.now() - WINDOW_MS);
  const recentFails = await db.loginAttempt.count({
    where: { ip, ok: false, attemptedAt: { gte: since } },
  });
  return {
    blocked: recentFails >= MAX_FAILURES,
    remaining: Math.max(0, MAX_FAILURES - recentFails),
  };
}

async function recordAttempt(ip: string, username: string, ok: boolean) {
  await db.loginAttempt.create({
    data: { ip, username, ok },
  });
}

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
      error: "서버에 ADMIN_USERNAME / ADMIN_PASSWORD / SESSION_SECRET 환경변수가 설정되지 않았습니다.",
    };
  }

  const ip = await getClientIp();

  // 1) IP 기반 rate limit
  const rate = await checkRateLimit(ip);
  if (rate.blocked) {
    await recordAttempt(ip, username, false);
    return {
      error: "로그인 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.",
    };
  }

  // 2) timing-safe 자격 비교
  const safeEq = (a: string, b: string) => {
    const A = Buffer.from(a);
    const B = Buffer.from(b);
    if (A.length !== B.length) {
      timingSafeEqual(A, Buffer.alloc(A.length));
      return false;
    }
    return timingSafeEqual(A, B);
  };
  const userOk = safeEq(username, ADMIN_USERNAME);
  const passOk = safeEq(password, ADMIN_PASSWORD);

  if (!userOk || !passOk) {
    await recordAttempt(ip, username, false);
    const left = rate.remaining - 1;
    return {
      error:
        left > 0
          ? `아이디 또는 비밀번호가 올바르지 않습니다. (남은 시도 ${left}회)`
          : "아이디 또는 비밀번호가 올바르지 않습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  // 3) 성공
  await recordAttempt(ip, username, true);
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
