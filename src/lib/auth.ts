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
