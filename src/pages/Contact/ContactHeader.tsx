/**
 * Static hero header for the Contact page.
 * No state; purely presentational.
 */
export function ContactHeader() {
  return (
    <header className="contact-page__header">
      <p className="eyebrow">Get in touch</p>
      <h1 className="contact-page__title">Contact Us</h1>
      <p className="contact-page__subtitle">
        Have a question, suggestion, or need support? We'd love to hear from
        you.
      </p>
    </header>
  );
}
