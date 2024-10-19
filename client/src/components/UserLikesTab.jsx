import { useSelector } from "react-redux";
import Post from "./Post";
import { capitalizeName } from "../utils/helpers";
import { useEffect } from "react";
import ProfilePost from "./ProfilePost";

function UserLikesTab() {
  const { loading, err, userLikedPosts } = useSelector((state) => state.user);
  useEffect(() => {
    console.log("USER LIKED POSTS TAB: ");
    console.log(userLikedPosts[0]);
  }, []);
  return (
    <>
      {(userLikedPosts?.length == 0 || userLikedPosts.posts?.length == 0) &&
      !loading ? (
        <div className="w-full h-20 flex items-center justify-center text-light-primaryText dark:text-dark-primaryText opacity-80">
          <p>You have no likes yet!</p>
        </div>
      ) : (
        <ul className="w-full divide-y divide-light-secondaryText dark:divide-dark-secondaryText border-light-secondaryText dark:border-dark-secondaryText">
          {userLikedPosts.map((x, i) => {
            return (
              <li key={i} className={`pt-6 px-6`}>
                <ProfilePost
                  username={x?.authorId?.userName}
                  name={capitalizeName(x?.authorId?.name)}
                  profileImg={x?.authorId?.profileImg}
                  body={x?.body}
                  postImg={x?.image}
                  likes={x?.likesCount || "0"}
                  commemts={x?.commentsCount || "0"}
                  likedByUser={x?.likedByUser}
                  postId={x?._id}
                  userId={x?.authorId?.id}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default UserLikesTab;
