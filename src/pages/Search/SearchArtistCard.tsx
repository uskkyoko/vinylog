/**
 * Clickable card for a single Spotify artist result.
 *
 * On click, calls api.getSpotifyArtist() to sync the artist into the DB
 * (creates the artist record if it doesn't exist yet), then navigates to
 * the artist detail page using the returned numeric DB id.
 *
 * Loading state prevents double-clicks during the sync request.
 * No state is stored globally — this is a one-shot navigation action.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { api } from "../../api";
import type { SpotifyArtistResult } from "../../types";

export function SearchArtistCard({ artist }: { artist: SpotifyArtistResult }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const result = await api.getSpotifyArtist(artist.spotify_id);
      const data = result as { id: number };
      navigate(`/artists/${data.id}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      className="search-results__artist-card"
      onClick={handleClick}
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
      <h3 className="search-results__artist-name">{artist.name}</h3>
    </Button>
  );
}
