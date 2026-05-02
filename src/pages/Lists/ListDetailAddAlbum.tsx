import { useState } from "react";
import { Button } from "../../components/Button";
import { useAppDispatch } from "../../hooks/hooks";
import { updateList } from "../../store/listsSlice";
import { useAlbumSearch } from "../../hooks/useAlbumSearch";
import { SearchResultItem } from "./SearchResultItem";
import type { ListOut, AlbumSearchResult } from "../../types";

export function ListDetailAddAlbum({
  list,
  onClose,
}: {
  list: ListOut;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const { results } = useAlbumSearch(query);

  const currentIds = new Set(list.albums.map((a) => a.spotify_id));

  async function handleAdd(album: AlbumSearchResult) {
    if (currentIds.has(album.id)) return;
    await dispatch(
      updateList({
        id: list.id,
        data: { album_ids: [...Array.from(currentIds), album.id] },
      }),
    );
    setQuery("");
  }

  return (
    <div className="list-add-album">
      <div className="list-add-album__bar">
        <input
          className="list-add-album__input"
          type="text"
          placeholder="Search albums to add..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onClose();
            setQuery("");
          }}
        >
          Cancel
        </Button>
      </div>
      {results.length > 0 && (
        <div className="list-form-page__results">
          {results.map((album) => (
            <SearchResultItem
              key={album.id}
              album={album}
              alreadyAdded={currentIds.has(album.id)}
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
