import type { ListSearchResult } from "../../types";
import { SearchResultsSection } from "./SearchResultsSection";
import { SearchListCard } from "./SearchListCard";

export function SearchListsSection({ lists }: { lists: ListSearchResult[] }) {
  if (lists.length === 0) return null;
  return (
    <SearchResultsSection title="Curated Lists" gridClass="grid--three">
      {lists.map((list) => (
        <SearchListCard key={list.id} list={list} />
      ))}
    </SearchResultsSection>
  );
}
