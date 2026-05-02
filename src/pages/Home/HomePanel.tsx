import { Link } from "react-router-dom";

interface HomePanelProps {
  eyebrow: string;
  title: string;
  browseTo?: string;
  children: React.ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
}

export function HomePanel({
  eyebrow,
  title,
  browseTo,
  children,
  isEmpty,
  emptyMessage,
}: HomePanelProps) {
  return (
    <article className="home-panel">
      <header className="home-panel__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="home-panel__title">{title}</h2>
        </div>
        {browseTo && (
          <Link className="home-panel__link" to={browseTo}>
            Browse
          </Link>
        )}
      </header>
      <ul className="home-list">
        {isEmpty ? (
          <li className="home-list__item">
            <p className="home-list__meta">{emptyMessage}</p>
          </li>
        ) : (
          children
        )}
      </ul>
    </article>
  );
}
