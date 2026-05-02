import type { SpotifyAlbumResult } from "../../types";
import { SearchResultsSection } from "./SearchResultsSection";
import { AlbumCard } from "../../components/AlbumCard";

export function SearchAlbumsSection({
  albums,
}: {
  albums: SpotifyAlbumResult[];
}) {
  if (albums.length === 0) return null;
  return (
    <SearchResultsSection title="Albums" gridClass="search-grid--albums">
      {albums.map((album) => (
        <AlbumCard key={album.spotify_id} album={album} />
      ))}
    </SearchResultsSection>
  );
}
