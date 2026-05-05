import type { ReviewOut } from "../../types";
import { AlbumDetailReviewTile } from "./AlbumDetailReviewTile";

export function AlbumDetailReviews({ reviews }: { reviews: ReviewOut[] }) {
  return (
    <section className="album-detail__reviews">
      <h2 className="album-detail__reviews-title">
        Reviews{reviews.length > 0 && ` (${reviews.length})`}
      </h2>
      {reviews.length > 0 ? (
        <div className="album-detail__reviews-list">
          {reviews.map((review) => (
            <AlbumDetailReviewTile key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="album-detail__reviews-empty">No reviews yet.</p>
      )}
    </section>
  );
}
