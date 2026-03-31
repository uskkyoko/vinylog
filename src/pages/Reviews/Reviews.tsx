/**
 * Full reviews list page — only accessible to the authenticated user.
 *
 * Data flow: reads reviews from Redux (state.reviews.items), which was
 * populated by fetchReviews() dispatched in AppDataLoader when the user
 * authenticated. No local fetch needed here.
 */
import { AppLayout } from "../../components/AppLayout";
import { useAuth } from "../../context/useAuth";
import { useAppSelector } from "../../hooks/hooks";
import { ReviewsHeader } from "./ReviewsHeader";
import { ReviewsList } from "./ReviewsList";
import "../Profile/Profile.css";

export default function Reviews() {
  const { user } = useAuth();

  /** Reads directly from the Redux store — no additional fetch. */
  const reviews = useAppSelector((state) => state.reviews.items);

  if (!user) return null;

  return (
    <AppLayout>
      <section className="profile">
        <div className="container">
          <ReviewsHeader />
          <ReviewsList reviews={reviews} username={user.username} />
        </div>
      </section>
    </AppLayout>
  );
}
