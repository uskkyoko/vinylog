/**
 * Create List page — thin shell that delegates all form logic to ListForm.
 *
 * Data flow: ListForm local state → on submit → Redux createList thunk
 * → navigate to /lists/:newId.
 */
import { FormPageShell } from "../../components/FormPageShell";
import { ListForm } from "./ListForm";
import "./Lists.css";

export default function CreateList() {
  return (
    <FormPageShell eyebrow="Curate your collection" title="Create a New List">
      <ListForm />
    </FormPageShell>
  );
}
