import { useState, useEffect, useRef } from "react";
import type { RecommendResponse } from "../../types";
import { useRecommend } from "../../hooks/useRecommend";
import { Button } from "../../components/Button";
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
  const { generate, loading, error } = useRecommend();
  const [messageIndex, setMessageIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!loading) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    const reset = setTimeout(() => setMessageIndex(0), 0);
    intervalRef.current = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => {
      clearTimeout(reset);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await generate(userInput.trim() || null);
      onResult(result);
    } catch {}
  }

  return (
    <>
      {loading && (
        <RecommendLoadingOverlay message={LOADING_MESSAGES[messageIndex]} />
      )}

      <div className="recommend-form">
        <header className="recommend-form__header">
          <p className="eyebrow">AI Powered</p>
          <h1 className="recommend-form__title">
            Discover your next favourite record
          </h1>
          <p className="recommend-form__lead">
            Describe a mood, era, or vibe — or leave blank and we'll pick based
            on your taste.
          </p>
        </header>

        <div className="recommend-form__card">
          {error && <p className="recommend-form__alert">{error}</p>}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <textarea
              className="recommend-form__textarea"
              rows={4}
              placeholder="e.g. something melancholic and cinematic, late night drives, early 2000s indie..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <small className="recommend-form__hint">
              Optional — leave blank to use your favourite albums
            </small>
            <Button
              type="submit"
              variant="ai"
              className="recommend-form__submit"
              disabled={loading}
            >
              Spin the AI Wheel
            </Button>
          </form>
          <p className="recommend-form__note">
            Powered by Claude AI · Results may vary
          </p>
        </div>
      </div>
    </>
  );
}
