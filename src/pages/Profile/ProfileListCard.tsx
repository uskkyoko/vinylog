/**
 * Card for a single list in the profile's lists section.
 *
 * Receives the list data from ProfileLists, which receives it from the
 * Profile page. The Profile page sources lists either from Redux
 * (state.lists.items when isOwner) or from the API response (public profile).
 */
import { ButtonLink } from "../../components/Button";
import { AlbumPreviews } from "../Lists/ListCard";
import type { ListOut } from "../../types";

export function ProfileListCard({ list }: { list: ListOut }) {
  return (
    <article className="profile-lists__card">
      <div>
        <p className="profile-lists__title">{list.name}</p>
        {list.description && (
          <p className="profile-lists__meta">{list.description}</p>
        )}
        <AlbumPreviews albums={list.albums} />
      </div>
      <ButtonLink to={`/lists/${list.id}`} variant="ghost" size="sm">
        View
      </ButtonLink>
    </article>
  );
}
