import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { fetchUserDataFromCookies, recommendedUsers } from "../store/userSlice";
import { fetchPosts } from "../store/postSlice";
import LoadingPage from "./LoadingPage";

function HomePage() {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts);
    const user = useSelector((state) => state.user.userData);
    console.log("posts", posts);
    // Loading state to manage when data is being fetched
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(fetchUserDataFromCookies());
            await dispatch(fetchPosts());
            await dispatch(recommendedUsers());
            setLoading(false);
        };

        fetchData();
    }, [dispatch]);

    // Render LoadingPage while loading is true
    if (loading) {
        return <div className="w-full max-h-screen bg-light-background dark:bg-dark-background md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar text-light-primaryText dark:text-dark-primaryText"><LoadingPage /></div>;
    }

    return (
        <div className="w-full max-h-screen bg-light-background dark:bg-dark-background md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar mb-16 md:mb-0">
            <CreatePost profileImg={user.profileImg} />
            <ul className="w-full divide-y divide-light-secondaryText dark:divide-dark-secondaryText border-t border-light-secondaryText dark:border-dark-secondaryText">
                {posts.map((x, i) => {
                    return (
                        <li key={i} className="pt-6 px-6">
                            <Post
                                name={x.authorId?.name}
                                username={x.authorId?.userName}
                                profileImg={x.authorId?.profileImg}
                                postId={x?._id}
                                body={x?.body}
                                postImg={x?.image}
                                likes={x?.likes}
                                comments={x?.comments}
                                likedByUser={x?.likedByUser}
                                index={i}
                                userId={user?._id}
                                authorId={x.authorId?._id}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default HomePage;
