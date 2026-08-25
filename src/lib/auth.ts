// Edge runtime 호환 HMAC-SHA256 세션 토큰.
// 미들웨어와 server action 양쪽에서 사용.

const COOKIE_NAME = "coeur_session";
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const SESSION_COOKIE = COOKIE_NAME;

function toBase64Url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toBase64Url(sig);
}

export type SessionPayload = { user: string; exp: number };

export async function createSessionToken(
  user: string,
  secret: string,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<string> {
  const payload: SessionPayload = { user, exp: Date.now() + ttlMs };
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await sign(body, secret);
  return `${body}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string
): Promise<SessionPayload | null> {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;
  const expected = await sign(body, secret);
  // constant-time compare (Edge runtime 호환)
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  if (diff !== 0) return null;
  try {
    const bytes = fromBase64Url(body);
    const payload = JSON.parse(
      new TextDecoder().decode(bytes)
    ) as SessionPayload;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Server Action 인증 가드. 미들웨어와 별개로 호출해야 한다 (미들웨어는 페이지 렌더만 막음).
export async function requireAdmin(): Promise<SessionPayload> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token, process.env.SESSION_SECRET ?? "");
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * 계정센터(id.taedong.ai.kr) 우선 검증 — 2026-08-25 관제 연동.
 * 고객 관리자 계정은 계정센터 명부(admins)에서 승인·정지한다.
 * ① GoTrue 비밀번호 검증 → ② 이 사이트(site_id)의 고객(kind=user) 계정인가 → ③ status=active 인가.
 * 이메일 형태가 아니거나 계정센터 자격이 아니면 false — 기존 ADMIN_USERNAME/PASSWORD(env) 검증이 이어 받는다.
 */
export async function verifyAccountCenter(
  id: string,
  password: string
): Promise<boolean> {
  const base = process.env.AC_AUTH_URL || "https://id.taedong.ai.kr";
  const anonKey = process.env.AC_ANON_KEY;
  const siteId = process.env.AC_SITE_ID;
  if (!anonKey || !siteId) return false;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(id)) return false;

  try {
    const tokenRes = await fetch(`${base}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: id, password })
    });
    if (!tokenRes.ok) {
      return false;
    }
    const { access_token: accessToken } = await tokenRes.json();
    if (!accessToken) return false;

    // JWT payload(base64url) 디코드 — Edge 런타임 호환(atob 기반)
    const parts = accessToken.split(".");
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const claims = JSON.parse(
      new TextDecoder().decode(Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)))
    );

    const kind =
      claims.acct_kind ?? (claims.user_role === "user" ? "user" : undefined);
    if (claims.acct_status && claims.acct_status !== "active") {
      return false;
    }

    // 전사 관리자(마스터)는 전 사이트 관리자 페이지 통과 — authgate allowed() 와 같은 규칙.
    //  2026-08-25 대표 지시 "마스터 계정으로 고객사 관리자페이지까지 접근".
    //  계정구조 v3: acct_kind=staff · acct_global=true · acct_role=admin · site_id=NULL.
    if (
      kind === "staff" &&
      claims.acct_global === true &&
      claims.acct_role === "admin"
    ) {
      return true;
    }
    // v2 옛 토큰 하위호환 — user_role=master 는 곧 전사 관리자.
    if (!claims.acct_kind && claims.user_role === "master") {
      return true;
    }

    if (kind !== "user") {
      return false; // 그 외 직원 계정은 고객 관리자 페이지에 못 들어간다
    }
    if (claims.site_id !== siteId) {
      return false; // 남의 사이트 계정 거부
    }

    const statusRes = await fetch(
      `${base}/rest/v1/admins?select=status&user_id=eq.${encodeURIComponent(String(claims.sub))}`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` } }
    );
    if (!statusRes.ok) {
      return false;
    }
    const rows = await statusRes.json();
    return (
      Array.isArray(rows) && rows.length > 0 && rows[0].status === "active"
    );
  } catch {
    return false; // 계정센터가 안 보여도 기존 로그인은 살아 있어야 한다
  }
}
