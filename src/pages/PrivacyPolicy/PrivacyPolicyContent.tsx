/**
 * Body sections for the Privacy Policy page.
 * No state; static legal text.
 */
export function PrivacyPolicyContent() {
  return (
    <div className="legal-page__content">
      <section className="legal-page__section">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Vinylog. We respect your privacy and are committed to
          protecting your personal data. This privacy policy explains how we
          collect, use, and safeguard your information when you use our service.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>2. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
          <li>Account information (username, email address, password)</li>
          <li>Profile information (name, biography, profile picture)</li>
          <li>Content you create (reviews, lists, ratings)</li>
          <li>Interactions with other users (follows, comments)</li>
        </ul>
        <p>
          We also automatically collect certain information about your device
          and how you interact with our service, such as IP address, browser
          type, and usage patterns.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process your transactions and manage your account</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Monitor and analyze trends and usage</li>
          <li>Detect, prevent, and address technical issues</li>
        </ul>
      </section>

      <section className="legal-page__section">
        <h2>4. Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information. We may share your
          information only in the following circumstances:
        </p>
        <ul>
          <li>With your consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and safety</li>
          <li>With service providers who assist us in operating our platform</li>
        </ul>
      </section>

      <section className="legal-page__section">
        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal data against unauthorized access, alteration,
          disclosure, or destruction. However, no method of transmission over
          the Internet is 100% secure.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Request data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
      </section>

      <section className="legal-page__section">
        <h2>7. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on
          our service and hold certain information. You can instruct your
          browser to refuse all cookies or to indicate when a cookie is being
          sent.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>8. Children's Privacy</h2>
        <p>
          Our service is not intended for children under 13 years of age. We do
          not knowingly collect personal information from children under 13.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          through our <a href="/contact">Contact page</a>.
        </p>
      </section>
    </div>
  );
}
