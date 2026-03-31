/**
 * Edit Review page — looks up the review from Redux by URL param id.
 *
 * Data flow: URL param → reviewId → Redux selector (state.reviews.items)
 * → ReviewForm pre-filled with existing data → on submit → Redux
 * updateReview thunk → navigate to /reviews/:id.
 *
 * Reads from Redux instead of fetching so the edit form is always in sync
 * with the store (e.g. if the user edits immediately after creating).
 */
import { useParams } from "react-router-dom";
import { FormPageShell } from "../../components/FormPageShell";
import { useAppSelector } from "../../hooks/hooks";
import { ReviewForm } from "../CreateReview/ReviewForm";
import "../Review.css";

export default function EditReview() {
  const { id } = useParams<{ id: string }>();
  const reviewId = Number(id);

  /** Source of truth: Redux store populated by fetchReviews on auth. */
  const review = useAppSelector((state) =>
    state.reviews.items.find((r) => r.id === reviewId),
  );

  if (!review) {
    return (
      <FormPageShell eyebrow="Update your thoughts" title="Edit Review">
        <p>Review not found.</p>
      </FormPageShell>
    );
  }

  return (
    <FormPageShell eyebrow="Update your thoughts" title="Edit Review">
      <ReviewForm review={review} />
    </FormPageShell>
  );
}
