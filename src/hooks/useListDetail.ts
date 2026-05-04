import { useAppSelector } from "./hooks";
import { useFetch } from "./useFetch";
import { api } from "../api";

export function useListDetail(listId: number) {
  const stored = useAppSelector((state) =>
    state.lists.items.find((l) => l.id === listId) ?? null,
  );
  const { data: fetched, loading, error } = useFetch(
    () => (stored ? Promise.resolve(stored) : api.getList(listId)),
    null,
    [listId, !!stored],
  );
  return {
    list: stored ?? fetched,
    loading: stored ? false : loading,
    error: stored ? null : error,
  };
}
