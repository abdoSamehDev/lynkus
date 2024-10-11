import {useDispatch, useSelector} from "react-redux";
import { Link } from "react-router-dom";
import Head from "./Head";
import { useState } from "react";
import { likePost, togglePost } from "../store/postSlice";
import { HeartIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import {
    HeartIcon as HeartSolid,
    Bars3Icon,
} from "@heroicons/react/24/solid";

function Post({
                  username,
                  name,
                  profileImg,
                  body,
                  postImg,
                  commemts,
                  index,
              }) {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const post = useSelector((state) => state.post.posts[index]);
    const { likes: currentLikes, postLiked: currentPostLiked } = post;

    return (
        <div className="w-full">
            <div className="w-full flex justify-between items-start">
                <Head username={username} name={name} profileImg={profileImg} />
                <div className="relative flex flex-col items-end justify-center">
                    <button
                        className="py-2 text-button-default"
                        onClick={() => setShow(!show)}
                    >
                        <Bars3Icon className="size-5" />
                    </button>
                    {/* Add Stuff to menu from here */}
                    <div
                        className={`absolute top-1/2 mt-5 z-10 ${
                            show ? "block" : "hidden"
                        } bg-button-default divide-y divide-dark-secondaryText rounded-lg shadow w-44 dark:bg-dark-secondaryBackground dark:divide-dark-secondaryText`}
                    >
                        <ul className="py-2 text-sm text-dark-primaryText dark:text-dark-primaryText">
                            <li
                                className="block px-4 py-2 hover:bg-button-hover hover:text-light-primaryText dark:hover:bg-dark-background dark:hover:text-button-hover"
                                onClick={() => dispatch(togglePost(index))}
                            >
                                Hide Post
                            </li>
                        </ul>
                        <ul className="py-2 text-sm text-dark-primaryText dark:text-dark-primaryText">
                            <li className="px-4 py-2 hover:bg-button-hover hover:text-light-primaryText dark:hover:bg-dark-background dark:hover:text-button-hover">
                                Share
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-full pt-4 pb-2 text-light-primaryText dark:text-dark-primaryText">
                {body}
            </div>
            {postImg && (
                <div className="w-full h-96 flex justify-center items-center">
                    <Link to={`/post/${index}`}>
                        <img
                            src={postImg}
                            className="w-full h-auto max-w-xs object-cover"
                            alt="Post"
                            loading="lazy"
                            decoding="async"
                        />
                    </Link>
                </div>
            )}
            <div className="w-full py-4 flex items-center justify-start gap-6">
                {/* Like Section */}
                <div className="flex items-center gap-1">
                    <button
                        className="text-button-default hover:text-button-hover"
                        onClick={() => {
                            dispatch(likePost(index));
                        }}
                    >
                        <HeartIcon className={`size-6 ${currentPostLiked ? "hidden" : "block"}`}/>
                        <HeartSolid
                            className={`size-6 ${currentPostLiked ? "block" : "hidden"}`}
                        />
                    </button>
                    <p className="text-sm font-medium text-button-default">{currentLikes}</p>
                </div>

                {/* Comments Section */}
                <div className="flex items-center gap-1">
                    <Link to={`/post/${index}`} className='flex items-center'>
                        <button className="text-button-default hover:text-button-hover">
                            <ChatBubbleOvalLeftIcon className="size-6"/>
                        </button>
                    </Link>
                    <p className="text-sm font-medium text-button-default items-center">{commemts}</p>
                </div>
            </div>
        </div>
    );
}

export default Post;
