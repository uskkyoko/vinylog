/**
 * Contact page shell — composes the header, info cards, and form.
 * No state here; all state lives inside ContactForm.
 */
import "./Contact.css";
import { AppLayout } from "../../components/AppLayout";
import { ContactHeader } from "./ContactHeader";
import { ContactInfoCards } from "./ContactInfoCards";
import { ContactForm } from "./ContactForm";

export default function Contact() {
  return (
    <AppLayout>
      <section className="contact-page">
        <div className="container">
          <ContactHeader />
          <div className="contact-page__content">
            <div className="contact-page__grid">
              <ContactInfoCards />
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
