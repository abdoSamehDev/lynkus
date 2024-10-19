/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"; // Import useLocation
import Head from "./Head";

function SearchPost({ name, username, profileImg, postId, body, postImg }) {
  return (
    <div className="w-full">
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
    </div>
  );
}

export default SearchPost;
