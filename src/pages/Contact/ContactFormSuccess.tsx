/**
 * Success message shown after the contact form is submitted.
 * No state; rendered by ContactForm when submitted === true.
 */
export function ContactFormSuccess() {
  return (
    <div className="contact-page__success">
      <p className="contact-page__success-title">Message sent!</p>
      <p>Thanks for reaching out. We'll get back to you within 24–48 hours.</p>
    </div>
  );
}
