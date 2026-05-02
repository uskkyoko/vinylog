/**
 * Artists section of the search results page.
 *
 * Renders a grid of SearchArtistCard components. Each card triggers a
 * Spotify sync on click — that logic lives in SearchArtistCard, keeping
 * this section as a pure layout wrapper.
 */
import { SearchResultsSection } from "./SearchResultsSection";
import { SearchArtistCard } from "./SearchArtistCard";
import type { SpotifyArtistResult } from "../../types";

export function SearchArtistsSection({
  artists,
}: {
  artists: SpotifyArtistResult[];
}) {
  if (artists.length === 0) return null;

  return (
    <SearchResultsSection title="Artists" gridClass="search-grid--circles">
      {artists.map((artist) => (
        <SearchArtistCard key={artist.spotify_id} artist={artist} />
      ))}
    </SearchResultsSection>
  );
}
