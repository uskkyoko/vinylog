/**
 * Tech stack section for the About page.
 * No state; static list.
 */
export function AboutStack() {
  return (
    <div className="about__section">
      <h2 className="about__section-title">Tech Stack</h2>
      <ul className="about__list">
        <li>React 18 + TypeScript + Vite</li>
        <li>Redux Toolkit — lists, reviews, favourites</li>
        <li>React Router DOM — client-side routing</li>
        <li>Custom FastAPI backend on Render</li>
        <li>Spotify API — album and artist data</li>
      </ul>
    </div>
  );
}
