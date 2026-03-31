/**
 * Hero section for the About page.
 * No state; purely presentational copy.
 */
export function AboutHero() {
  return (
    <div className="about__hero">
      <p className="eyebrow">The story</p>
      <h1 className="about__title">About Vinylog</h1>
      <p className="about__lead">
        Vinylog is a music discovery and review platform for people who care
        deeply about albums — not just tracks.
      </p>
    </div>
  );
}
