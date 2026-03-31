import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "ai";
type Size = "sm" | "md";

function cls(variant: Variant, size?: Size) {
  return ["btn", `btn--${variant}`, size === "sm" ? "btn--sm" : ""].filter(Boolean).join(" ");
}

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  /** Forwarded to the underlying <button> for icon-only buttons without visible text. */
  "aria-label"?: string;
  children: ReactNode;
}

interface ButtonLinkProps {
  variant?: Variant;
  size?: Size;
  to: string;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size,
  type = "button",
  onClick,
  disabled,
  className,
  "aria-label": ariaLabel,
  children,
}: ButtonProps) {
  const combined = [cls(variant, size), className].filter(Boolean).join(" ");
  return (
    <button className={combined} type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size, to, className, children }: ButtonLinkProps) {
  const combined = [cls(variant, size), className].filter(Boolean).join(" ");
  return (
    <Link className={combined} to={to}>
      {children}
    </Link>
  );
}
