/**
 * Create Review page — reads optional prefill data from query params
 * (album_id, album_title, artist, image) set by AlbumDetailHero's
 * "Write a review" link, then delegates all form logic to ReviewForm.
 *
 * Data flow: URL query params → defaultAlbum prop → ReviewForm local state
 * → on submit → Redux createReview thunk → navigate to /reviews.
 */
import { useSearchParams } from "react-router-dom";
import { FormPageShell } from "../../components/FormPageShell";
import { ReviewForm } from "./ReviewForm";
import "../Review.css";

export default function CreateReview() {
  const [searchParams] = useSearchParams();

  const prefillId = searchParams.get("album_id");
  const prefillTitle = searchParams.get("album_title");
  const prefillArtist = searchParams.get("artist");
  const prefillImage = searchParams.get("image");

  const defaultAlbum =
    prefillId && prefillTitle && prefillArtist
      ? {
          id: prefillId,
          title: prefillTitle,
          artist_name: prefillArtist,
          cover_url: prefillImage,
        }
      : undefined;

  return (
    <FormPageShell eyebrow="Share your thoughts" title="Create a Review">
      <ReviewForm defaultAlbum={defaultAlbum} />
    </FormPageShell>
  );
}
