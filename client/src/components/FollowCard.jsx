/* eslint-disable react/prop-types */
import Head from "./Head";
import { LinkIcon } from "@heroicons/react/24/outline";
import { DefaultButton } from "./Buttons";
import { Link } from "react-router-dom";
import { LinkSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { recommendedUsers, toggleFollow } from "../store/userSlice";
import LoadingSpinner from "./LoadingSpinner";

function FollowCard({ userId, name, username, profileImg, followed }) {
  const dispatch = useDispatch();
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    setFollowing(followed);
  }, [followed]);

  const toggleFollowing = () => {
    setFollowing(!following);
  };
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
          Icon={following ? LinkSlashIcon : LinkIcon}
          label={following ? "Unlink" : "Link"}
          onClick={async () => {
            await dispatch(toggleFollow(userId));
            toggleFollowing();
            setFollowLoading(false);
            await dispatch(recommendedUsers());
          }}
        />
      )}
    </div>
  );
}

export default FollowCard;
