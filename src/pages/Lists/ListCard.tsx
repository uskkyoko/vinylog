import { Link } from "react-router-dom";
import { AlbumPreviews } from "../../components/AlbumPreviews";
import type { ListOut } from "../../types";

export function ListCard({ list }: { list: ListOut }) {
  return (
    <Link to={`/lists/${list.id}`} className="list-card">
      <div className="list-card__body">
        <h2 className="list-card__title">{list.name}</h2>
        <p className="list-card__description">
          {list.description || "No description yet."}
        </p>

        <AlbumPreviews albums={list.albums} />

        <div className="list-card__meta">
          <span className="list-card__author">
            by{" "}
            <span className="list-card__author-link">
              {list.user.username}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
