import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { useAuth } from "../../context/useAuth";
import { useAppDispatch } from "../../hooks/hooks";
import { useListDetail } from "../../hooks/useListDetail";
import { deleteList } from "../../store/listsSlice";
import { ListDetailHeader } from "./ListDetailHeader";
import { ListAlbumItem } from "./ListAlbumItem";
import { ListDetailEmpty } from "./ListDetailEmpty";
import "./Lists.css";

export default function ListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const listId = Number(id);

  const { list, loading, error } = useListDetail(listId);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this list?")) return;
    await dispatch(deleteList(listId));
    navigate("/lists");
  }

  if (loading) return <PageLoading />;
  if (error || !list) {
    return (
      <AppLayout>
        <section className="list-details">
          <div className="container">
            <p>List not found.</p>
          </div>
        </section>
      </AppLayout>
    );
  }

  const isOwner = user?.id === list.user.id && list.list_type === "custom";

  return (
    <AppLayout>
      <section className="list-details">
        <div className="container">
          <ListDetailHeader list={list} isOwner={isOwner} onDelete={handleDelete} />
          <hr className="divider list-details__divider" />
          <div className="list-details__content">
            {list.albums.length > 0 ? (
              <div className="list-details__grid">
                {list.albums.map((album, index) => (
                  <ListAlbumItem key={album.id} album={album} index={index} />
                ))}
              </div>
            ) : (
              <ListDetailEmpty listId={list.id} isOwner={isOwner} />
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
