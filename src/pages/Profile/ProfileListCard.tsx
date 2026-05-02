import { Link } from "react-router-dom";
import { AlbumPreviews } from "../../components/AlbumPreviews";
import type { ListOut } from "../../types";

export function ProfileListCard({ list }: { list: ListOut }) {
  return (
    <Link to={`/lists/${list.id}`} className="profile-lists__card">
      <p className="profile-lists__title">{list.name}</p>
      {list.albums.length > 0 && <AlbumPreviews albums={list.albums} />}
    </Link>
  );
}
