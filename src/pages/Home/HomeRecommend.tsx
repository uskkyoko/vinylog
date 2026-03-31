import { ButtonLink } from "../../components/Button";
import { useAuth } from "../../context/useAuth";

export function HomeRecommend() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      <hr className="divider" />
      <section className="home-recommend">
        <div className="container home-recommend__container">
          <div className="home-recommend__info">
            <p className="eyebrow">Need inspiration?</p>
            <h2 className="home-recommend__title">
              Describe a vibe, get instant AI crate pulls.
            </h2>
            <p className="home-recommend__copy">
              Powered by your prompt plus Spotify previews. Dial in mood-based
              spins for your next listening session.
            </p>
          </div>

          <div className="home-recommend__actions">
            <ButtonLink variant="primary" to="/recommend">
              Open AI Recommend
            </ButtonLink>
            <ButtonLink variant="ghost" to="/reviews/new">
              Share a review
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
