/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import Head from "./Head";
import { useState } from "react";
import { likeNumberChange, likePostToggle } from "../store/postSlice";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import UpdatePostModal from "./EditPostModal";
import api, { setAuthToken } from "../utils/axios";
import cookie from "universal-cookie";

function Post({
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
                  currentUserId,
              }) {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts);
    const [showPost] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const location = useLocation(); // Get the current location
    const cookies = new cookie();
    const token = cookies.get("token");
    const handleLike = () => {
        const post = posts.find((post) => post._id === postId);
        dispatch(likePostToggle({ postId })).then(() => {
            dispatch(likeNumberChange(posts.indexOf(post)));
        });
    };

    const handleDelete = () => {
        if (userId === currentUserId) {
            // Delete post
            const deletePost = async () => {
                try {
                    setAuthToken(token);
                    console.log("Deleting post with ID:", postId);
                    const response = await api.delete(`/posts/${postId}`);
                    location.pathname === `/post/${postId}` && window.history.back();
                    console.log("Post deleted successfully:", response.data);
                } catch (error) {
                    console.error("Error deleting the post:", error);
                }
            };
            deletePost();
        }
    };

    return (
        <div className={`w-full ${showPost ? "block" : "hidden"} `}>
            {/* Conditionally render the Back Arrow if not on the homepage */}
            {location.pathname !== "/" && (
                <div className="flex items-center mb-4">
                    <Link
                        to="/" // Link to the home page
                        className="text-button-default hover:text-button-hover flex items-center"
                    >
                        <ArrowLeftIcon className="size-6" /> {/* Back arrow icon */}
                        <span className="ml-2">Back to Home</span>
                    </Link>
                </div>
            )}
      <Link
        to={`/post/${postId}`}
        className="w-full flex justify-between items-start"
      >
        <Link to={`/user/${username}`}>
          <Head username={username} name={name} profileImg={profileImg} />
        </Link>

        {/* Ellipsis Menu */}
        <div className="relative flex flex-col items-end justify-center">
          {userId === currentUserId && (
            <button
              className="py-2 text-button-default"
              onClick={() => setShowMenu(!showMenu)}
            >
              <EllipsisVerticalIcon className="size-5" />
            </button>
          )}
          {showMenu && (
            <div className="absolute top-1/2 mt-5 z-10 bg-button-default divide-y divide-dark-secondaryText rounded-lg shadow w-44 dark:bg-dark-secondaryBackground dark:divide-dark-secondaryText">
              <ul className="py-2 text-sm text-dark-primaryText dark:text-dark-primaryText">
                {/* Conditionally show the Edit option if the user is the post author */}
                {userId === currentUserId && (
                  <li
                    className="block px-4 py-2 hover:bg-button-hover hover:text-light-primaryText dark:hover:bg-dark-background dark:hover:text-button-hover cursor-pointer"
                    onClick={() => setOpenModal(true)}
                  >
                    Edit
                  </li>
                )}
                {/* Conditionally show the Delete option if the user is the post author */}
                {userId === currentUserId && (
                  <li
                    className="block px-4 py-2 hover:bg-button-hover hover:text-light-primaryText dark:hover:bg-dark-background dark:hover:text-button-hover cursor-pointer"
                    onClick={handleDelete}
                  >
                    Delete
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
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
            {/* Edit Post Modal */}
            <UpdatePostModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                postId={postId}
                mybody={body}
                myImage={postImg}

            />
            <HeartSolid
              className={`size-6 ${likedByUser ? "block" : "hidden"}`}
            />
          </button>
          <p className="text-sm font-medium text-button-default">{likes}</p>
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

      {/* Edit Post Modal */}
      <UpdatePostModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        postId={postId}
      />
    </div>
  );
}

export default Post;
