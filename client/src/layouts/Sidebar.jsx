import { useSelector } from "react-redux";
import FollowCard from "../components/FollowCard";

function Sidebar() {
  const users = useSelector((state) => state.user.userRecommendation);

  return (
    <div className="w-full max-h-screen pb-10 bg-light-background dark:bg-dark-background hidden lg:grid grid-rows-6 col-span-2 border-l border-light-secondaryText dark:border-dark-secondaryText overflow-y-auto hide-scrollbar">
      <div className="min-h-96 row-span-3 pt-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-light-primaryText dark:text-dark-primaryText">
          Link Up With
        </h1>
        <div className="w-full flex flex-col justify-center items-center gap-8">
          {users.length > 0 ? (
            users.slice(0, 6).map((x, i) => {
              return (
                <FollowCard
                  key={i}
                  userId={x._id}
                  username={x.userName}
                  name={x.name}
                  profileImg={x.profileImg}
                />
              );
            })
          ) : (
            <p className="text-lg text-light-primaryText dark:text-dark-primaryText">
              Currently Linked With All Users
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
