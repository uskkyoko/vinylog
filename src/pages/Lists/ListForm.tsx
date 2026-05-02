import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { createList, updateList } from "../../store/listsSlice";
import { FormField } from "../../components/FormField";
import { Button } from "../../components/Button";
import { useAlbumSearch } from "../../hooks/useAlbumSearch";
import { FormError } from "../../components/FormError";
import type { AlbumOut, ListOut } from "../../types";
import { SearchResultItem } from "./SearchResultItem";
import { SelectedAlbumItem, type FormAlbum } from "./SelectedAlbumItem";

function albumFromOut(album: AlbumOut): FormAlbum {
  return {
    spotify_id: album.spotify_id,
    title: album.title,
    artist_name: album.artist?.name ?? "",
    cover_url: album.cover_url,
  };
}

interface Props {
  list?: ListOut; // edit mode when provided
}

export function ListForm({ list }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isEdit = list !== undefined;

  const [name, setName] = useState(list?.name ?? "");
  const [description, setDescription] = useState(list?.description ?? "");
  const [selected, setSelected] = useState<FormAlbum[]>(
    list?.albums.map(albumFromOut) ?? [],
  );
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { results } = useAlbumSearch(query);

  function addAlbum(result: FormAlbum) {
    if (selected.some((a) => a.spotify_id === result.spotify_id)) return;
    setSelected([...selected, result]);
    setQuery("");
  }

  function removeAlbum(spotifyId: string) {
    setSelected(selected.filter((a) => a.spotify_id !== spotifyId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter a list name.");
    setError(null);
    setLoading(true);
    try {
      if (isEdit) {
        const result = await dispatch(
          updateList({
            id: list.id,
            data: {
              name,
              description: description || null,
              album_ids: selected.map((album) => album.spotify_id),
            },
          }),
        );
        if (updateList.fulfilled.match(result)) {
          navigate(`/lists/${list.id}`);
        } else {
          setError(result.error.message ?? "Could not update list.");
        }
      } else {
        const result = await dispatch(
          createList({
            name,
            list_type: "custom",
            description: description || null,
          }),
        );
        if (createList.fulfilled.match(result)) {
          navigate(`/lists/${result.payload.id}`);
        } else {
          setError(result.error.message ?? "Could not create list.");
        }
      }
    } catch {
      setError(isEdit ? "Could not update list." : "Could not create list.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="list-form-page__form" onSubmit={handleSubmit}>
      <FormField
        label="List Name"
        htmlFor="name"
        className="list-form-page__field"
      >
        <input
          className="form-field__input"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name of your list"
          required
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        className="list-form-page__field"
      >
        <textarea
          className="form-field__textarea"
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this list about?"
        />
      </FormField>

      {isEdit && (
        <>
          <hr className="divider list-form-page__divider" />

          <FormField
            label="Add Albums"
            htmlFor="album-search"
            className="list-form-page__field"
          >
            <div className="list-form-page__search-wrapper">
              <input
                className="form-field__input"
                id="album-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search to add albums..."
                autoComplete="off"
              />
              {results.length > 0 && query && (
                <div className="list-form-page__results">
                  {results.map((album) => (
                    <SearchResultItem
                      key={album.id}
                      album={album}
                      alreadyAdded={selected.some((a) => a.spotify_id === album.id)}
                      onAdd={(a) =>
                        addAlbum({
                          spotify_id: a.id,
                          title: a.title,
                          artist_name: a.artist_name,
                          cover_url: a.cover_url,
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </FormField>

          <div className="list-form-page__selected-area">
            <p className="eyebrow list-form-page__selected-label">
              Selected Albums
            </p>
            <div className="list-form-page__selected-container">
              {selected.length === 0 ? (
                <div className="list-form-page__empty-msg">
                  No albums added yet.
                </div>
              ) : (
                selected.map((album) => (
                  <SelectedAlbumItem
                    key={album.spotify_id}
                    album={album}
                    onRemove={removeAlbum}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}

      <FormError message={error} />

      <div className="list-form-page__actions">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update List" : "Create List"}
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
