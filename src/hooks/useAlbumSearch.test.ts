import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAlbumSearch } from "./useAlbumSearch";
import type { AlbumSearchResult } from "../types";

vi.mock("../api", () => ({
  api: { searchAlbums: vi.fn() },
}));

import { api } from "../api";

const mockAlbum: AlbumSearchResult = {
  id: "1",
  title: "OK Computer",
  artist_name: "Radiohead",
  cover_url: null,
};

describe("useAlbumSearch", () => {
  afterEach(() => vi.clearAllMocks());

  it("returns empty results without calling the API when query is empty", () => {
    const { result } = renderHook(() => useAlbumSearch(""));
    expect(api.searchAlbums).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("calls the API and returns results when query is non-empty", async () => {
    vi.mocked(api.searchAlbums).mockResolvedValue([mockAlbum]);

    const { result } = renderHook(() => useAlbumSearch("OK Computer"));
    await waitFor(() => expect(result.current.results).toHaveLength(1));
    expect(api.searchAlbums).toHaveBeenCalledWith("OK Computer");
    expect(result.current.results[0]).toEqual(mockAlbum);
  });

  it("returns empty array when query is cleared after a previous search", async () => {
    vi.mocked(api.searchAlbums).mockResolvedValue([mockAlbum]);
    let q = "OK Computer";
    const { result, rerender } = renderHook(() => useAlbumSearch(q));
    await waitFor(() => expect(result.current.results).toHaveLength(1));

    q = "";
    rerender();
    expect(result.current.results).toEqual([]);
  });

  it("captures API errors in the error field", async () => {
    const err = new Error("Search failed");
    vi.mocked(api.searchAlbums).mockRejectedValue(err);

    const { result } = renderHook(() => useAlbumSearch("bad query"));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.error).toBe(err);
  });
});
