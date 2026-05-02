import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useAuth } from "../../context/useAuth";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { FormError } from "../../components/FormError";
import { AuthShell } from "./AuthShell";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setLoading(true);
    try {
      await signup({
        full_name: fd.get("full_name") as string,
        username: fd.get("username") as string,
        email: fd.get("email") as string,
        password: fd.get("password") as string,
        birth_date: fd.get("birth_date") as string,
      });
      navigate("/");
    } catch {
      setError("Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell eyebrow="Join Vinylog" title="Sign Up">
      <form className="auth__form" onSubmit={handleSubmit}>
        <FormField label="Full Name" htmlFor="full_name">
          <input
            className="form-field__input"
            type="text"
            id="full_name"
            name="full_name"
            required
          />
        </FormField>
        <FormField label="Username" htmlFor="username">
          <input
            className="form-field__input"
            type="text"
            id="username"
            name="username"
            required
          />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <input
            className="form-field__input"
            type="email"
            id="email"
            name="email"
            required
          />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <input
            className="form-field__input"
            type="password"
            id="password"
            name="password"
            required
          />
        </FormField>
        <FormField label="Birth Date" htmlFor="birth_date">
          <input
            className="form-field__input"
            type="date"
            id="birth_date"
            name="birth_date"
            required
          />
        </FormField>
        <Button
          type="submit"
          variant="primary"
          className="auth__submit"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Sign Up"}
        </Button>
      </form>
      <FormError message={error} />
      <p className="auth__alt">
        Already have an account?{" "}
        <Link to="/login" className="auth__link">
          Log In
        </Link>
      </p>
    </AuthShell>
  );
}
