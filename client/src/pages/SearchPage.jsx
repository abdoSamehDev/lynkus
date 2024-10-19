import { useEffect } from "react";
import SearchNavTabs from "../components/SearchNavTabs";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { fetchSearchResults, setSearchQuery } from "../store/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.searchQuery);
  const [searchParams] = useSearchParams();

  // Handle search input change
  const handleSearch = (e) => {
    const newQuery = e.target.value;
    dispatch(setSearchQuery(newQuery));
    dispatch(fetchSearchResults({ query: newQuery }));

    const url = new URL(window.location);
    url.searchParams.set("", newQuery);
    window.history.replaceState({}, "", url);
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      dispatch(setSearchQuery(searchQuery));
      dispatch(fetchSearchResults({ query: searchQuery }));
    }
  }, [searchParams, dispatch]);

  return (
    <>
      {/* Container for the search page */}
      <div className="w-full max-h-screen bg-light-background dark:bg-dark-background md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar text-light-primaryText dark:text-dark-primaryText">
        {/* Page heading */}
        <h1 className="text-3xl font-bold mx-[30px] my-[25px] mb-[25px] text-light-primaryText dark:text-dark-primaryText">
          Search
        </h1>

        {/* Search input container */}
        <div className="relative mx-8">
          {/* Search icon inside input field */}
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <MagnifyingGlassIcon className="size-5" />
          </div>

          {/* Search input field */}
          <input
            type="text"
            id="search-navbar"
            className="block w-full p-2 ps-10 text-sm text-light-primaryText border-0 border-gray-300 rounded-lg bg-light-secondaryBackground focus:ring-light-secondaryText dark:bg-dark-secondaryBackground dark:placeholder-dark-secondaryText dark:text-dark-primaryText dark:focus:ring-dark-secondaryText"
            placeholder="Search..."
            onChange={handleSearch}
            value={query}
          />
        </div>

        <SearchNavTabs />
      </div>
    </>
  );
};

export default SearchPage;
