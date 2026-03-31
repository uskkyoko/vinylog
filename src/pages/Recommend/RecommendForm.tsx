/**
 * AI Recommendation form.
 *
 * State:
 *   userInput  — the mood description the user types (or empty for auto)
 *   loading    — true while the API request is in flight
 *   error      — last error message, cleared on each new submission
 *   messageIndex — cycles through LOADING_MESSAGES every 3s during loading
 *
 * Data flow: on submit → api.generateRecommendation() → calls onResult(result)
 * so the parent (Recommend page) can replace this form with RecommendResult.
 * The rotating message state stays here because it's tied to the loading cycle;
 * only the visual structure is delegated to RecommendLoadingOverlay.
 */
import { useState, useEffect, useRef } from "react";
import type { RecommendResponse } from "../../types";
import { api } from "../../api";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { RecommendLoadingOverlay } from "./RecommendLoadingOverlay";

const LOADING_MESSAGES = [
  "Tuning the AI...",
  "Digging through crates...",
  "Spinning the records...",
  "Finalizing recommendation...",
];

interface RecommendFormProps {
  onResult: (result: RecommendResponse) => void;
}

export function RecommendForm({ onResult }: RecommendFormProps) {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (loading) {
      setMessageIndex(0);
      intervalRef.current = setInterval(() => {
        setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.generateRecommendation({
        user_input: userInput.trim() || null,
      });
      onResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/** Overlay mounts on top of the form; form stays mounted so state survives a failed request. */}
      {loading && <RecommendLoadingOverlay message={LOADING_MESSAGES[messageIndex]} />}

      <div>
        <h1 className="recommend__title">AI Recommendation</h1>
        <p className="recommend__lead">Tell us what you're in the mood for, or leave it blank and we'll pick based on your taste.</p>
      </div>

      <div className="recommend__card">
        {error && <p className="recommend__alert">{error}</p>}
        <form className="recommend__form" onSubmit={handleSubmit}>
          <FormField label="What are you in the mood for?" htmlFor="user-input">
            <textarea
              id="user-input"
              className="form-field__input"
              rows={4}
              placeholder="e.g. something melancholic and cinematic, or leave blank to use your taste"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <small className="recommend__hint">Optional — leave blank to use your favourite albums</small>
          </FormField>
          <Button type="submit" variant="ai" className="recommend__submit" disabled={loading}>
            Spin the AI Wheel
          </Button>
        </form>
        <p className="recommend__note">Powered by AI · Results may vary</p>
      </div>
    </>
  );
}
