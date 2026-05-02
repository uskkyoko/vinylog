import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AlbumDetail.css";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { PageNotFound } from "../../components/PageNotFound";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../api";
import { AlbumDetailHero } from "./AlbumDetailHero";
import { AlbumDetailReviews } from "./AlbumDetailReviews";
import { AlbumSpotifyEmbed } from "./AlbumSpotifyEmbed";

const isNumericId = (id: string) => /^\d+$/.test(id);

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resolveError, setResolveError] = useState(false);

  // If the id looks like a spotify_id (non-numeric), resolve it to a DB id first
  useEffect(() => {
    if (!id || isNumericId(id)) return;
    api
      .getAlbumBySpotifyId(id)
      .then(({ id: numericId }) => navigate(`/albums/${numericId}`, { replace: true }))
      .catch(() => setResolveError(true));
  }, [id, navigate]);

  const numericId = id && isNumericId(id) ? Number(id) : null;

  const {
    data: album,
    loading,
    error,
  } = useFetch(
    () => (numericId != null ? api.getAlbumDetails(numericId) : Promise.resolve(null)),
    null,
    [numericId],
  );

  // Pre-sync artist albums in the background so they are ready before the user navigates to the artist page
  useEffect(() => {
    const artistId = album?.artist?.id;
    if (!artistId) return;
    api.getArtistsDetails(artistId).then((artist) => {
      if (artist.spotify_id && artist.albums.length === 0) {
        api.getSpotifyArtist(artist.spotify_id).catch(() => {});
      }
    }).catch(() => {});
  }, [album?.artist?.id]);

  if (resolveError) {
    return <PageNotFound section="album-detail" message="Album not found." />;
  }

  if (loading || numericId == null) return <PageLoading />;

  if (error || !album) {
    return <PageNotFound section="album-detail" message="Album not found." />;
  }

  return (
    <AppLayout>
      <section className="album-detail">
        <div className="container">
          <AlbumDetailHero album={album} />
          {album.spotify_id && <AlbumSpotifyEmbed spotifyId={album.spotify_id} />}
          <AlbumDetailReviews reviews={album.reviews} album={album} />
        </div>
      </section>
    </AppLayout>
  );
}
