import type { ReactNode } from "react";

const GLOBAL_GRID_CLASSES = new Set(["grid--two", "grid--three", "grid--four"]);

export function SearchResultsSection({
  title,
  gridClass = "grid--four",
  children,
}: {
  title: string;
  gridClass?: string;
  children: ReactNode;
}) {
  // Global grid classes need the "grid" base; search-specific ones are self-contained.
  const className = GLOBAL_GRID_CLASSES.has(gridClass)
    ? `grid ${gridClass}`
    : gridClass;

  return (
    <section className="search-results__section">
      <h2 className="search-results__section-title">{title}</h2>
      <div className={className}>{children}</div>
    </section>
  );
}
