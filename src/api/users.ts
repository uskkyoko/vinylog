import type { UserOut, UserUpdate, UserSummary, AlbumOut } from "../types";
import { get, mutateJSON, mutateVoid, mutateFormData } from "./http";

export const usersApi = {
  getCurrentUser: (username: string): Promise<UserOut> =>
    get<UserOut>(`/users/${username}`),

  getFavouriteAlbums: (username: string): Promise<AlbumOut[]> =>
    get<AlbumOut[]>(`/users/${username}/favourite-albums`),

  updateUser: (data: UserUpdate): Promise<UserOut> =>
    mutateJSON<UserOut>("/users/me", "PUT", data),

  updateFavouriteAlbums: (spotify_ids: string[]): Promise<AlbumOut[]> =>
    mutateJSON<AlbumOut[]>("/users/me/favourite-albums", "PUT", { spotify_ids }),

  uploadAvatar: (file: File): Promise<{ profile_picture: string }> => {
    const form = new FormData();
    form.append("profile_picture", file);
    return mutateFormData("/users/me/avatar", form);
  },

  followUser: (username: string): Promise<void> =>
    mutateVoid(`/users/${username}/follow`, "POST"),

  unfollowUser: (username: string): Promise<void> =>
    mutateVoid(`/users/${username}/follow`, "DELETE"),

  getFollowers: (username: string): Promise<UserSummary[]> =>
    get<UserSummary[]>(`/users/${username}/followers`),

  getFollowing: (username: string): Promise<UserSummary[]> =>
    get<UserSummary[]>(`/users/${username}/following`),
};
