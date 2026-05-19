"use client";

import { useState, useTransition } from "react";
import {
  setStatus,
  saveNote,
  deleteInquiry,
} from "@/app/admin/inquiries/actions";

const STATUS_OPTIONS = [
  { key: "NEW", label: "신규" },
  { key: "READ", label: "읽음" },
  { key: "REPLIED", label: "회신 완료" },
  { key: "ARCHIVED", label: "보관" },
];

export function StatusControl({
  id,
  initial,
}: {
  id: string;
  initial: string;
}) {
  const [pending, start] = useTransition();
  const [current, setCurrent] = useState(initial);

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((s) => {
        const active = s.key === current;
        return (
          <button
            key={s.key}
            type="button"
            disabled={pending || active}
            onClick={() =>
              start(async () => {
                await setStatus(id, s.key);
                setCurrent(s.key);
              })
            }
            className={`text-xs uppercase tracking-[0.05em] px-3.5 py-2 rounded-full transition-colors ${
              active
                ? "bg-white text-black cursor-default"
                : "border border-white/15 text-white/70 hover:text-white hover:border-white/40 disabled:opacity-50"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export function NoteEditor({
  id,
  initial,
}: {
  id: string;
  initial: string | null;
}) {
  const [pending, start] = useTransition();
  const [value, setValue] = useState(initial ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        rows={4}
        placeholder="내부 메모 — 회신 내용, 처리 사항 등을 기록합니다."
        className="w-full bg-transparent border border-white/15 rounded-sm px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors resize-y"
      />
      <div className="flex items-center justify-end gap-3 mt-2">
        {saved && (
          <p className="text-xs text-emerald-300/85">메모 저장됨</p>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await saveNote(id, value.trim());
              setSaved(true);
            })
          }
          className="px-4 py-2 rounded-full border border-white/15 text-xs text-white/80 hover:text-white hover:border-white/40 transition-colors disabled:opacity-50"
        >
          {pending ? "저장 중…" : "메모 저장"}
        </button>
      </div>
    </div>
  );
}

export function DeleteInquiry({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
        start(async () => {
          await deleteInquiry(id);
        });
      }}
      className="text-xs text-red-300/80 hover:text-red-300 px-3 py-2 transition-colors"
    >
      문의 삭제
    </button>
  );
}
