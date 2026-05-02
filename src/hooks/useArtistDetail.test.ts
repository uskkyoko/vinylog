import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useArtistDetail } from "./useArtistDetail";
import type { ArtistDetails, ArtistAlbumSummary } from "../types";

vi.mock("../api", () => ({
  api: {
    getArtistsDetails: vi.fn(),
    getSpotifyArtist: vi.fn(),
  },
}));

import { api } from "../api";

const baseArtist: ArtistDetails = {
  id: 1,
  name: "Radiohead",
  biography: null,
  profile_picture: null,
  spotify_id: null,
  average_rating: null,
  total_reviews: 0,
  albums: [],
};

const mockAlbum: ArtistAlbumSummary = {
  id: 10,
  title: "OK Computer",
  spotify_id: "ok_computer",
  cover_url: null,
  release_date: "1997-05-21",
  review_count: 0,
  average_rating: null,
};

describe("useArtistDetail", () => {
  afterEach(() => vi.clearAllMocks());

  it("returns artist data with a single fetch when artist already has albums", async () => {
    const artistWithAlbums: ArtistDetails = {
      ...baseArtist,
      spotify_id: "spotify:radiohead",
      albums: [mockAlbum],
    };
    vi.mocked(api.getArtistsDetails).mockResolvedValue(artistWithAlbums);

    const { result } = renderHook(() => useArtistDetail(1));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getArtistsDetails).toHaveBeenCalledTimes(1);
    expect(api.getSpotifyArtist).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(artistWithAlbums);
  });

  it("syncs from Spotify and re-fetches when artist has no albums but has a spotify_id", async () => {
    const noAlbums: ArtistDetails = { ...baseArtist, spotify_id: "spotify:radiohead", albums: [] };
    const withAlbums: ArtistDetails = { ...noAlbums, albums: [mockAlbum] };
    vi.mocked(api.getArtistsDetails)
      .mockResolvedValueOnce(noAlbums)
      .mockResolvedValueOnce(withAlbums);
    vi.mocked(api.getSpotifyArtist).mockResolvedValue([]);

    const { result } = renderHook(() => useArtistDetail(1));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getArtistsDetails).toHaveBeenCalledTimes(2);
    expect(api.getSpotifyArtist).toHaveBeenCalledWith("spotify:radiohead");
    expect(result.current.data).toEqual(withAlbums);
  });

  it("does not sync from Spotify when artist has no albums and no spotify_id", async () => {
    vi.mocked(api.getArtistsDetails).mockResolvedValue(baseArtist);

    const { result } = renderHook(() => useArtistDetail(1));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.getArtistsDetails).toHaveBeenCalledTimes(1);
    expect(api.getSpotifyArtist).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(baseArtist);
  });
});
