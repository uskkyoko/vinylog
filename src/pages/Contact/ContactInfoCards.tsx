/**
 * Grid of static info cards (General, Technical, Privacy, Response Time).
 * No state; all data is hard-coded content, not fetched.
 */
export function ContactInfoCards() {
  return (
    <div className="contact-page__info">
      <div className="contact-page__info-card">
        <h2>General Inquiries</h2>
        <p>
          For general questions about Vinylog, our features, or how to use the
          platform, please reach out to us.
        </p>
        <p className="contact-page__email">
          <strong>Email:</strong>{" "}
          <a href="mailto:support@vinylog.com">support@vinylog.com</a>
        </p>
      </div>

      <div className="contact-page__info-card">
        <h2>Technical Support</h2>
        <p>
          Experiencing technical issues or bugs? Our support team is here to
          help.
        </p>
        <p className="contact-page__email">
          <strong>Email:</strong>{" "}
          <a href="mailto:tech@vinylog.com">tech@vinylog.com</a>
        </p>
      </div>

      <div className="contact-page__info-card">
        <h2>Privacy &amp; Legal</h2>
        <p>
          Questions about privacy, data protection, or legal matters? We're
          here to assist.
        </p>
        <p className="contact-page__email">
          <strong>Email:</strong>{" "}
          <a href="mailto:privacy@vinylog.com">privacy@vinylog.com</a>
        </p>
      </div>

      <div className="contact-page__info-card">
        <h2>Response Time</h2>
        <p>
          We typically respond to inquiries within 24–48 hours during business
          days. For urgent matters, please mark your email as urgent.
        </p>
      </div>
    </div>
  );
}
