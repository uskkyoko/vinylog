/**
 * Shared shell for all auth pages (Login, Signup, GoogleCallback).
 *
 * Auth pages intentionally do NOT use AppLayout — no nav or footer on login/signup.
 * AuthShell is the top-level wrapper for these pages, replacing the duplicated
 * <section className="auth"><div className="auth__card"> ... structure.
 *
 * Data flow: props in → renders the card wrapper and optional eyebrow/title,
 * then yields to children for page-specific content (form, OAuth button, etc).
 * No state; purely structural.
 */
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  /** Optional eyebrow label shown above the title. */
  eyebrow?: string;
  children: ReactNode;
}

export function AuthShell({ title, eyebrow, children }: AuthShellProps) {
  return (
    <section className="auth">
      <div className="auth__card">
        <div className="auth__header">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="auth__title">{title}</h1>
        </div>
        {children}
      </div>
    </section>
  );
}
