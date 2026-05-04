import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { useAuth } from "../../context/useAuth";
import { createReview, fetchReviews, updateReview } from "../../store/reviewsSlice";
import { FormField } from "../../components/FormField";
import { AlbumPickerField } from "../../components/AlbumPickerField/AlbumPickerField";
import { StarRatingField } from "../../components/StarRatingField/StarRatingField";
import { Button } from "../../components/Button";
import { FormError } from "../../components/FormError";
import { FavouriteTrackField } from "./FavouriteTrackField";
import type { AlbumSearchResult, ReviewOut } from "../../types";

interface Props {
  defaultAlbum?: AlbumSearchResult;
  review?: ReviewOut;
}

export function ReviewForm({ defaultAlbum, review }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEdit = review !== undefined;

  const [album, setAlbum] = useState<AlbumSearchResult | null>(defaultAlbum ?? null);
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [comment, setComment] = useState(review?.comment ?? "");
  const [favouriteTrack, setFavouriteTrack] = useState(review?.favorite_song ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const spotifyId = review?.album.spotify_id ?? album?.id ?? null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isEdit && !album) return setError("Please select an album.");
    if (rating === 0) return setError("Please select a rating.");
    setError(null);
    setLoading(true);
    try {
      if (isEdit) {
        const result = await dispatch(
          updateReview({
            id: review.id,
            data: { rating, comment: comment || null, favorite_song: favouriteTrack || null },
          }),
        );
        if (updateReview.fulfilled.match(result)) {
          navigate(`/reviews/${review.id}`);
        } else {
          setError(result.error.message ?? "Could not save changes. Please try again.");
        }
      } else {
        const result = await dispatch(
          createReview({
            album_id: album!.id,
            rating,
            comment: comment || null,
            favorite_song: favouriteTrack || null,
          }),
        );
        if (createReview.fulfilled.match(result)) {
          if (user) await dispatch(fetchReviews(user.username));
          navigate("/reviews");
        } else {
          setError(result.error.message ?? "Could not submit review. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="review-form__form" onSubmit={handleSubmit}>
      {isEdit ? (
        <div className="review-form__album-preview">
          {review.album.cover_url && (
            <img
              src={review.album.cover_url}
              alt={review.album.title}
              className="review-form__album-thumb"
            />
          )}
          <div>
            <p className="review-form__album-title">{review.album.title}</p>
            <p className="review-form__album-artist">{review.album.artist?.name}</p>
          </div>
        </div>
      ) : (
        <FormField label="Album" htmlFor="album-search" className="review-form__field">
          <AlbumPickerField value={album} onChange={setAlbum} />
        </FormField>
      )}

      <FormField label="Rating" htmlFor="rating" className="review-form__field">
        <StarRatingField value={rating} onChange={setRating} />
      </FormField>

      <FormField label="Review" htmlFor="comment" className="review-form__field">
        <textarea
          className="form-field__textarea"
          id="comment"
          rows={5}
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </FormField>

      <FavouriteTrackField
        spotifyId={spotifyId}
        value={favouriteTrack}
        onChange={setFavouriteTrack}
      />

      <FormError message={error} />

      <div className="review-form__actions">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? isEdit ? "Saving…" : "Submitting…"
            : isEdit ? "Save Changes" : "Submit Review"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => (isEdit ? navigate(`/reviews/${review.id}`) : navigate(-1))}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
