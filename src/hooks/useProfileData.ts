import { useAuth } from "../context/useAuth";
import { useAppSelector } from "./hooks";
import { usePublicUser } from "./useUser";
import { api } from "../api";

export function useProfileData(username: string) {
  const { user: currentUser } = useAuth();
  const reduxLists = useAppSelector((s) => s.lists.items);
  const reduxReviews = useAppSelector((s) => s.reviews.items);
  const reduxFavAlbums = useAppSelector((s) => s.users.favouriteAlbums);
  const { data: publicUser, setData: setPublicUser, loading, error } = usePublicUser(username);

  const isOwner = currentUser?.username === username;

  async function refresh() {
    const fresh = await api.getCurrentUser(username);
    setPublicUser(fresh);
  }

  return {
    isOwner,
    profileUser: isOwner
      ? { ...currentUser!, followers_count: publicUser?.followers_count, following_count: publicUser?.following_count }
      : publicUser ?? null,
    lists:     isOwner ? reduxLists     : (publicUser?.lists ?? []),
    reviews:   isOwner ? reduxReviews   : (publicUser?.reviews ?? []),
    favAlbums: isOwner ? reduxFavAlbums : (publicUser?.favourite_albums ?? []),
    isFollowing: !isOwner && publicUser ? publicUser.is_following : false,
    loading,
    error,
    refresh,
  };
}
