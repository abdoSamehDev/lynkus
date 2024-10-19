import { useEffect, useRef, useState } from "react";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import { DefaultButton } from "../components/Buttons.jsx";
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import api, { setAuthToken } from "../utils/axios";
import Cookies from "universal-cookie";
import LoadingPage from "./LoadingPage.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function PostDetailsPage() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const cookies = new Cookies();
    const currentUser = cookies.get("user");
    const token = cookies.get("token");

    const optionsMenuRefs = useRef([]);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                setAuthToken(token);
                const postResponse = await api.get(`/posts/${postId}`);
                setPost(postResponse.data);

                const commentsResponse = await api.get(`/comments/${postId}`);
                console.log("commentsResponse", commentsResponse);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error("Error fetching post or comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndComments();
    }, [postId, token]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (newComment.trim()) {
            const newCommentData = {
                postId: postId,
                text: newComment,
            };
            try {
                setAuthToken(token);
                const response = await api.post(`/comments`, newCommentData);
                setComments((prevComments) => [...prevComments, response.data]);
                setNewComment("");
                setIsLoading(false);

            } catch (error) {
                console.error("Error adding comment:", error);
                setIsLoading(false);

            }
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            setAuthToken(token);
            await api.delete(`/comments/${id}`);
            setComments((prevComments) => prevComments.filter((comment) => comment._id !== id));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    // Toggle the edit mode for a comment
    const handleModifyComment = (commentId, commentText) => {
        setEditingCommentId(commentId);
        setEditedCommentText(commentText);
    };

    // Save the updated comment
    const handleSaveComment = async (commentId) => {
        try {
            setAuthToken(token);
            const updatedCommentData = { text: editedCommentText , postId: postId };
            await api.put(`/comments/${commentId}`, updatedCommentData);
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId ? { ...comment, text: editedCommentText } : comment
                )
            );
            setEditingCommentId(null);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const toggleOptionsMenu = (index) => {
        const menu = optionsMenuRefs.current[index];
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            optionsMenuRefs.current.forEach((ref, i) => {
                if (ref && i !== index) {
                    ref.style.display = "none";
                }
            });
            menu.style.display = "block";
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            optionsMenuRefs.current.forEach((menu) => {
                if (menu && !menu.contains(event.target)) {
                    menu.style.display = "none";
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Display loading page while data is being fetched
    if (loading) return <div
        className="w-full max-h-screen bg-light-background dark:bg-dark-background md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar text-light-primaryText dark:text-dark-primaryText">
        <LoadingPage/>
    </div>;

    // Return the main component JSX when the data is ready
    return (
        <div
            className="w-full max-h-screen bg-light-background dark:bg-dark-background md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar pt-6 px-6 flex-1">
            {post ? (
                <Post
                    name={post.userName}
                    username={post.name}
                    profileImg={post.post.authorId.profileImg}
                    body={post.post.body}
                    postImg={post.post.image}
                    likes={post.likes}
                    postLiked={post.postLiked}
                    index={postId}
                    comments={post.comments}
                    userId={post.post.authorId._id}
                    currentUserId={currentUser.id}
                    postId={postId}
                />
            ) : (
                <div className="w-full max-h-screen bg-light-background dark:bg-dark-background md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar text-light-primaryText dark:text-dark-primaryText">
                    <LoadingPage />
                </div>
            )}

            <div className="comments-section mt-8">
                <h2 className="text-xl mb-4 text-gray-800 dark:text-gray-200 font-bold">
                    Comments ({comments.length})
                </h2>

                {/* Display the comments */}
                { comments.map((comment, index) => (
                    console.log("comment", comment),
                    <div
                        key={comment.id || `comment-${index}`}
                        className="comment mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-light-primaryBackground dark:bg-dark-primaryBackground flex items-start relative"
                    >
                        <img
                            src={post.post.authorId.profileImg}
                            alt={`${comment.user}'s avatar`}
                            className="w-10 h-10 rounded-full mr-4"
                        />
                        <div className="flex-grow space-y-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {comment.userId.name}
                            </p>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                <span className="text-primary-600 dark:text-primary-400">
                                    @{comment.userId.userName}
                                </span>
                            </p>

                            {editingCommentId === comment._id ? (
                                <textarea
                                    value={editedCommentText}
                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:border-blue-500 transition-colors"
                                ></textarea>
                            ) : (
                                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {comment.text}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            {comment.userId.id === currentUser.id ? (
                            <button
                                onClick={() => toggleOptionsMenu(index)}
                                className="ml-4 text-gray-600"
                                aria-label="Options"
                            >
                                <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>): null}
                            <div
                                ref={(el) => (optionsMenuRefs.current[index] = el)}
                                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                                style={{ display: "none" }}
                            >
                                <ul className="py-1">
                                    {comment._Id === currentUser.id ? (
                                        <>
                                            <li
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleDeleteComment(comment._id)}
                                            >
                                                Delete
                                            </li>
                                            {editingCommentId === comment._id ? (
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSaveComment(comment._id)}
                                                >
                                                    Save
                                                </li>
                                            ) : (
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleModifyComment(comment._id, comment.text)}
                                                >
                                                    Modify
                                                </li>
                                            )}
                                        </>
                                    ) : null}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}

                <form onSubmit={handleCommentSubmit} className="add-comment-form mt-6 flex flex-col gap-4 mb-20">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Add a comment..."
                        required
                    ></textarea>
                    <div className="flex justify-end">
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <DefaultButton label="Add Comment" type="submit" />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostDetailsPage;
