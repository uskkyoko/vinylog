/**
 * Shared layout shell for all single-form pages.
 *
 * Composes AppLayout with a centred card that carries an eyebrow label and
 * a page title. Every create/edit page (CreateReview, EditReview, CreateList,
 * EditList) renders this shell and passes its specific Form as children —
 * keeping each page to a single sentence: "show <Form> inside this shell".
 */
import type { ReactNode } from "react";
import { AppLayout } from "./AppLayout";
import "./FormPageShell.css";

interface FormPageShellProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export function FormPageShell({
  eyebrow,
  title,
  children,
}: FormPageShellProps) {
  return (
    <AppLayout>
      <section className="form-page">
        <div className="form-page__card">
          <div className="form-page__header">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="form-page__title">{title}</h1>
          </div>
          {children}
        </div>
      </section>
    </AppLayout>
  );
}
