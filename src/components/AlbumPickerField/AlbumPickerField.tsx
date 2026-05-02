import "./AlbumPickerField.css";
import { useState } from "react";
import { useAlbumSearch } from "../../hooks/useAlbumSearch";
import { Button } from "../Button";
import { AlbumPickerResultItem } from "./AlbumPickerResultItem";
import type { AlbumSearchResult } from "../../types";

interface Props {
  value: AlbumSearchResult | null;
  onChange: (album: AlbumSearchResult | null) => void;
}

export function AlbumPickerField({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const { results } = useAlbumSearch(query);

  function selectAlbum(album: AlbumSearchResult) {
    onChange(album);
    setQuery("");
  }

  if (value) {
    return (
      <div className="album-picker__selected">
        {value.cover_url && (
          <img
            src={value.cover_url}
            alt={value.title}
            className="album-picker__thumb"
          />
        )}
        <span className="album-picker__selected-title">
          {value.title} — {value.artist_name}
        </span>
        <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className="album-picker">
      <input
        className="form-field__input"
        type="text"
        id="album-search"
        placeholder="Search albums..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && results.length > 0 && (
        <div className="album-picker__results">
          {results.map((result) => (
            <AlbumPickerResultItem
              key={result.id}
              album={result}
              onSelect={selectAlbum}
            />
          ))}
        </div>
      )}
    </div>
  );
}
