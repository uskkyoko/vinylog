import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useAuth } from "../../context/useAuth";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { saveFavouriteAlbums } from "../../store/usersSlice";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { AvatarUpload } from "./AvatarUpload";
import { FavouriteAlbumsField, type FavAlbum } from "./FavouriteAlbumsField";
import type { AlbumSearchResult, UserOut } from "../../types";

function toFavAlbum(result: AlbumSearchResult): FavAlbum {
  return {
    spotify_id: result.id,
    title: result.title,
    artist_name: result.artist_name,
    cover_url: result.image,
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [selectedAlbums, setSelectedAlbums] = useState<FavAlbum[]>(
    favouriteAlbums.map(userFavToFavAlbum),
  );

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
    let avatarFilename = user.profile_picture;
    if (avatarFile) {
      const { profile_picture } = await api.uploadAvatar(avatarFile);
      avatarFilename = profile_picture;
    }
    const [updatedUser] = await Promise.all([
      api.updateUser({
        full_name: fullName,
        biography: biography || null,
        birth_date: birthDate,
        profile_picture: avatarFilename,
      }),
      dispatch(saveFavouriteAlbums(selectedAlbums.map((a) => a.spotify_id))),
    ]);
    updateCurrentUser(updatedUser);
    navigate("/profile");
  }

  /**
   * Renders only the form fields and submission logic.
   * The page shell (section, card, eyebrow, title) is owned by Settings.tsx
   * via FormPageShell — keeping SettingsForm focused on a single responsibility.
   */
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

          <AvatarUpload onFileChange={setAvatarFile} />

          <FavouriteAlbumsField
            selected={selectedAlbums}
            onAdd={addAlbum}
            onRemove={removeAlbum}
            atMax={atMax}
          />

          <hr className="divider" />

          <div className="settings__actions">
            <div>
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
                navigate("/login");
              }}
            >
              Log Out
            </Button>
          </div>
    </form>
  );
}
