import { Link } from "react-router-dom";

interface HomeListItemProps {
  primary: string;
  meta: string;
  to: string;
  ctaText?: string;
}

export function HomeListItem({
  primary,
  meta,
  to,
  ctaText = "Open",
}: HomeListItemProps) {
  return (
    <li className="home-list__item">
      <div>
        <p className="home-list__primary">{primary}</p>
        <p className="home-list__meta">{meta}</p>
      </div>
      <Link className="home-list__cta" to={to}>
        {ctaText}
      </Link>
    </li>
  );
}
