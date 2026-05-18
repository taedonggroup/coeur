"use client";

import { useActionState } from "react";
import { saveContent, type ContentSaveState } from "@/app/admin/content/actions";

type Field = {
  key: string;
  label: string;
  value: unknown;
  isArray: boolean;
};

const INITIAL: ContentSaveState = { ok: false, message: "" };

export function ContentEditor({
  page,
  fields,
}: {
  page: string;
  fields: Field[];
}) {
  const [state, action, pending] = useActionState(saveContent, INITIAL);
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="__page" value={page} />
      {fields.map((f) => (
        <FieldRow key={f.key} field={f} />
      ))}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
        {state.message && (
          <p
            className={`text-sm ${
              state.ok ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {state.message}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/85 transition-colors disabled:opacity-50"
        >
          {pending ? "저장 중…" : "저장"}
        </button>
      </div>
    </form>
  );
}

function FieldRow({ field }: { field: Field }) {
  const stringVal = field.isArray
    ? (field.value as string[]).join("\n")
    : String(field.value ?? "");
  const isLong = field.isArray || stringVal.length > 80;

  return (
    <div>
      <label
        htmlFor={field.key}
        className="block text-xs uppercase tracking-[0.2em] text-white/45 mb-2"
      >
        {field.label}
        {field.isArray && (
          <span className="ml-2 normal-case tracking-normal text-white/35 text-[10px]">
            (한 줄당 한 항목)
          </span>
        )}
      </label>
      {isLong ? (
        <textarea
          id={field.key}
          name={field.key}
          rows={field.isArray ? Math.max(3, (stringVal.match(/\n/g)?.length ?? 0) + 2) : 3}
          defaultValue={stringVal}
          className="w-full bg-transparent border border-white/15 rounded-sm px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors resize-y font-mono leading-relaxed"
        />
      ) : (
        <input
          id={field.key}
          name={field.key}
          defaultValue={stringVal}
          className="w-full bg-transparent border border-white/15 rounded-sm px-4 py-3 text-sm text-white/90 focus:border-white/50 focus:outline-none transition-colors"
        />
      )}
    </div>
  );
}
