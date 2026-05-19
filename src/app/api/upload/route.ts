import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token, process.env.SESSION_SECRET ?? "");
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN 미설정" },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file 필드가 필요합니다." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "이미지 용량은 최대 8MB까지 가능합니다." },
      { status: 413 }
    );
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "지원하지 않는 이미지 형식입니다." },
      { status: 415 }
    );
  }

  // MIME → 확장자 강제 매핑 (사용자 제공 확장자 무시, .php.jpg 우회 차단)
  const EXT_BY_MIME: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };
  const ext = EXT_BY_MIME[file.type] ?? "bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(`uploads/${safeName}`, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
