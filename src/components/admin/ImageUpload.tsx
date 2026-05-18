"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setPending(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "업로드 실패");
        }
        onChange(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setPending(false);
      }
    },
    [onChange]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void upload(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-md border-2 border-dashed cursor-pointer transition-colors overflow-hidden ${
          dragOver
            ? "border-white/70 bg-white/[0.04]"
            : "border-white/15 hover:border-white/30 bg-white/[0.02]"
        }`}
      >
        {value ? (
          <div className="relative aspect-[4/3]">
            <Image
              src={value}
              alt="업로드된 이미지"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-sm text-white/85">클릭 또는 드래그해 교체</p>
            </div>
          </div>
        ) : (
          <div className="aspect-[4/3] flex flex-col items-center justify-center p-8 text-center text-sm">
            <div className="text-white/60 mb-2">
              {pending ? "업로드 중…" : "이미지를 끌어다 놓거나 클릭"}
            </div>
            <p className="text-xs text-white/35">
              PNG · JPG · WebP · AVIF (최대 8MB)
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="또는 이미지 URL 직접 입력"
          className="flex-1 bg-transparent border border-white/15 rounded-sm px-3 py-2 text-xs text-white/75 placeholder:text-white/30 focus:border-white/40 focus:outline-none transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-white/45 hover:text-white/80 px-2"
          >
            지우기
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}
