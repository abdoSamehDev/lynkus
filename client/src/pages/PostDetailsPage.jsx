/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DefaultButton } from "../components/Buttons.jsx";
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

function PostDetailsPage() {
    const { postId } = useParams();
    const [comments, setComments] = useState([
        { id: 1, text: "Great post!", user: "User1" },
        { id: 2, text: "Really insightful, thanks!", user: "User2" },
        { id: 3, text: "I love this post!", user: "User3" },
    ]); // Sample comment data

    const [newComment, setNewComment] = useState("");
    const [optionsOpen, setOptionsOpen] = useState(null);
    const posts = useSelector((state) => state.post.posts);
    const postDetails = posts[postId];

    // Function to handle new comment submission
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            const newCommentData = {
                id: comments.length + 1,
                text: newComment,
                user: "CurrentUser",
            };
            setComments([...comments, newCommentData]);
            setNewComment("");
        }
    };

    // Function to delete a comment
    const handleDeleteComment = (id) => {
        setComments(comments.filter(comment => comment.id !== id));
        setOptionsOpen(null); // Close the options menu after deletion
    };

    // Function to open the options menu for a specific comment
    const toggleOptionsMenu = (id) => {
        setOptionsOpen(optionsOpen === id ? null : id);
    };

    const optionsMenuRef = useRef(null);

    // Handle clicks outside the options menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setOptionsOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full max-h-screen bg-light-background dark:bg-dark-background md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar pt-6 px-6">
            {/* Post component */}
            <Post
                username={postDetails.username}
                name={postDetails.name}
                profileImg={postDetails.profileImg}
                body={postDetails.body}
                postImg={postDetails.postImg}
                likes={postDetails.likes}
                comments={postDetails.comments}
                postLiked={postDetails.postLiked}
                index={postId}
                commemts={postDetails.comments}
            />

            {/* Comments Section */}
            <div className="comments-section mt-8">
                <h2 className="text-xl mb-4 text-gray-800 dark:text-gray-200 font-bold">
                    Comments ({Array.isArray(comments) ? comments.length : 0})
                </h2>

                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="comment mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-light-primaryBackground dark:bg-dark-primaryBackground flex items-start relative"
                    >
                        {/* User Icon */}
                        <img
                            src="https://via.placeholder.com/40"
                            alt={`${comment.user}'s avatar`}
                            className="w-10 h-10 rounded-full mr-4"
                        />
                        <div className="flex-grow w-[80%]">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{comment.user}</p>
                            <p
                                className="text-base text-gray-700 dark:text-gray-300 break-words"
                                style={{
                                    overflow: 'hidden',
                                    display: 'block',
                                    maxHeight: '6em',
                                    lineHeight: '1.5em',
                                }}
                            >
                                {comment.text}
                            </p>
                    </div>

                {/* Options Menu */}
                    <div className="relative" ref={optionsMenuRef}>
                <button
                    onClick={() => toggleOptionsMenu(comment.id)}
                    className="ml-4 text-gray-600"
                    aria-label="Options"
                            >
                                <EllipsisVerticalIcon className="w-5 h-5"/>
                            </button>
                            {optionsOpen === comment.id && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    <ul className="py-1">
                                        {/* Options based on user */}
                                        {comment.user === "CurrentUser" ? (
                                            <>
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleDeleteComment(comment.id)}>Delete</li>
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Modify</li>
                                            </>
                                        ) : (
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleDeleteComment(comment.id)}>Delete</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="add-comment-form mt-6 flex flex-col gap-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Add a comment..."
                        required
                    ></textarea>
                    <div className="flex justify-end">
                        <DefaultButton type="submit" label="Post Comment" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostDetailsPage;
