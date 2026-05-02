import { Button } from "../../components/Button";
import type { AlbumSearchResult } from "../../types";

export function SearchResultItem({
  album,
  alreadyAdded,
  onAdd,
}: {
  album: AlbumSearchResult;
  alreadyAdded: boolean;
  onAdd: (album: AlbumSearchResult) => void;
}) {
  return (
    <div className="list-form-page__search-item">
      {album.cover_url && (
        <img
          src={album.cover_url}
          alt={album.title}
          className="list-form-page__search-thumb"
          width={40}
          height={40}
        />
      )}
      <div className="list-form-page__search-info">
        <strong>{album.title}</strong>
        <span>{album.artist_name}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onAdd(album)}
        disabled={alreadyAdded}
      >
        {alreadyAdded ? "Added" : "Add"}
      </Button>
    </div>
  );
}
