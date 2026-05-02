import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/Button";
import { useAuth } from "../../context/useAuth";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { addAlbumToList } from "../../store/listsSlice";
import type { AlbumOut } from "../../types";

export function AddToListButton({ album }: { album: AlbumOut }) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const lists = useAppSelector((state) => state.lists.items);

  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) return null;

  async function handleAdd(listId: number) {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;
    const result = await dispatch(
      addAlbumToList({ listId, currentAlbums: list.albums, album })
    ).unwrap();
    if (result === null) {
      setFeedback("Already in list");
    } else {
      setFeedback("Added!");
    }
    setTimeout(() => {
      setFeedback(null);
      setOpen(false);
    }, 1200);
  }

  return (
    <div className="add-to-list" ref={wrapperRef}>
      <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
        + Add to list
      </Button>
      {open && (
        <div className="add-to-list__dropdown">
          {lists.length === 0 ? (
            <p className="add-to-list__empty">No lists yet</p>
          ) : (
            lists.map((list) => (
              <button
                key={list.id}
                className="add-to-list__item"
                onClick={() => handleAdd(list.id)}
              >
                {list.name}
              </button>
            ))
          )}
          {feedback && <p className="add-to-list__feedback">{feedback}</p>}
        </div>
      )}
    </div>
  );
}
