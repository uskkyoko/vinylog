import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useAppSelector } from "./hooks";
import { usePublicUser } from "./useUser";
import { useFetch } from "./useFetch";
import { api } from "../api";
import type { ReviewOut, ListOut, AlbumOut } from "../types";

export function useProfileData(username: string) {
  const { user: currentUser } = useAuth();
  const reduxLists = useAppSelector((s) => s.lists.items);
  const reduxReviews = useAppSelector((s) => s.reviews.items);
  const reduxFavAlbums = useAppSelector((s) => s.users.favouriteAlbums);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: publicUser, loading, error } = usePublicUser(username, refreshKey);

  const isOwner = currentUser?.username === username;
  const fetchPublic = !isOwner && !!username;

  const { data: publicReviews, loading: reviewsLoading } = useFetch<ReviewOut[]>(
    () =>
      fetchPublic ? api.getReviews(username) : Promise.resolve([] as ReviewOut[]),
    [],
    [username, refreshKey, fetchPublic],
  );

  const { data: publicLists, loading: listsLoading } = useFetch<ListOut[]>(
    () =>
      fetchPublic ? api.getUserLists(username) : Promise.resolve([] as ListOut[]),
    [],
    [username, refreshKey, fetchPublic],
  );

  const { data: publicFavAlbums, loading: favLoading } = useFetch<AlbumOut[]>(
    () =>
      fetchPublic
        ? api.getFavouriteAlbums(username)
        : Promise.resolve([] as AlbumOut[]),
    [],
    [username, refreshKey, fetchPublic],
  );

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  const aggregateLoading = isOwner
    ? false
    : loading || reviewsLoading || listsLoading || favLoading;

  return {
    isOwner,
    profileUser: isOwner
      ? { ...currentUser!, followers_count: publicUser?.followers_count, following_count: publicUser?.following_count }
      : publicUser ?? null,
    lists:     isOwner ? reduxLists     : (publicLists.length     ? publicLists     : publicUser?.lists ?? []),
    reviews:   isOwner ? reduxReviews   : (publicReviews.length   ? publicReviews   : publicUser?.reviews ?? []),
    favAlbums: isOwner ? reduxFavAlbums : (publicFavAlbums.length ? publicFavAlbums : publicUser?.favourite_albums ?? []),
    isFollowing: !isOwner && publicUser ? publicUser.is_following : false,
    loading: aggregateLoading,
    error,
    refresh,
  };
}
