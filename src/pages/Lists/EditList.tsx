/**
 * Edit List page — looks up the list from Redux by URL param id.
 *
 * Data flow: URL param → listId → Redux selector (state.lists.items)
 * → ListForm pre-filled with existing data → on submit → Redux
 * updateList thunk → navigate to /lists/:id.
 *
 * Reads from Redux so edits are always in sync with the current store
 * state without an extra API round-trip.
 */
import { useParams } from "react-router-dom";
import { FormPageShell } from "../../components/FormPageShell";
import { useAppSelector } from "../../hooks/hooks";
import { ListForm } from "./ListForm";
import "./Lists.css";

export default function EditList() {
  const { id } = useParams<{ id: string }>();
  const listId = Number(id);

  /** Source of truth: Redux store populated by fetchMyLists on auth. */
  const list = useAppSelector((state) =>
    state.lists.items.find((l) => l.id === listId),
  );

  if (!list) {
    return (
      <FormPageShell eyebrow="Update your collection" title="Edit List">
        <p>List not found.</p>
      </FormPageShell>
    );
  }

  return (
    <FormPageShell eyebrow="Update your collection" title="Edit List">
      <ListForm list={list} />
    </FormPageShell>
  );
}
