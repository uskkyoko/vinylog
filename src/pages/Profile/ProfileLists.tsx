/**
 * Profile section showing the user's lists.
 *
 * Receives lists from the Profile page, which merges data from two sources:
 *   - isOwner: lists come from Redux (state.lists.items)
 *   - public profile: lists come from the API response via useProfileData()
 *
 * No local state; rendering only.
 */
import { ButtonLink } from "../../components/Button";
import { ProfileListCard } from "./ProfileListCard";
import type { ListOut } from "../../types";

export function ProfileLists({
  lists,
  isOwner = true,
}: {
  lists: ListOut[];
  isOwner?: boolean;
}) {
  return (
    <section className="profile-section">
      <header className="profile-section__header">
        <div>
          <p className="eyebrow">Lists Shelf</p>
          <h2 className="profile-section__title">Currently on rotation</h2>
        </div>
        {isOwner && (
          <ButtonLink to="/lists/new" variant="ghost" size="sm">
            Add list
          </ButtonLink>
        )}
      </header>
      <div className="profile-lists">
        {lists.length === 0 ? (
          <div className="profile-lists__empty">
            <p>No lists yet. Start curating!</p>
          </div>
        ) : (
          lists.map((list) => <ProfileListCard key={list.id} list={list} />)
        )}
      </div>
    </section>
  );
}
