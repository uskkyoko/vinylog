import { HomePanel } from "./HomePanel";
import { HomeListItem } from "./HomeListItem";
import type { AlbumOut, ArtistOut, ListOut } from "../../types";

interface HomePanelsProps {
  featuredAlbums: AlbumOut[];
  trendingArtists: ArtistOut[];
  communityLists: ListOut[];
}

export function HomePanels({
  featuredAlbums,
  trendingArtists,
  communityLists,
}: HomePanelsProps) {
  return (
    <section className="home-panels">
      <div className="container">
        <div className="home-panels__grid">
          <HomePanel
            eyebrow="Spin Today"
            title="Featured Albums"
            isEmpty={featuredAlbums.length === 0}
            emptyMessage="No albums available yet."
          >
            {featuredAlbums.map((album) => (
              <HomeListItem
                key={album.id}
                primary={album.title}
                meta={`${album.artist?.name || "Unknown artist"}`}
                to={`/albums/${album.spotify_id}`}
              />
            ))}
          </HomePanel>

          <HomePanel
            eyebrow="On the Rise"
            title="Trending Artists"
            isEmpty={trendingArtists.length === 0}
            emptyMessage="No artists available yet."
          >
            {trendingArtists.map((artist) => (
              <HomeListItem
                key={artist.id}
                primary={artist.name}
                meta={artist.debut_date ? `Debut ${artist.debut_date}` : ""}
                to={`/artists/${artist.id}`}
              />
            ))}
          </HomePanel>

          <HomePanel
            eyebrow="Community Curated"
            title="Fresh Lists"
            isEmpty={communityLists.length === 0}
            emptyMessage="No lists have been created yet."
          >
            {communityLists.map((list) => (
              <HomeListItem
                key={list.id}
                primary={list.name}
                meta={`${list.user?.username || "Anonymous"} · ${list.albums?.length || 0} albums`}
                to={`/lists/${list.id}`}
                ctaText="View"
              />
            ))}
          </HomePanel>
        </div>
      </div>
    </section>
  );
}
