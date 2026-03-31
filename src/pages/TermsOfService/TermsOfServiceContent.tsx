/**
 * Body sections for the Terms of Service page.
 * No state; static legal text.
 */
export function TermsOfServiceContent() {
  return (
    <div className="legal-page__content">
      <section className="legal-page__section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Vinylog, you accept and agree to be bound by
          the terms and provision of this agreement. If you do not agree to
          these terms, please do not use our service.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use Vinylog for personal,
          non-commercial use only. This is the grant of a license, not a
          transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>
            Use the materials for any commercial purpose or for any public
            display
          </li>
          <li>
            Attempt to reverse engineer any software contained on Vinylog
          </li>
          <li>
            Remove any copyright or other proprietary notations from the
            materials
          </li>
        </ul>
      </section>

      <section className="legal-page__section">
        <h2>3. User Accounts</h2>
        <p>
          To access certain features of our service, you must register for an
          account. You agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and update your information to keep it accurate</li>
          <li>Maintain the security of your password</li>
          <li>
            Accept all responsibility for activities that occur under your
            account
          </li>
          <li>
            Notify us immediately of any unauthorized use of your account
          </li>
        </ul>
      </section>

      <section className="legal-page__section">
        <h2>4. User Content</h2>
        <p>
          You retain ownership of any content you post on Vinylog. By posting
          content, you grant us a worldwide, non-exclusive, royalty-free license
          to use, reproduce, and distribute your content on our platform.
        </p>
        <p>You agree not to post content that:</p>
        <ul>
          <li>Is illegal, harmful, or violates any laws</li>
          <li>Infringes on the rights of others</li>
          <li>Contains hate speech, harassment, or discrimination</li>
          <li>Is spam, misleading, or fraudulent</li>
          <li>Contains viruses or malicious code</li>
        </ul>
      </section>

      <section className="legal-page__section">
        <h2>5. Intellectual Property</h2>
        <p>
          The service and its original content, features, and functionality are
          owned by Vinylog and are protected by international copyright,
          trademark, patent, trade secret, and other intellectual property laws.
        </p>
        <p>
          Album artwork and music metadata are provided by third-party services
          (e.g., Spotify) and are subject to their respective terms and
          copyrights.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>6. Prohibited Uses</h2>
        <p>You may not use our service:</p>
        <ul>
          <li>In any way that violates any applicable law or regulation</li>
          <li>To transmit any malicious code or viruses</li>
          <li>To collect or track personal information of others</li>
          <li>To spam, phish, or engage in any fraudulent activity</li>
          <li>To interfere with or disrupt the service</li>
          <li>To impersonate any person or entity</li>
        </ul>
      </section>

      <section className="legal-page__section">
        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend your account and access to the service
          immediately, without prior notice, for conduct that we believe
          violates these Terms of Service or is harmful to other users, us, or
          third parties.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>8. Disclaimer</h2>
        <p>
          The information on this service is provided on an "as is" basis. To
          the fullest extent permitted by law, Vinylog excludes all
          representations, warranties, and conditions relating to our service
          and the use of this service.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>9. Limitation of Liability</h2>
        <p>
          In no event shall Vinylog, nor its directors, employees, or agents,
          be liable to you for anything arising out of or in any way connected
          with your use of this service, whether such liability is under
          contract, tort, or otherwise.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right to revise these terms at any time. By continuing
          to use the service after changes are posted, you agree to be bound by
          the revised terms.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>11. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact
          us through our <a href="/contact">Contact page</a>.
        </p>
      </section>
    </div>
  );
}
