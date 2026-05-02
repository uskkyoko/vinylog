import "./Albums.css";
import {
  useAlbums,
  useFeedAlbums,
  useTrendingAlbums,
} from "../../hooks/useAlbums";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { AlbumCarousel } from "./AlbumCarousel";

export default function Albums() {
  const { data: feedAlbums, loading: feedLoading } = useFeedAlbums();
  const { data: trendingAlbums, loading: trendingLoading } = useTrendingAlbums();
  const { data: allAlbums, loading: allLoading } = useAlbums();

  if (feedLoading || trendingLoading || allLoading) return <PageLoading />;

  return (
    <AppLayout>
      <section className="albums-page">
        <div className="container">
          <AlbumCarousel title="Popular" albums={feedAlbums} />
          <AlbumCarousel title="Trending" albums={allAlbums} />
          <AlbumCarousel
            title="New Releases"
            albums={trendingAlbums.new_releases}
          />
        </div>
      </section>
    </AppLayout>
  );
}
