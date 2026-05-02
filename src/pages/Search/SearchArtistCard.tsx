import { useArtistSync } from "../../hooks/useArtistSync";
import type { SpotifyArtistResult } from "../../types";

export function SearchArtistCard({ artist }: { artist: SpotifyArtistResult }) {
  const { syncAndNavigate, loading } = useArtistSync();

  return (
    <button
      className="search-results__artist-card"
      onClick={() => syncAndNavigate(artist.spotify_id)}
      disabled={loading}
    >
      {artist.image_url ? (
        <img
          src={artist.image_url}
          alt={artist.name}
          className="search-results__artist-image"
        />
      ) : (
        <div className="search-results__artist-placeholder">
          <span className="search-results__artist-placeholder-text">
            {artist.name[0]}
          </span>
        </div>
      )}
      <span className="search-results__artist-name">{artist.name}</span>
    </button>
  );
}
