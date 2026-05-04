import { useParams } from "react-router-dom";
import "./Profile.css";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { PageNotFound } from "../../components/PageNotFound";
import { useAuth } from "../../context/useAuth";
import { useProfileData } from "../../hooks/useProfileData";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileLists } from "./ProfileLists";
import { ProfileReviews } from "./ProfileReviews";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, status: authStatus, followUser, unfollowUser } = useAuth();

  const {
    isOwner,
    profileUser,
    lists,
    reviews,
    favAlbums,
    isFollowing,
    loading,
    error,
    refresh,
  } = useProfileData(username!);

  async function handleFollow() {
    await followUser(username!);
    await refresh();
  }

  async function handleUnfollow() {
    await unfollowUser(username!);
    await refresh();
  }

  if (authStatus === "loading") return <PageLoading />;
  if (isOwner && !currentUser) return null;
  if (!isOwner && loading) return <PageLoading />;
  if (!isOwner && (error || !profileUser)) {
    return <PageNotFound section="profile" message="User not found." />;
  }

  return (
    <AppLayout>
      <section className="profile">
        <div className="container">
          <ProfileHeader
            user={profileUser!}
            favouriteAlbums={favAlbums}
            isOwner={isOwner}
            isFollowing={isFollowing}
            onFollow={!isOwner && currentUser ? handleFollow : undefined}
            onUnfollow={!isOwner && currentUser ? handleUnfollow : undefined}
          />
          <div className="profile__sections">
            <ProfileLists lists={lists} isOwner={isOwner} />
            <ProfileReviews reviews={reviews} isOwner={isOwner} />
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
