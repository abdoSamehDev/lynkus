/* eslint-disable react/prop-types */
import Head from "./Head";
import { Link } from "react-router-dom";
import {} from "../store/userSlice";

function ProfileFollowCard({ name, username, profileImg }) {
  return (
    <div className="w-full flex justify-between items-center">
      <Link to={`/user/${username}`}>
        <Head username={username} name={name} profileImg={profileImg} />
      </Link>
    </div>
  );
}

export default ProfileFollowCard;
