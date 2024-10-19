import { Tabs } from "flowbite-react";
import FollowersTab from "./FollowersTab";
import FollowingsTab from "./FollowingsTab";
import UserPostsTab from "./UserPostsTab";
import UserLikesTab from "./UserLikesTab";
import { tabTheme } from "../utils/flowbiteThemes";
import { useSelector } from "react-redux";

function ProfileNavTabs() {
  const {
    userLikedPosts,
    userFollowers,
    userFollowings,
    userPosts,
    isOwnProfile,
  } = useSelector((state) => state.user);
  return (
    <div className="min-h-full my-[20px] bg-light-background dark:bg-dark-background rounded-[10px]">
      <Tabs
        theme={tabTheme}
        aria-label="Full width tabs"
        variant="fullWidth"
        className="w-full "
      >
        <Tabs.Item title={`Followers (${userFollowers?.length || 0})`}>
          <FollowersTab />
        </Tabs.Item>
        <Tabs.Item title={`Followings (${userFollowings?.length || 0})`}>
          <FollowingsTab />
        </Tabs.Item>
        <Tabs.Item active title={`Posts (${userPosts?.length || 0})`}>
          <UserPostsTab />
        </Tabs.Item>
        {isOwnProfile && (
          <Tabs.Item title={`Likes (${userLikedPosts?.length || 0})`}>
            <UserLikesTab />
          </Tabs.Item>
        )}
      </Tabs>
    </div>
  );
}

export default ProfileNavTabs;
