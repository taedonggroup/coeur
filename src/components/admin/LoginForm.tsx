"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const INITIAL: LoginState = {};

// 모양은 태동 통일 로그인(tl- 클래스, src/app/admin/login/login.css).
// 로그인 처리(login 액션 · 보내는 칸 이름 username/password/next · 오류 문구)는 그대로다.
export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, INITIAL);
  const [showPw, setShowPw] = useState(false);
  return (
    <form action={action} className="tl-form">
      <input type="hidden" name="next" value={next} />
      <div className="tl-field">
        <input
          id="admin-username"
          name="username"
          autoComplete="username"
          required
          autoFocus
          placeholder=" "
          className="tl-input"
        />
        <label htmlFor="admin-username" className="tl-label">
          아이디
        </label>
      </div>
      <div className="tl-field">
        <input
          id="admin-password"
          name="password"
          type={showPw ? "text" : "password"}
          autoComplete="current-password"
          required
          placeholder=" "
          className="tl-input tl-has-eye"
        />
        <label htmlFor="admin-password" className="tl-label">
          비밀번호
        </label>
        <button
          type="button"
          className="tl-eye"
          aria-controls="admin-password"
          aria-pressed={showPw}
          aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
          onClick={() => setShowPw((v) => !v)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            <path className="tl-eye-off" d="M4 4l16 16" />
          </svg>
        </button>
      </div>
      {state.error && (
        <p className="tl-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="tl-btn">
        {pending ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
