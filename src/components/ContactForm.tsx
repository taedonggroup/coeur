"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryFormState } from "@/app/(public)/contact/actions";

const INITIAL: InquiryFormState = { ok: false, message: "" };

type Props = {
  labels: {
    name: string;
    email: string;
    phone: string;
    category: string;
    message: string;
    submit: string;
  };
};

export function ContactForm({ labels }: Props) {
  const [state, action, pending] = useActionState(submitInquiry, INITIAL);

  if (state.ok) {
    return (
      <div className="rounded-md border border-white/15 bg-white/[0.03] p-8 text-center">
        <p className="font-display italic text-xl text-white/90">감사합니다.</p>
        <p className="mt-3 text-sm text-white/55 leading-relaxed">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {/* honeypot — bot 차단 */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          name="name"
          label={labels.name}
          error={state.fieldErrors?.name}
          required
        />
        <Field
          name="email"
          label={labels.email}
          type="email"
          error={state.fieldErrors?.email}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          name="phone"
          label={labels.phone}
          error={state.fieldErrors?.phone}
        />
        <SelectField
          name="category"
          label={labels.category}
          options={["주거", "상업", "F&B", "호스피탤리티", "오피스", "기타"]}
          error={state.fieldErrors?.category}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-[0.05em] text-white/40 mb-2"
        >
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full bg-transparent border border-white/15 rounded-md px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-white/60 focus:outline-none transition-colors resize-y"
          placeholder="공간 / 일정 / 예산 등을 자유롭게 적어 주세요."
        />
        {state.fieldErrors?.message && (
          <p className="mt-1.5 text-xs text-red-300">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-red-300/90">{state.message}</p>
      )}

      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-7 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "전송 중…" : labels.submit}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  error,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.05em] text-white/40 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full bg-transparent border border-white/15 rounded-md px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-white/60 focus:outline-none transition-colors"
      />
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  error,
}: {
  name: string;
  label: string;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.05em] text-white/40 mb-2"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full bg-transparent border border-white/15 rounded-md px-4 py-3 text-sm text-white/90 focus:border-white/60 focus:outline-none transition-colors appearance-none"
        defaultValue=""
      >
        <option value="" className="bg-black">
          선택해 주세요
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-black">
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}
