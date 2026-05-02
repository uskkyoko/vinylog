import { useParams } from "react-router-dom";
import "./ArtistDetail.css";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { PageNotFound } from "../../components/PageNotFound";
import { useArtistDetail } from "../../hooks/useArtistDetail";
import { ArtistDetailHero } from "./ArtistDetailHero";
import { ArtistDetailAlbums } from "./ArtistDetailAlbums";

export default function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const artistId = Number(id);

  const { data: artist, loading, error } = useArtistDetail(artistId);

  if (loading) return <PageLoading />;

  if (error || !artist) {
    return (
      <PageNotFound
        section="artist-details"
        containerClass="artist-details__container"
        message="Artist not found."
      />
    );
  }

  return (
    <AppLayout>
      <section className="artist-details">
        <div className="artist-details__container">
          <ArtistDetailHero artist={artist} />
          <ArtistDetailAlbums albums={artist.albums} />
        </div>
      </section>
    </AppLayout>
  );
}
