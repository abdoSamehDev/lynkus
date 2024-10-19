/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"; // Import useLocation
import Head from "./Head";
import { HeartIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { fetchUserData, toggleLikeUserPost } from "../store/userSlice";
import { useState } from "react";

function ProfilePost({
  name,
  username,
  profileImg,
  postId,
  body,
  postImg,
  likes,
  comments,
  likedByUser,
  userId,
}) {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(likedByUser);
  const [likesNumber, setLikesNumber] = useState(likes);

  const handleLike = async () => {
    if (isLiked) {
      setLikesNumber(likesNumber - 1);
    } else {
      setLikesNumber(likesNumber + 1);
    }
    await dispatch(toggleLikeUserPost(postId)).unwrap();
    await dispatch(fetchUserData(userId)).unwrap();
    setIsLiked(!likedByUser);
  };

  return (
    <div className={`w-full mb-10`}>
      <Link
        to={`/post/${postId}`}
        className="w-full flex justify-between items-start"
      >
        <Link to={`/user/${username}`}>
          <Head username={username} name={name} profileImg={profileImg} />
        </Link>
      </Link>

      <div className="w-full pt-4 pb-2 text-light-primaryText dark:text-dark-primaryText">
        {body}
      </div>

      {postImg && (
        <div className="w-full h-96">
          <img
            src={postImg}
            className="w-full h-full object-cover"
            alt="postImg"
          />
        </div>
      )}

      <div className="w-full py-4 flex items-center justify-start gap-10">
        <div className="flex items-center justify-between gap-2">
          <button
            className="text-button-default  hover:text-button-hover"
            onClick={handleLike}
          >
            <HeartIcon className={`size-6 ${isLiked ? "hidden" : "block"}`} />
            <HeartSolid className={`size-6 ${isLiked ? "block" : "hidden"}`} />
          </button>
          <p className="text-sm font-medium text-button-default">
            {likesNumber}
          </p>
        </div>
        <Link
          to={`/post/${postId}`}
          className="flex items-center justify-between gap-2"
        >
          <button className="text-button-default hover:text-button-hover">
            <ChatBubbleOvalLeftIcon className="size-6" />
          </button>
          <p className="text-sm font-medium text-button-default">{comments}</p>
        </Link>
      </div>
    </div>
  );
}

export default ProfilePost;
