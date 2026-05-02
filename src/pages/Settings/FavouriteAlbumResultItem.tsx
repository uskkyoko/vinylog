import { Button } from "../../components/Button";
import type { AlbumSearchResult } from "../../types";

export function FavouriteAlbumResultItem({
  album,
  onAdd,
}: {
  album: AlbumSearchResult;
  onAdd: (album: AlbumSearchResult) => void;
}) {
  return (
    <div className="settings__search-item">
      {album.cover_url && (
        <img src={album.cover_url} width={50} alt={album.title} />
      )}
      <span className="settings__search-text">
        {album.title} — {album.artist_name}
      </span>
      <Button variant="ghost" size="sm" onClick={() => onAdd(album)}>
        Add
      </Button>
    </div>
  );
}
