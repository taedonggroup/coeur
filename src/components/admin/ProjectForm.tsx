"use client";

import { useActionState } from "react";
import {
  createProject,
  updateProject,
  deleteProject,
  type ProjectFormState,
} from "@/app/admin/portfolio/actions";
import { ImageUpload } from "./ImageUpload";
import { useState } from "react";

const INITIAL: ProjectFormState = { ok: false, message: "" };

export type ProjectInput = {
  id?: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  year: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  order: number;
  published: boolean;
};

export function ProjectForm({ initial }: { initial: ProjectInput }) {
  const isEdit = Boolean(initial.id);
  const action = isEdit
    ? updateProject.bind(null, initial.id!)
    : createProject;
  const [state, dispatch, pending] = useActionState(action, INITIAL);

  const [imageUrl, setImageUrl] = useState(initial.imageUrl);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          name="title"
          label="제목"
          defaultValue={initial.title}
          error={state.fieldErrors?.title}
          required
        />
        <Field
          name="slug"
          label="slug (영문, URL에 쓰일 식별자)"
          defaultValue={initial.slug}
          error={state.fieldErrors?.slug}
          placeholder="apartment-hannam"
          required
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <Field
          name="number"
          label="번호"
          defaultValue={initial.number}
          error={state.fieldErrors?.number}
          required
        />
        <Field
          name="category"
          label="분류"
          defaultValue={initial.category}
          error={state.fieldErrors?.category}
          required
        />
        <Field
          name="year"
          label="연도"
          defaultValue={initial.year}
          error={state.fieldErrors?.year}
          required
        />
        <Field
          name="location"
          label="지역"
          defaultValue={initial.location}
          error={state.fieldErrors?.location}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-5 items-start">
        <Field
          name="href"
          label="외부 링크 (없으면 # 그대로)"
          defaultValue={initial.href}
          placeholder="https://..."
        />
        <Field
          name="order"
          label="정렬 순서"
          type="number"
          defaultValue={String(initial.order)}
          error={state.fieldErrors?.order}
          required
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.05em] text-white/45 mb-2">
          이미지
        </label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} />
        <input type="hidden" name="imageUrl" value={imageUrl} />
        {state.fieldErrors?.imageUrl && (
          <p className="mt-1.5 text-xs text-red-300">
            {state.fieldErrors.imageUrl}
          </p>
        )}
      </div>

      <Field
        name="imageAlt"
        label="이미지 설명 (접근성/SEO용)"
        defaultValue={initial.imageAlt}
      />

      <label className="flex items-center gap-3 text-sm text-white/80 select-none">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial.published}
          className="w-4 h-4 accent-white"
        />
        공개 사이트에 노출
      </label>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
        {isEdit ? (
          <DeleteButton id={initial.id!} />
        ) : (
          <span />
        )}
        <div className="flex items-center gap-4">
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
            {pending ? "저장 중…" : isEdit ? "변경 저장" : "프로젝트 생성"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  required,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.05em] text-white/45 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border border-white/15 rounded-sm px-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
      />
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        if (!confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
        await deleteProject(id);
      }}
    >
      <button
        type="submit"
        className="text-xs text-red-300/80 hover:text-red-300 px-3 py-2 transition-colors"
      >
        삭제
      </button>
    </form>
  );
}
