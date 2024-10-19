/* eslint-disable react/prop-types */
import Head from "./Head";
import { LinkIcon } from "@heroicons/react/24/outline";
import { DefaultButton } from "./Buttons";
import { Link } from "react-router-dom";
import { LinkSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchUserData,
  getUserData,
  recommendedUsers,
  toggleFollow,
} from "../store/userSlice";
import LoadingSpinner from "./LoadingSpinner";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function ProfileFollowCard({
  userId,
  userData,
  name,
  username,
  profileImg,
  followed,
}) {
  const dispatch = useDispatch();
  const cookieData = cookies.get("user");
  const [isFollowed, setIsFollowed] = useState(followed);
  const [followLoading, setFollowLoading] = useState(false);

  return (
    <div className="w-full flex justify-between items-center">
      <Link to={`/user/${username}`}>
        <Head username={username} name={name} profileImg={profileImg} />
      </Link>
      {followLoading ? (
        <LoadingSpinner />
      ) : (
        <DefaultButton
          Icon={userData?.isFollowing || isFollowed ? LinkSlashIcon : LinkIcon}
          label={userData?.isFollowing || isFollowed ? "Unlink" : "Link"}
          onClick={async () => {
            setFollowLoading(true);
            await dispatch(toggleFollow(userId));
            await dispatch(fetchUserData(userData?.data?.id || userData?.id));
            await dispatch(
              getUserData(userData?.data?.userName || userData?.userName)
            );
            await dispatch(recommendedUsers());
            setIsFollowed(!userData?.isFollowing);
            setFollowLoading(false);
          }}
        />
      )}
    </div>
  );
}

export default ProfileFollowCard;
