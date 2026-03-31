/**
 * Full-screen loading overlay shown while the AI recommendation is being
 * generated. Displayed on top of the form — the form stays mounted
 * underneath so its state is preserved if the request fails.
 *
 * Data flow: receives the current rotating message as a prop from
 * RecommendForm, which owns the LOADING_MESSAGES cycle via useEffect + interval.
 * No state here; purely presentational.
 */

interface RecommendLoadingOverlayProps {
  message: string;
}

export function RecommendLoadingOverlay({
  message,
}: RecommendLoadingOverlayProps) {
  return (
    <div className="recommend-loading">
      <div className="recommend-loading__overlay" />
      <div className="recommend-loading__content">
        <div className="recommend-loading__spinner">
          <div className="recommend-loading__spinner-ring" />
          <div className="recommend-loading__spinner-ring" />
          <div className="recommend-loading__spinner-ring" />
        </div>
        <h2 className="recommend-loading__title">
          Finding your next favourite album…
        </h2>
        <p className="recommend-loading__text">{message}</p>
      </div>
    </div>
  );
}
