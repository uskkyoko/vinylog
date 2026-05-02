import { ButtonLink } from "../../components/Button";

export function ListsIntro() {
  return (
    <header className="lists-page__intro">
      <p className="eyebrow">Community crates</p>
      <h1 className="lists-page__title">Lists</h1>
      <p className="lists-page__subtitle">
        See what collectors are sequencing—curated journeys through genre, mood,
        and moment.
      </p>
      <ButtonLink to="/lists/new" variant="primary" size="sm">
        + Create List
      </ButtonLink>
    </header>
  );
}
