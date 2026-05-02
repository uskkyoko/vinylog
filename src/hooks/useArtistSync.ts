import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export function useArtistSync() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function syncAndNavigate(spotifyId: string) {
    if (loading) return;
    setLoading(true);
    try {
      const result = (await api.getSpotifyArtist(spotifyId)) as { id: number };
      navigate(`/artists/${result.id}`);
    } catch {
      setLoading(false);
    }
  }

  return { syncAndNavigate, loading };
}
