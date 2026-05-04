import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useAuth } from "../../context/useAuth";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { saveFavouriteAlbums } from "../../store/usersSlice";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { FavouriteAlbumsField, type FavAlbum } from "./FavouriteAlbumsField";
import type { AlbumSearchResult, UserOut } from "../../types";

function toFavAlbum(result: AlbumSearchResult): FavAlbum {
  return {
    spotify_id: result.id,
    title: result.title,
    artist_name: result.artist_name,
    cover_url: result.cover_url,
  };
}

function userFavToFavAlbum(
  album: UserOut["favourite_albums"][number],
): FavAlbum {
  return {
    spotify_id: album.spotify_id,
    title: album.title,
    artist_name: album.artist?.name ?? "",
    cover_url: album.cover_url,
  };
}

export function SettingsForm({ user }: { user: UserOut }) {
  const navigate = useNavigate();
  const { updateCurrentUser, logout } = useAuth();
  const dispatch = useAppDispatch();
  const favouriteAlbums = useAppSelector(
    (state) => state.users.favouriteAlbums,
  );
  const [fullName, setFullName] = useState(user.full_name);
  const [biography, setBiography] = useState(user.biography ?? "");
  const [birthDate, setBirthDate] = useState(user.birth_date);
  const [selectedAlbums, setSelectedAlbums] = useState<FavAlbum[]>(
    favouriteAlbums.map(userFavToFavAlbum),
  );

  const [saveError, setSaveError] = useState<string | null>(null);
  const atMax = selectedAlbums.length >= 4;

  function addAlbum(result: AlbumSearchResult) {
    if (atMax) return;
    if (selectedAlbums.some((a) => a.spotify_id === result.id)) return;
    setSelectedAlbums((prev) => [...prev, toFavAlbum(result)]);
  }

  function removeAlbum(spotifyId: string) {
    setSelectedAlbums((prev) => prev.filter((a) => a.spotify_id !== spotifyId));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveError(null);
    try {
      const [updatedUser, albumsAction] = await Promise.all([
        api.updateUser({
          full_name: fullName,
          biography: biography || null,
          birth_date: birthDate,
        }),
        dispatch(saveFavouriteAlbums(selectedAlbums.map((a) => a.spotify_id))),
      ]);
      if (saveFavouriteAlbums.rejected.match(albumsAction)) {
        setSaveError("Failed to save favourite albums. Please try again.");
        return;
      }
      if (
        saveFavouriteAlbums.fulfilled.match(albumsAction) &&
        selectedAlbums.length > 0 &&
        albumsAction.payload.length === 0
      ) {
        setSaveError(
          "Albums could not be saved — they may not be available in the library yet.",
        );
        return;
      }
      updateCurrentUser(updatedUser);
      navigate("/profile");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes.",
      );
    }
  }

  return (
    <form className="settings__form" onSubmit={handleSubmit}>
      <FormField
        label="Full Name"
        htmlFor="full-name"
        className="settings__field"
      >
        <input
          className="form-field__input"
          type="text"
          id="full-name"
          name="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Biography"
        htmlFor="biography"
        className="settings__field"
      >
        <textarea
          className="form-field__textarea"
          id="biography"
          name="biography"
          rows={4}
          placeholder="Tell us about yourself..."
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
        />
      </FormField>

      <FormField
        label="Birth Date"
        htmlFor="birth-date"
        className="settings__field"
      >
        <input
          className="form-field__input"
          type="date"
          id="birth-date"
          name="birth_date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </FormField>

      <FavouriteAlbumsField
        selected={selectedAlbums}
        onAdd={addAlbum}
        onRemove={removeAlbum}
        atMax={atMax}
      />

      <hr className="divider" />

      {saveError && <p className="settings__error">{saveError}</p>}

      <div className="settings__actions">
        <div className="settings__actions--buttons">
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            Cancel
          </Button>
        </div>
        <Button
          variant="danger"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Log Out
        </Button>
      </div>
    </form>
  );
}
