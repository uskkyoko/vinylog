import type { AlbumOut } from "../types";

export function AlbumPreviews({ albums }: { albums: AlbumOut[] }) {
  const albumCount = albums?.length ?? 0;
  if (albumCount === 0) {
    return (
      <div className="list-card__previews list-card__previews--empty">
        <span className="list-card__empty-text">No albums yet</span>
      </div>
    );
  }
  return (
    <>
      <div className="list-card__previews">
        {albums.slice(0, 4).map((album) => (
          <div key={album.id} className="list-card__preview-item">
            <img
              src={album.cover_url ?? ""}
              alt={album.title}
              className="list-card__preview-image"
            />
          </div>
        ))}
        {albumCount > 4 && (
          <div className="list-card__preview-more list-card__preview-more--desktop">
            <span className="list-card__preview-more-text">+{albumCount - 4}</span>
          </div>
        )}
        {albumCount > 3 && (
          <div className="list-card__preview-more list-card__preview-more--mobile">
            <span className="list-card__preview-more-text">+{albumCount - 3}</span>
          </div>
        )}
      </div>
      <p className="list-card__album-count">
        {albumCount} album{albumCount !== 1 ? "s" : ""}
      </p>
    </>
  );
}
