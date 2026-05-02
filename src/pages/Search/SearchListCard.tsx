import { Link } from "react-router-dom";
import type { ListSearchResult } from "../../types";

export function SearchListCard({ list }: { list: ListSearchResult }) {
  return (
    <Link to={`/lists/${list.id}`} className="search-results__list-card">
      <div className="search-results__list-accent" aria-hidden="true" />
      <div className="search-results__list-body">
        <p className="search-results__list-title">{list.name}</p>
        <p className="search-results__list-meta">by {list.user.username}</p>
      </div>
    </Link>
  );
}
