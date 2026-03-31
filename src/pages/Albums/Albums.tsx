import "./Albums.css";
import {
  useAlbums,
  useFeedAlbums,
  useTrendingAlbums,
} from "../../hooks/useAlbums";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { AlbumsIntro } from "./AlbumsIntro";
import { AlbumCarousel } from "./AlbumCarousel";

export default function Albums() {
  const { data: allAlbums, loading } = useAlbums();
  const { data: feedAlbums } = useFeedAlbums();
  const { data: trendingAlbums } = useTrendingAlbums();

  if (loading || !allAlbums) return <PageLoading />;

  return (
    <AppLayout>
      <section className="albums-page">
        <div className="container">
          <AlbumsIntro />
          <AlbumCarousel title="Popular with Friends" albums={feedAlbums} />
          <AlbumCarousel title="Popular" albums={trendingAlbums.popular} />
          <AlbumCarousel title="New Releases" albums={trendingAlbums.new_releases} />
          <AlbumCarousel title="Recommended" albums={allAlbums} />
        </div>
      </section>
    </AppLayout>
  );
}
