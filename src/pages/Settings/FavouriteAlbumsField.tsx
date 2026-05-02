import { useState } from "react";
import { useAlbumSearch } from "../../hooks/useAlbumSearch";
import { Button } from "../../components/Button";
import { FavouriteAlbumResultItem } from "./FavouriteAlbumResultItem";
import type { AlbumSearchResult } from "../../types";

const MAX_FAVOURITES = 4;

export interface FavAlbum {
  spotify_id: string;
  title: string;
  artist_name: string;
  cover_url: string | null;
}

interface Props {
  selected: FavAlbum[];
  onAdd: (result: AlbumSearchResult) => void;
  onRemove: (spotifyId: string) => void;
  atMax: boolean;
}

export function FavouriteAlbumsField({ selected, onAdd, onRemove, atMax }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { results: searchResults } = useAlbumSearch(searchQuery);

  return (
    <div className="settings__favourites">
      <div className="settings__favourites-header">
        <label className="form-field__label" htmlFor="album-search">
          Favourite Albums (max {MAX_FAVOURITES})
        </label>
        <p className="settings__helper">
          Give a quick shout to the releases you live with.
        </p>
      </div>

      {!atMax && (
        <input
          className="form-field__input"
          type="text"
          id="album-search"
          placeholder="Search albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

      {atMax && (
        <p className="settings__limit-message">
          Maximum of {MAX_FAVOURITES} favourite albums selected. Remove one to
          search again.
        </p>
      )}

      {searchQuery && searchResults.length > 0 && (
        <div className="settings__results">
          {searchResults.map((result) => (
            <FavouriteAlbumResultItem
              key={result.id}
              album={result}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}

      <div className="settings__selected-list">
        {selected.map((album) => (
          <div key={album.spotify_id} className="settings__selected">
            {album.cover_url && (
              <img
                src={album.cover_url}
                width={40}
                className="settings__selected-cover"
                alt={album.title}
              />
            )}
            <span className="settings__selected-title">
              {album.title} — {album.artist_name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(album.spotify_id)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
