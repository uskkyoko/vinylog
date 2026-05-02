import { Link } from "react-router-dom";
import { Button, ButtonLink } from "../../components/Button";
import type { ListOut } from "../../types";

export function ListDetailHeader({
  list,
  isOwner,
  canEditDelete,
  onDelete,
  onAddAlbum,
}: {
  list: ListOut;
  isOwner: boolean;
  canEditDelete: boolean;
  onDelete: () => void;
  onAddAlbum: () => void;
}) {
  return (
    <header className="list-details__header">
      <div className="list-details__info">
        <span className="eyebrow">Curated List</span>
        <h1 className="list-details__title">{list.name}</h1>
        <div className="list-details__meta">
          {list.user.profile_picture && (
            <img
              src={list.user.profile_picture}
              alt={list.user.username}
              className="list-details__avatar"
            />
          )}
          <span className="list-details__author">
            by{" "}
            <Link
              to={`/profile/${list.user.username}`}
              className="list-details__author-link"
            >
              {list.user.username}
            </Link>
          </span>
          <span className="list-details__separator">•</span>
          <span className="list-details__date">
            {new Date(list.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="list-details__separator">•</span>
          <span className="list-details__count">
            {list.albums.length} Album{list.albums.length !== 1 ? "s" : ""}
          </span>
        </div>
        {list.description && (
          <p className="list-details__description">{list.description}</p>
        )}
      </div>
      {isOwner && (
        <div className="list-details__actions">
          <Button variant="primary" size="sm" onClick={onAddAlbum}>
            + Add Album
          </Button>
          {canEditDelete && (
            <>
              <ButtonLink to={`/lists/${list.id}/edit`} variant="ghost" size="sm">
                Edit
              </ButtonLink>
              <Button variant="danger" size="sm" onClick={onDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
