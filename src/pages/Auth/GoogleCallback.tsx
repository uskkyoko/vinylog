import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Auth.css";
import { useAuth } from "../../context/useAuth";
import { FormError } from "../../components/FormError";
import { AuthShell } from "./AuthShell";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    if (!code) {
      setError("No authorization code received from Google.");
      return;
    }

    loginWithGoogle(code)
      .then(() => navigate("/", { replace: true }))
      .catch(() => setError("Google sign-in failed. Please try again."));
  }, []);

  const title = error ? "Sign-in failed" : "Signing you in…";

  return (
    <AuthShell title={title}>
      <FormError message={error} />
    </AuthShell>
  );
}
