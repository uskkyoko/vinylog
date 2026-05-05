import { Link } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import type { ReviewOut } from "../../types";

export function AlbumDetailReviewTile({ review }: { review: ReviewOut }) {
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link to={`/reviews/${review.id}`} className="album-detail__review-tile">
      <div className="album-detail__review-tile-header">
        <Avatar
          src={review.user?.profile_picture}
          name={review.user?.username ?? "?"}
          className="album-detail__review-tile-avatar"
        />
        <span className="album-detail__review-tile-author">
          @{review.user?.username ?? "user"}
        </span>
        <span className="album-detail__review-tile-rating">
          {review.rating} ★
        </span>
      </div>
      {review.comment && (
        <p className="album-detail__review-tile-comment">"{review.comment}"</p>
      )}
      <time className="album-detail__review-tile-date">{date}</time>
    </Link>
  );
}
