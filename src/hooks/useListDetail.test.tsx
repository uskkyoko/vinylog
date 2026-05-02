import type { ReactNode } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useListDetail } from "./useListDetail";
import { listsReducer } from "../store/listsSlice";
import { reviewsReducer } from "../store/reviewsSlice";
import { usersReducer } from "../store/usersSlice";
import type { ListOut, UserOut } from "../types";

vi.mock("../api", () => ({
  api: { getList: vi.fn() },
}));

import { api } from "../api";

const mockUser: UserOut = {
  id: 1,
  username: "testuser",
  full_name: "Test User",
  biography: null,
  birth_date: "2000-01-01",
  profile_picture: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: null,
  favourite_albums: [],
  followers: [],
  following: [],
  reviews: [],
  lists: [],
  is_following: false,
};

const mockList: ListOut = {
  id: 42,
  name: "My Favourites",
  list_type: "custom",
  description: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: null,
  archived: false,
  albums: [],
  user: mockUser,
};

function makeWrapper(preloadedLists: ListOut[] = []) {
  const testStore = configureStore({
    reducer: { lists: listsReducer, reviews: reviewsReducer, users: usersReducer },
    preloadedState: {
      lists: { items: preloadedLists },
      reviews: { items: [] },
      users: { favouriteAlbums: [] },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <Provider store={testStore}>{children}</Provider>
  );
}

describe("useListDetail", () => {
  afterEach(() => vi.clearAllMocks());

  it("returns the stored list from Redux without an API call when it is in the store", async () => {
    const { result } = renderHook(() => useListDetail(42), {
      wrapper: makeWrapper([mockList]),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getList).not.toHaveBeenCalled();
    expect(result.current.list).toEqual(mockList);
  });

  it("fetches the list from the API when it is not in the Redux store", async () => {
    vi.mocked(api.getList).mockResolvedValue(mockList);
    const { result } = renderHook(() => useListDetail(42), {
      wrapper: makeWrapper([]),
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getList).toHaveBeenCalledWith(42);
    expect(result.current.list).toEqual(mockList);
  });
});
