import type { RecommendResponse } from "../../types";
import { Button, ButtonLink } from "../../components/Button";

interface RecommendResultProps {
  result: RecommendResponse;
  onReset: () => void;
}

export function RecommendResult({ result, onReset }: RecommendResultProps) {
  const prompt = result.original_prompt?.trim();

  return (
    <div className="recommend-result">
      <div className="recommend-result__cover-wrap">
        <div className="recommend-result__glow" />
        {result.cover_url ? (
          <img
            src={result.cover_url}
            alt={`${result.album_title} cover`}
            className="recommend-result__cover"
          />
        ) : (
          <div className="recommend-result__cover recommend-result__cover--placeholder">
            No cover
          </div>
        )}
      </div>

      <div className="recommend-result__meta">
        {prompt && (
          <p className="recommend-result__prompt">"{prompt}"</p>
        )}
        <h2 className="recommend-result__album">{result.album_title}</h2>
        <p className="recommend-result__artist">{result.artist_name}</p>
      </div>

      <blockquote className="recommend-result__reason">{result.reason}</blockquote>

      <div className="recommend-result__actions">
        {(result.spotify_id ?? result.album_id) && (
          <ButtonLink
            to={`/albums/${result.spotify_id ?? result.album_id}`}
            variant="primary"
          >
            See album
          </ButtonLink>
        )}
        <Button variant="ghost" onClick={onReset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
