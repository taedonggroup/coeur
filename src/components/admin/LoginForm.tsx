"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const INITIAL: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, INITIAL);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
          아이디
        </label>
        <input
          name="username"
          autoComplete="username"
          required
          className="w-full bg-transparent border border-white/15 rounded-sm px-4 py-3 text-sm text-white/90 focus:border-white/60 focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
          비밀번호
        </label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full bg-transparent border border-white/15 rounded-sm px-4 py-3 text-sm text-white/90 focus:border-white/60 focus:outline-none transition-colors"
        />
      </div>
      {state.error && <p className="text-sm text-red-300">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full mt-2 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/85 transition-colors disabled:opacity-50"
      >
        {pending ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
