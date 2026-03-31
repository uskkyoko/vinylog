import { useEffect, type ReactNode } from "react";
import { useAuth } from "./useAuth";
import { useAppDispatch } from "../hooks/hooks";
import { fetchMyLists } from "../store/listsSlice";
import { fetchReviews } from "../store/reviewsSlice";
import { fetchFavouriteAlbums } from "../store/usersSlice";

/**
 * Bridges AuthContext → Redux: dispatches the initial data fetches
 * when the user becomes authenticated, and re-fetches if they switch accounts.
 */
export function AppDataLoader({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status !== "authed" || !user) return;
    dispatch(fetchMyLists());
    dispatch(fetchReviews(user.username));
    dispatch(fetchFavouriteAlbums(user.username));
  }, [status, user?.username, dispatch]);

  return <>{children}</>;
}
