"use client";

import { useActionState } from "react";
import {
  saveContent,
  type ContentSaveState,
} from "@/app/admin/content/actions";
import { FONT_PX_MIN, FONT_PX_MAX } from "@/lib/display-fields";

type DisplayConfig = {
  defaultDesktopPx: number;
  defaultMobilePx: number;
  mobileText: string;
  fontDesktopPx: number | null;
  fontMobilePx: number | null;
};

type Field = {
  key: string;
  label: string;
  value: unknown;
  isArray: boolean;
  display?: DisplayConfig | null;
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
      {fields.map((f) =>
        f.display ? (
          <DisplayFieldCard key={f.key} field={f} display={f.display} />
        ) : (
          <FieldRow key={f.key} field={f} />
        ),
      )}
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

const labelCls = "block text-xs uppercase tracking-[0.05em] text-white/45 mb-2";
const inputCls =
  "w-full bg-transparent border border-white/15 rounded-sm px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors";

// 한 줄로 유지해야 하는 칸(링크/이메일) — 줄바꿈 시 링크가 깨지므로 textarea 금지.
const SINGLE_LINE_KEYS = new Set(["email", "socialInstagram", "socialBehance"]);
function isSingleLineField(key: string): boolean {
  return /href$/i.test(key) || SINGLE_LINE_KEYS.has(key);
}

// 내용 줄 수에 맞춰 textarea 높이(rows) 계산.
function rowsFor(value: string, isArray: boolean): number {
  const lines = (value.match(/\n/g)?.length ?? 0) + 1;
  return isArray ? Math.max(3, lines + 1) : Math.max(2, Math.min(8, lines + 1));
}

const hintCls = "ml-2 normal-case tracking-normal text-white/35 text-[10px]";

function FieldRow({ field }: { field: Field }) {
  const stringVal = field.isArray
    ? (field.value as string[]).join("\n")
    : String(field.value ?? "");
  const singleLine = !field.isArray && isSingleLineField(field.key);

  return (
    <div>
      <label htmlFor={field.key} className={labelCls}>
        {field.label}
        {field.isArray ? (
          <span className={hintCls}>(한 줄당 한 항목)</span>
        ) : !singleLine ? (
          <span className={hintCls}>(Enter로 줄바꿈)</span>
        ) : null}
      </label>
      {singleLine ? (
        <input
          id={field.key}
          name={field.key}
          defaultValue={stringVal}
          className={inputCls}
        />
      ) : (
        <textarea
          id={field.key}
          name={field.key}
          rows={rowsFor(stringVal, field.isArray)}
          defaultValue={stringVal}
          className={`${inputCls} resize-y leading-relaxed${
            field.isArray ? " font-mono" : ""
          }`}
        />
      )}
    </div>
  );
}

/**
 * 디스플레이 텍스트 카드 — 데스크톱 문구 / 모바일 문구(선택) / 데스크톱·모바일 글자 크기(px).
 * 폼 필드명: <key>(데스크톱 문구), __display.<key>.{mobileText,fontDesktopPx,fontMobilePx}
 */
function DisplayFieldCard({
  field,
  display,
}: {
  field: Field;
  display: DisplayConfig;
}) {
  const desktopText = String(field.value ?? "");

  return (
    <fieldset className="rounded-md border border-white/15 px-4 py-4 sm:px-5">
      <legend className="px-2 text-xs uppercase tracking-[0.05em] text-white/55">
        {field.label}
      </legend>

      <div className="space-y-4">
        <div>
          <label htmlFor={field.key} className={labelCls}>
            데스크톱 문구
            <span className={hintCls}>(Enter로 줄바꿈)</span>
          </label>
          <textarea
            id={field.key}
            name={field.key}
            rows={rowsFor(desktopText, false)}
            defaultValue={desktopText}
            className={`${inputCls} resize-y leading-relaxed`}
          />
        </div>

        <div>
          <label htmlFor={`${field.key}__mobile`} className={labelCls}>
            모바일 문구
            <span className={hintCls}>(비우면 데스크톱 문구 사용)</span>
          </label>
          <textarea
            id={`${field.key}__mobile`}
            name={`__display.${field.key}.mobileText`}
            rows={rowsFor(display.mobileText, false)}
            defaultValue={display.mobileText}
            placeholder={desktopText}
            className={`${inputCls} resize-y leading-relaxed`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PxInput
            id={`${field.key}__fd`}
            name={`__display.${field.key}.fontDesktopPx`}
            label="데스크톱 글자 크기"
            value={display.fontDesktopPx}
            placeholder={display.defaultDesktopPx}
          />
          <PxInput
            id={`${field.key}__fm`}
            name={`__display.${field.key}.fontMobilePx`}
            label="모바일 글자 크기"
            value={display.fontMobilePx}
            placeholder={display.defaultMobilePx}
          />
        </div>
        <p className="text-[10px] text-white/35">
          글자 크기는 비우면 기본값을 사용합니다. {FONT_PX_MIN}~{FONT_PX_MAX}px
          범위로 적용됩니다.
        </p>
      </div>
    </fieldset>
  );
}

function PxInput({
  id,
  name,
  label,
  value,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  value: number | null;
  placeholder: number;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="number"
          min={FONT_PX_MIN}
          max={FONT_PX_MAX}
          inputMode="numeric"
          defaultValue={value ?? ""}
          placeholder={String(placeholder)}
          className={`${inputCls} pr-10`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/35">
          px
        </span>
      </div>
    </div>
  );
}
