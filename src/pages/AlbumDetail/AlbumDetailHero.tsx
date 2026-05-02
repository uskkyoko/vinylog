import type { AlbumOut } from "../../types";
import { ButtonLink } from "../../components/Button";
import { AddToListButton } from "./AddToListButton";

export function AlbumDetailHero({ album }: { album: AlbumOut }) {
  const releaseYear = album.release_date?.slice(0, 4);

  return (
    <div className="album-detail__hero">
      <div className="album-detail__cover-wrap">
        {album.cover_url ? (
          <img
            src={album.cover_url}
            alt={album.title}
            className="album-detail__cover"
          />
        ) : (
          <div className="album-detail__cover album-detail__cover--placeholder" />
        )}
      </div>
      <div className="album-detail__info">
        <p className="eyebrow">{album.artist?.name}</p>
        <h1 className="album-detail__title">{album.title}</h1>
        {releaseYear && <p className="album-detail__year">{releaseYear}</p>}
        <div className="album-detail__actions">
          <ButtonLink
            to={`/reviews/new?album_id=${album.spotify_id}&album_title=${encodeURIComponent(album.title)}&artist=${encodeURIComponent(album.artist?.name ?? "")}&image=${encodeURIComponent(album.cover_url ?? "")}`}
            variant="primary"
            size="sm"
          >
            Write a review
          </ButtonLink>
          <AddToListButton album={album} />
          {album.artist && (
            <ButtonLink
              to={`/artists/${album.artist.id}`}
              variant="ghost"
              size="sm"
            >
              View artist
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
