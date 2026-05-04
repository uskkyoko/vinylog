import { Link } from "react-router-dom";
import { Button, ButtonLink } from "../Button";
import type { ReviewOut } from "../../types";

interface ReviewDetailCardProps {
  review: ReviewOut;
  isOwner: boolean;
  onDelete?: () => void;
}

export function ReviewDetailCard({
  review,
  isOwner,
  onDelete,
}: ReviewDetailCardProps) {
  return (
    <article className="review-view__card">
      <div className="review-view__layout">
        <div className="review-view__album">
          <Link
            to={`/albums/${review.album.spotify_id}`}
            className="review-view__album-link"
          >
            <img
              src={review.album.cover_url ?? ""}
              alt={review.album.title}
              className="review-view__album-cover"
            />
          </Link>
          <p className="eyebrow">Album</p>
          <h2 className="review-view__album-title">{review.album.title}</h2>
          {review.album.artist && (
            <p className="review-view__album-artist">
              <Link
                to={`/artists/${review.album.artist.id}`}
                className="review-view__album-artist"
              >
                {review.album.artist.name}
              </Link>
            </p>
          )}
        </div>

        <div className="review-view__content">
          <div className="review-view__meta">
            <div className="review-view__user">
              {review.user?.profile_picture && (
                <img
                  src={review.user.profile_picture}
                  alt={review.user.username}
                  className="review-view__avatar"
                />
              )}
              <div>
                <Link
                  to={`/profile/${review.user?.username}`}
                  className="review-view__username"
                >
                  {review.user?.username}
                </Link>
                <span className="review-view__date">
                  reviewed on{" "}
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div
              className="review-view__rating"
              aria-label={`Rating: ${review.rating} out of 5`}
            >
              <span className="review-view__rating-value">{review.rating}</span>
              <span className="review-view__rating-scale">/ 5</span>
            </div>
          </div>

          <div className="review-view__body">
            {review.comment ? (
              <p>{review.comment}</p>
            ) : (
              <p className="review-view__empty">
                <em>This review has no text commentary.</em>
              </p>
            )}
          </div>

          {review.favorite_song && (
            <div className="review-view__favorite-song">
              <p className="review-view__favorite-song-label">Favorite Track</p>
              <p className="review-view__favorite-song-name">
                {review.favorite_song}
              </p>
            </div>
          )}

          {isOwner && (
            <div className="review-view__actions">
              <ButtonLink
                to={`/reviews/${review.id}/edit`}
                variant="ghost"
                size="sm"
              >
                Edit Review
              </ButtonLink>
              <Button variant="danger" size="sm" onClick={onDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
