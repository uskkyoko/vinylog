import { Button } from "../Button";
import type { AlbumSearchResult } from "../../types";

export function AlbumPickerResultItem({
  album,
  onSelect,
}: {
  album: AlbumSearchResult;
  onSelect: (album: AlbumSearchResult) => void;
}) {
  return (
    <div className="album-picker__item">
      {album.cover_url && (
        <img src={album.cover_url} alt={album.title} />
      )}
      <span className="album-picker__item-title">
        {album.title} — {album.artist_name}
      </span>
      <Button variant="ghost" size="sm" onClick={() => onSelect(album)}>
        Select
      </Button>
    </div>
  );
}
