import { useSelector } from "react-redux";
import { capitalizeName } from "../utils/helpers";
import ProfileFollowCard from "./ProfileFollowCard";

function FollowersTab() {
  const { userFollowers, authUserData } = useSelector((state) => state.user);
  return (
    <>
      {userFollowers.length == 0 ? (
        <div className="w-full h-20 flex items-center justify-center text-light-primaryText dark:text-dark-primaryText opacity-80">
          <p>You have no followers yet!</p>
        </div>
      ) : (
        <ul className="w-full divide-y divide-light-secondaryText dark:divide-dark-secondaryText border-light-secondaryText dark:border-dark-secondaryText">
          {userFollowers.map((x, i) => {
            return (
              <li key={i} className={`p-6 `}>
                <ProfileFollowCard
                  key={i}
                  userId={x.id}
                  username={x.userName}
                  userData={authUserData}
                  name={capitalizeName(x.name)}
                  profileImg={x.profileImg}
                  followed={x.isFollowed}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default FollowersTab;
