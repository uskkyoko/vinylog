import { useParams } from "react-router-dom";
import "./Profile.css";
import { AppLayout } from "../../components/AppLayout";
import { PageLoading } from "../../components/PageLoading";
import { PageNotFound } from "../../components/PageNotFound";
import { Button } from "../../components/Button";
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
  if (!isOwner && error) {
    return (
      <AppLayout>
        <section className="profile">
          <div className="container">
            <div className="profile__error-card">
              <h1 className="profile__error-title">Couldn't load profile</h1>
              <p className="profile__error-message">{error}</p>
              <Button onClick={refresh} variant="primary">
                Try again
              </Button>
            </div>
          </div>
        </section>
      </AppLayout>
    );
  }
  if (!isOwner && !profileUser) {
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
