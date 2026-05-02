import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { PageNotFound } from "../../components/PageNotFound";
import { useAuth } from "../../context/useAuth";
import { useAppDispatch } from "../../hooks/hooks";
import { useListDetail } from "../../hooks/useListDetail";
import { deleteList } from "../../store/listsSlice";
import { ListDetailHeader } from "./ListDetailHeader";
import { ListAlbumItem } from "./ListAlbumItem";
import { ListDetailEmpty } from "./ListDetailEmpty";
import { ListDetailAddAlbum } from "./ListDetailAddAlbum";
import "./Lists.css";

export default function ListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const listId = Number(id);

  const { list, loading, error } = useListDetail(listId);
  const [addingAlbum, setAddingAlbum] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this list?")) return;
    await dispatch(deleteList(listId));
    navigate("/lists");
  }

  if (loading) return <PageLoading />;
  if (error || !list) {
    return <PageNotFound section="list-details" message="List not found." />;
  }

  const isOwner = user?.id === list.user.id;
  const canEditDelete = isOwner && list.list_type === "custom";

  return (
    <AppLayout>
      <section className="list-details">
        <div className="container">
          <ListDetailHeader
            list={list}
            isOwner={isOwner}
            canEditDelete={canEditDelete}
            onDelete={handleDelete}
            onAddAlbum={() => setAddingAlbum(true)}
          />
          <hr className="divider list-details__divider" />
          <div className="list-details__content">
            {addingAlbum && (
              <ListDetailAddAlbum
                list={list}
                onClose={() => setAddingAlbum(false)}
              />
            )}
            {list.albums.length > 0 ? (
              <div className="list-details__grid">
                {list.albums.map((album, index) => (
                  <ListAlbumItem key={album.id} album={album} index={index} />
                ))}
              </div>
            ) : (
              <ListDetailEmpty listId={list.id} isOwner={canEditDelete} />
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
