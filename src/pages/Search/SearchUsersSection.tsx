import type { UserSearchResult } from "../../types";
import { SearchResultsSection } from "./SearchResultsSection";
import { SearchUserCard } from "./SearchUserCard";

export function SearchUsersSection({ users }: { users: UserSearchResult[] }) {
  if (users.length === 0) return null;
  return (
    <SearchResultsSection title="Community Members" gridClass="search-grid--circles">
      {users.map((user) => (
        <SearchUserCard key={user.username} user={user} />
      ))}
    </SearchResultsSection>
  );
}
