import { StatsCard } from "./StatsCard";
import { GuestCard } from "./GuestCard";
import { ButtonLink } from "../../components/Button";
import { useAuth } from "../../context/useAuth";

export function HomeHero() {
  const { user } = useAuth();
  return (
    <header className="home-hero">
      <div className="container home-hero__grid">
        <div className="home-hero__copy">
          <p className="eyebrow">Collectors unite</p>
          <h1 className="home-hero__title">Spin records. Share stories.</h1>
          <p className="home-hero__lead">
            Catalog collections, follow friends, and discover new pressings
            curated by the Vinylog community.
          </p>

          <div className="home-hero__actions">
            {user && (
              <ButtonLink variant="primary" to="/recommend">
                AI recommend
              </ButtonLink>
            )}
          </div>
        </div>

        {user ? <StatsCard /> : <GuestCard />}
      </div>
    </header>
  );
}
