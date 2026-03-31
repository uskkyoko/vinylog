/**
 * Privacy Policy page shell — composes the header and body content sections.
 * No state; all content is static legal text.
 */
import "./PrivacyPolicy.css";
import { AppLayout } from "../../components/AppLayout";
import { PrivacyPolicyHeader } from "./PrivacyPolicyHeader";
import { PrivacyPolicyContent } from "./PrivacyPolicyContent";

export default function PrivacyPolicy() {
  return (
    <AppLayout>
      <section className="legal-page">
        <div className="container">
          <PrivacyPolicyHeader />
          <PrivacyPolicyContent />
        </div>
      </section>
    </AppLayout>
  );
}
