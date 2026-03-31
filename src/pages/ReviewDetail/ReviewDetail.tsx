import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/AppLayout";
import { ReviewDetailCard } from "../../components/ReviewCard/ReviewDetailCard";
import { PageLoading } from "../../components/PageLoading";
import { useAuth } from "../../context/useAuth";
import { useAppDispatch } from "../../hooks/hooks";
import { deleteReview } from "../../store/reviewsSlice";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../api";
import { ReviewDetailHeader } from "./ReviewDetailHeader";
import "../Review.css";

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const reviewId = Number(id);
  const {
    data: review,
    loading,
    error,
  } = useFetch(() => api.getReview(reviewId), null, [reviewId]);

  async function handleDelete() {
    await dispatch(deleteReview(reviewId));
    navigate("/reviews");
  }

  if (loading) return <PageLoading />;
  if (error || !review) {
    return (
      <AppLayout>
        <section className="review-detail">
          <div className="container">
            <p>Review not found.</p>
          </div>
        </section>
      </AppLayout>
    );
  }

  const isOwner = user?.id === review.user?.id;

  return (
    <AppLayout>
      <section className="review-detail">
        <div className="container">
          <ReviewDetailHeader albumTitle={review.album.title} />
          <ReviewDetailCard
            review={review}
            isOwner={isOwner}
            onDelete={handleDelete}
          />
        </div>
      </section>
    </AppLayout>
  );
}
