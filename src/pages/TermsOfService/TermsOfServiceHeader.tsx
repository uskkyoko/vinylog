/**
 * Header for the Terms of Service page.
 * No state; static title and last-updated date.
 */
export function TermsOfServiceHeader() {
  return (
    <header className="legal-page__header">
      <h1 className="legal-page__title">Terms of Service</h1>
      <p className="legal-page__updated">Last updated: January 2025</p>
    </header>
  );
}
