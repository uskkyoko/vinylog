import { ButtonLink } from "../../components/Button";

export function GuestCard() {
  return (
    <div className="home-hero__card home-hero__card--guest">
      <p className="eyebrow">Welcome to Vinylog</p>
      <h3 className="card-title">Join the community</h3>
      <p className="card-text">
        Start logging your collection and sharing reviews today.
      </p>
      <ButtonLink variant="primary" to="/signup" className="home-hero__cta">
        Start tracking
      </ButtonLink>
    </div>
  );
}
