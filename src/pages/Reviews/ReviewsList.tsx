/**
 * Renders the owner's full list of reviews.
 *
 * Receives reviews and username from the Reviews page, which reads them
 * from the Redux store (state.reviews.items). No local state here —
 * the store is the single source of truth for the current user's reviews.
 */
import { ReviewCard } from "../../components/ReviewCard/ReviewCard";
import type { ReviewOut } from "../../types";

interface ReviewsListProps {
  reviews: ReviewOut[];
  username: string;
}

export function ReviewsList({ reviews, username }: ReviewsListProps) {
  return (
    <div className="profile-reviews">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard key={review.id} review={review} username={username} />
        ))
      ) : (
        <div className="profile-reviews__empty">
          <p>No reviews yet.</p>
        </div>
      )}
    </div>
  );
}
