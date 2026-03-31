/**
 * Terms of Service page shell — composes the header and body content sections.
 * No state; all content is static legal text.
 */
import "./TermsOfService.css";
import { AppLayout } from "../../components/AppLayout";
import { TermsOfServiceHeader } from "./TermsOfServiceHeader";
import { TermsOfServiceContent } from "./TermsOfServiceContent";

export default function TermsOfService() {
  return (
    <AppLayout>
      <section className="legal-page">
        <div className="container">
          <TermsOfServiceHeader />
          <TermsOfServiceContent />
        </div>
      </section>
    </AppLayout>
  );
}
