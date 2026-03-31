/**
 * Features section for the About page.
 * No state; static list.
 */
export function AboutFeatures() {
  return (
    <div className="about__section">
      <h2 className="about__section-title">Features</h2>
      <ul className="about__list">
        <li>Browse and search albums and artists</li>
        <li>Write and manage album reviews with star ratings</li>
        <li>Curate personal album lists</li>
        <li>Follow other users and explore their profiles</li>
        <li>AI-powered album recommendations</li>
      </ul>
    </div>
  );
}
