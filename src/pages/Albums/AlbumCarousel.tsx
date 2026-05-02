import { useRef } from "react";
import type { AlbumCardData } from "../../types";
import { AlbumCard } from "../../components/AlbumCard";
import { Button } from "../../components/Button";

export function AlbumCarousel({
  title,
  albums,
}: {
  title: string;
  albums: AlbumCardData[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "prev" | "next") {
    if (!viewportRef.current) return;
    const amount = viewportRef.current.clientWidth * (dir === "next" ? 1 : -1);
    viewportRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (albums.length === 0) return null;

  return (
    <div className="albums-page__section">
      <div className="albums-page__section-header">
        <h2 className="albums-page__section-title">{title}</h2>
        <div className="albums-carousel__controls">
          <Button
            className="albums-carousel__control"
            variant="ghost"
            size="sm"
            onClick={() => scroll("prev")}
          >
            ←
          </Button>
          <Button
            className="albums-carousel__control"
            variant="ghost"
            size="sm"
            onClick={() => scroll("next")}
          >
            →
          </Button>
        </div>
      </div>
      <div className="albums-carousel">
        <div className="albums-carousel__viewport" ref={viewportRef}>
          <div className="albums-carousel__track">
            {albums.map((album) => (
              <AlbumCard key={album.id ?? album.spotify_id} album={album} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
