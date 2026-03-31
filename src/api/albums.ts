import type { AlbumOut, AlbumSearchResult, SpotifyAlbumLookup, TrendingAlbumsResponse, TrackOut } from "../types";
import { get } from "./http";

export const albumsApi = {
  getAllAlbums: (): Promise<AlbumOut[]> => get<AlbumOut[]>("/albums/"),

  getAlbumDetails: (id: number): Promise<AlbumOut> =>
    get<AlbumOut>(`/albums/details/${id}`),

  getAlbumBySpotifyId: (spotifyId: string): Promise<SpotifyAlbumLookup> =>
    get<SpotifyAlbumLookup>(`/albums/spotify/${spotifyId}`),

  getTrendingAlbums: (): Promise<TrendingAlbumsResponse> =>
    get<TrendingAlbumsResponse>("/albums/trending"),

  getFeaturedAlbums: (): Promise<AlbumOut[]> =>
    get<AlbumOut[]>("/albums/featured"),

  getFeedAlbums: (): Promise<AlbumOut[]> => get<AlbumOut[]>("/albums/feed"),

  searchAlbums: (q: string): Promise<AlbumSearchResult[]> =>
    get<AlbumSearchResult[]>(`/albums/search?q=${encodeURIComponent(q)}`),

  getAlbumTracks: (spotifyId: string): Promise<TrackOut[]> =>
    get<TrackOut[]>(`/albums/tracks/${spotifyId}`),
};
