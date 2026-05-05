import { Link } from "react-router-dom";
import type { ReviewOut } from "../../types";

export function ProfileReviewCard({ review }: { review: ReviewOut }) {
  const album = review.album;
  const title = album?.title ?? "Album unavailable";

  return (
    <Link to={`/reviews/${review.id}`} className="profile-reviews__tile">
      <div className="profile-reviews__tile-header">
        <p className="profile-reviews__tile-title">{title}</p>
        <span className="profile-reviews__tile-rating">{review.rating} ★</span>
      </div>
      <div className="profile-reviews__tile-preview">
        {album?.cover_url ? (
          <img
            src={album.cover_url}
            alt={album.title}
            className="profile-reviews__tile-cover"
          />
        ) : (
          <div className="profile-reviews__tile-cover profile-reviews__tile-cover--placeholder" />
        )}
      </div>
      {review.comment && (
        <p className="profile-reviews__tile-comment">"{review.comment}"</p>
      )}
    </Link>
  );
}
