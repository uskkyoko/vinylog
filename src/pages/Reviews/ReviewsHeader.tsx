/**
 * Static header for the owner's full reviews list page.
 * No state; shows the section title and a link back to the profile.
 */
import { ButtonLink } from "../../components/Button";

export function ReviewsHeader() {
  return (
    <header className="profile-section__header">
      <div>
        <p className="eyebrow">Activity</p>
        <h1 className="profile-section__title">All Reviews</h1>
      </div>
      <ButtonLink to="/profile" variant="ghost" size="sm">
        Back to profile
      </ButtonLink>
    </header>
  );
}
