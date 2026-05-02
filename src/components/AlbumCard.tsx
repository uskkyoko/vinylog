import "./AlbumCard.css";
import { Link } from "react-router-dom";
import type { AlbumCardData } from "../types";

export function AlbumCard({ album }: { album: AlbumCardData }) {
  const artistName = album.artist?.name ?? album.artist_name;
  const to = `/albums/${album.spotify_id ?? album.id}`;
  const year = album.release_date?.slice(0, 4);

  return (
    <Link to={to} className="album-card">
      <div className="album-card__image-wrapper">
        {album.cover_url ? (
          <img
            src={album.cover_url}
            alt={album.title}
            className="album-card__cover"
          />
        ) : (
          <div className="album-card__cover album-card__cover--placeholder" />
        )}
      </div>
      <div className="album-card__info">
        <p className="album-card__title">{album.title}</p>
        {artistName && <p className="album-card__artist">{artistName}</p>}
        {year && <p className="album-card__year">{year}</p>}
      </div>
    </Link>
  );
}
