import type { AlbumOut, TrendingAlbumsResponse } from "../types";
import { api } from "../api";
import { useFetch } from "./useFetch";

export function useAlbums() {
  return useFetch<AlbumOut[]>(api.getAllAlbums, []);
}

export function useTrendingAlbums() {
  return useFetch<TrendingAlbumsResponse>(api.getTrendingAlbums, {
    popular: [],
    new_releases: [],
  });
}

export function useFeaturedAlbums() {
  return useFetch<AlbumOut[]>(api.getFeaturedAlbums, []);
}

export function useFeedAlbums() {
  return useFetch<AlbumOut[]>(api.getFeedAlbums, []);
}
