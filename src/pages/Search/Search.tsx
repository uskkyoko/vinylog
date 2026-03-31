import { useSearchParams } from "react-router-dom";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { FormError } from "../../components/FormError";
import { useSearch } from "../../hooks/useSearch";
import { SearchIntro } from "./SearchIntro";
import { SearchEmpty } from "./SearchEmpty";
import { SearchArtistsSection } from "./SearchArtistsSection";
import { SearchAlbumsSection } from "./SearchAlbumsSection";
import { SearchUsersSection } from "./SearchUsersSection";
import { SearchListsSection } from "./SearchListsSection";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const { data: results, loading, error } = useSearch(query);

  const hasResults =
    results.artists.length > 0 ||
    results.albums.length > 0 ||
    results.users.length > 0 ||
    results.lists.length > 0;

  if (loading) return <PageLoading />;

  return (
    <AppLayout>
      <section className="search-results">
        <div className="container search-results__container">
          <SearchIntro query={query} />
          {/** Uses the shared error component for consistent styling across the app. */}
          <FormError message={error} />
          {hasResults ? (
            <>
              <SearchArtistsSection artists={results.artists} />
              <SearchAlbumsSection albums={results.albums} />
              <SearchUsersSection users={results.users} />
              <SearchListsSection lists={results.lists} />
            </>
          ) : (
            query && <SearchEmpty query={query} />
          )}
        </div>
      </section>
    </AppLayout>
  );
}
