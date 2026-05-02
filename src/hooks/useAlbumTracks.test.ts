import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAlbumTracks } from "./useAlbumTracks";
import type { TrackOut } from "../types";

vi.mock("../api", () => ({
  api: { getAlbumTracks: vi.fn() },
}));

import { api } from "../api";

describe("useAlbumTracks", () => {
  afterEach(() => vi.clearAllMocks());

  it("does not call the API when spotifyId is null", async () => {
    const { result } = renderHook(() => useAlbumTracks(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getAlbumTracks).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
  });

  it("fetches and returns tracks when spotifyId is provided", async () => {
    const mockTracks: TrackOut[] = [
      { name: "Everything in Its Right Place", track_number: 1 },
      { name: "Kid A", track_number: 2 },
    ];
    vi.mocked(api.getAlbumTracks).mockResolvedValue(mockTracks);

    const { result } = renderHook(() => useAlbumTracks("spotify123"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getAlbumTracks).toHaveBeenCalledWith("spotify123");
    expect(result.current.data).toEqual(mockTracks);
  });

  it("re-fetches when spotifyId changes", async () => {
    vi.mocked(api.getAlbumTracks).mockResolvedValue([]);
    let id: string | null = "id1";
    const { rerender } = renderHook(() => useAlbumTracks(id));
    await waitFor(() => expect(api.getAlbumTracks).toHaveBeenCalledTimes(1));

    id = "id2";
    rerender();
    await waitFor(() => expect(api.getAlbumTracks).toHaveBeenCalledTimes(2));
    expect(api.getAlbumTracks).toHaveBeenLastCalledWith("id2");
  });
});
