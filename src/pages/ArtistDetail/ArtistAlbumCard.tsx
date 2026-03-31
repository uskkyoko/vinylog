/**
 * Card for a single album in the artist's discography grid.
 *
 * Receives an ArtistAlbumSummary from ArtistDetailAlbums and renders
 * the cover (or a placeholder), title, year, and optional average rating.
 *
 * Data flow: props in only — no state, no callbacks.
 * Navigation is handled by the wrapping <Link> element.
 */
import { Link } from "react-router-dom";
import type { ArtistAlbumSummary } from "../../types";

export function ArtistAlbumCard({ album }: { album: ArtistAlbumSummary }) {
  return (
    <Link
      to={`/albums/${album.spotify_id}`}
      className="artist-albums__item"
    >
      <div className="artist-albums__item-image-wrapper">
        {album.cover_url ? (
          <img
            src={album.cover_url}
            alt={album.title}
            className="artist-albums__item-image"
          />
        ) : (
          <div className="artist-albums__item-image artist-albums__item-image--placeholder" />
        )}
      </div>
      <div className="artist-albums__item-info">
        <p className="artist-albums__item-title">{album.title}</p>
        <p className="artist-albums__item-year">
          {album.release_date?.slice(0, 4)}
        </p>
        {album.average_rating != null && (
          <p className="artist-albums__item-rating">
            ★ {album.average_rating.toFixed(1)}
          </p>
        )}
      </div>
    </Link>
  );
}
