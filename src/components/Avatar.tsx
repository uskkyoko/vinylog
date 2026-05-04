import "./Avatar.css";

const PALETTE = ["rgb(0, 50, 7)", "#2b2b2b", "#013d00", "#373737"];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0][0] ?? "?").toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColor(name: string): string {
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}

export function Avatar({
  src,
  name,
  className = "",
}: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={name} className={className} />;
  }
  return (
    <div
      className={`avatar--initials ${className}`}
      style={{ background: getColor(name) }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
