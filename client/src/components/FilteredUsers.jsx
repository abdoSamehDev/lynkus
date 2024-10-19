import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults } from "../store/searchSlice";
import Loading from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function FilteredUsers() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.searchQuery);
  const users = useSelector((state) => state.search.users) || [];
  const loading = useSelector((state) => state.search.loading);
  const activeTab = useSelector((state) => state.search.activeTab);

  useEffect(() => {
    // Dispatch fetchSearchResults whenever the component mounts or query/activeTab changes
    dispatch(fetchSearchResults({ query, activeTab }));
  }, [dispatch, query, activeTab]);

  const navigate = useNavigate();

  const handleUserClick = (userName) => {
    navigate(`/user/${userName}`);
  };

  return (
    <div className="filtered-users p-3">
      {loading ? (
        <Loading />
      ) : !query ? (
        <p className="text-center text-gray-500 mt-4">
          Please enter a search query to find users
        </p>
      ) : users.length > 0 ? (
        users.map((user, index) => (
          <div
            key={index}
            onClick={() => handleUserClick(user.userName)}
            className="user-card p-4 border rounded-lg shadow-md my-2 flex items-center cursor-pointer"
          >
            <img
              src={user.profileImg}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="user-info ml-4">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">@{user.userName}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No users found</p>
      )}
    </div>
  );
}
