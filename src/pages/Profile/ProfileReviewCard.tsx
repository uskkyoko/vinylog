import { Link } from "react-router-dom";
import type { ReviewOut } from "../../types";

export function ProfileReviewCard({ review }: { review: ReviewOut }) {
  const album = review.album;
  if (!album) return null;

  return (
    <Link to={`/reviews/${review.id}`} className="profile-reviews__tile">
      <div className="profile-reviews__tile-header">
        <p className="profile-reviews__tile-title">{album.title}</p>
        <span className="profile-reviews__tile-rating">{review.rating} ★</span>
      </div>
      {album.cover_url && (
        <div className="profile-reviews__tile-preview">
          <img
            src={album.cover_url}
            alt={album.title}
            className="profile-reviews__tile-cover"
          />
        </div>
      )}
      {review.comment && (
        <p className="profile-reviews__tile-comment">"{review.comment}"</p>
      )}
    </Link>
  );
}
