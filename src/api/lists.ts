import type { ListOut, ListCreate, ListUpdate } from "../types";
import { get, mutateJSON, mutateVoid } from "./http";

export const listsApi = {
  getLists: (): Promise<ListOut[]> => get<ListOut[]>("/lists/"),

  getList: (id: number): Promise<ListOut> => get<ListOut>(`/lists/${id}`),

  getMyLists: (): Promise<ListOut[]> => get<ListOut[]>("/lists/my-lists"),

  getUserLists: (username: string): Promise<ListOut[]> =>
    get<ListOut[]>(`/lists/user/${username}/`),

  createList: (data: ListCreate): Promise<ListOut> =>
    mutateJSON<ListOut>("/lists/", "POST", data),

  updateList: (id: number, data: ListUpdate): Promise<ListOut> =>
    mutateJSON<ListOut>(`/lists/${id}`, "PUT", data),

  deleteList: (id: number): Promise<void> =>
    mutateVoid(`/lists/${id}`, "DELETE"),
};
