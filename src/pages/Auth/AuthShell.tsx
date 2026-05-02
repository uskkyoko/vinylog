import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
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
