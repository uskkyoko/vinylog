import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSearch } from "./useSearch";
import type { SearchResults } from "../types";

vi.mock("../api", () => ({
  api: { search: vi.fn() },
}));

import { api } from "../api";

const EMPTY: SearchResults = { artists: [], albums: [], users: [], lists: [] };

describe("useSearch", () => {
  afterEach(() => vi.clearAllMocks());

  it("resolves to empty results without calling api.search when query is empty", async () => {
    const { result } = renderHook(() => useSearch(""));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.search).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(EMPTY);
  });

  it("calls api.search and returns results when query is non-empty", async () => {
    const mockResults: SearchResults = {
      artists: [{ spotify_id: "radiohead", name: "Radiohead", image_url: null }],
      albums: [],
      users: [],
      lists: [],
    };
    vi.mocked(api.search).mockResolvedValue(mockResults);

    const { result } = renderHook(() => useSearch("radiohead"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.search).toHaveBeenCalledWith("radiohead");
    expect(result.current.data).toEqual(mockResults);
  });

  it("re-fetches when query changes", async () => {
    vi.mocked(api.search).mockResolvedValue(EMPTY);
    let q = "pink floyd";
    const { rerender } = renderHook(() => useSearch(q));
    await waitFor(() => expect(api.search).toHaveBeenCalledTimes(1));

    q = "led zeppelin";
    rerender();
    await waitFor(() => expect(api.search).toHaveBeenCalledTimes(2));
    expect(api.search).toHaveBeenLastCalledWith("led zeppelin");
  });
});
