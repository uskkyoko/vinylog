/**
 * Interactive contact form with local form state.
 *
 * State is intentionally local (not Redux) because this data is
 * ephemeral: it exists only until the user submits, and is never
 * shared with other parts of the app.
 *
 * On submit, shows ContactFormSuccess in place of the form fields.
 */
import { useState } from "react";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { ContactFormSuccess } from "./ContactFormSuccess";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="contact-page__form-card">
        <ContactFormSuccess />
      </div>
    );
  }

  return (
    <div className="contact-page__form-card">
      <h2>Send us a Message</h2>
      <form className="contact-page__form" onSubmit={handleSubmit}>
        <FormField label="Name" htmlFor="name">
          <input
            type="text"
            id="name"
            className="form-field__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Email" htmlFor="email">
          <input
            type="email"
            id="email"
            className="form-field__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Subject" htmlFor="subject">
          <select
            id="subject"
            className="form-field__input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="technical">Technical Support</option>
            <option value="privacy">Privacy &amp; Legal</option>
            <option value="feature">Feature Request</option>
            <option value="bug">Report a Bug</option>
            <option value="other">Other</option>
          </select>
        </FormField>

        <FormField label="Message" htmlFor="message">
          <textarea
            id="message"
            className="form-field__textarea"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </FormField>

        <Button type="submit" variant="primary">
          Send Message
        </Button>
      </form>
    </div>
  );
}
