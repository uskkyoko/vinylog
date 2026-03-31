import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { api } from "../../api";
import type { UserSummary } from "../../types";

export function FollowModal({
  username,
  kind,
  onClose,
}: {
  username: string;
  kind: "followers" | "following";
  onClose: () => void;
}) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const title = kind === "followers" ? "Followers" : "Following";

  useEffect(() => {
    const fetch = kind === "followers" ? api.getFollowers : api.getFollowing;
    fetch(username)
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [username, kind]);

  return (
    <div className="follow-modal__overlay" onClick={onClose}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="follow-modal__header">
          <h2 className="follow-modal__title">{title}</h2>
          <Button
            variant="ghost"
            className="follow-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </Button>
        </div>
        <ul className="follow-modal__list">
          {loading ? (
            <li className="follow-modal__empty">Loading…</li>
          ) : users.length === 0 ? (
            <li className="follow-modal__empty">
              No {title.toLowerCase()} yet.
            </li>
          ) : (
            users.map((u) => (
              <li key={u.id} className="follow-modal__item">
                <Link
                  to={`/profile/${u.username}`}
                  className="follow-modal__user"
                  onClick={onClose}
                >
                  {u.profile_picture ? (
                    <img
                      src={u.profile_picture}
                      alt={u.username}
                      className="follow-modal__avatar"
                    />
                  ) : (
                    <div className="follow-modal__avatar follow-modal__avatar--placeholder">
                      {u.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="follow-modal__user-info">
                    <span className="follow-modal__username">
                      @{u.username}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
