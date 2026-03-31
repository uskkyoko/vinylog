/**
 * Album grid for the artist detail page.
 *
 * Receives the artist's albums and renders them as a grid of ArtistAlbumCards.
 * Each card is its own component — this component only owns the grid layout
 * and the empty state.
 */
import type { ArtistAlbumSummary } from "../../types";
import { ArtistAlbumCard } from "./ArtistAlbumCard";

export function ArtistDetailAlbums({
  albums,
}: {
  albums: ArtistAlbumSummary[];
}) {
  if (albums.length === 0) {
    return <p>No albums found for this artist yet.</p>;
  }

  return (
    <div className="artist-albums">
      <div className="artist-albums__header">
        <h2 className="artist-albums__title">Albums ({albums.length})</h2>
      </div>
      <div className="artist-albums__grid">
        {albums.map((album) => (
          <ArtistAlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
