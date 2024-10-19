import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as MagnifyingGlassSolid,
  BellIcon as BellSolid,
  UserIcon as UserSolid,
} from "@heroicons/react/24/solid";
import { DefaultButton, ErrorButton } from "../components/Buttons";
import { toggleTheme } from "../store/themeSlice";

function Navbar() {
  const { authUserData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const theme = useSelector((state) => state.theme.theme);
  const hasNewNotifications = useSelector(
    (state) => state.notification.hasNewNotifications
  );
  const darkMode = theme === "dark";
  const dispatch = useDispatch();

  const changeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    dispatch(toggleTheme());
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/welcome");
  };

  return (
    <div className="w-full fixed bottom-0 md:static md:col-span-1 md:h-screen lg:col-span-2">
      <nav className="bg-light-background dark:bg-dark-background w-full h-full z-20 rounded-tr-3xl rounded-tl-3xl md:rounded-none md:border-r border-light-secondaryText dark:border-dark-secondaryText ring-1 ring-light-secondaryText dark:ring-dark-secondaryBackground md:ring-0 backdrop-blur-3xl md:backdrop-blur-none shadow-2xl shadow-blue-100 md:shadow-none">
        <div className="w-full h-full flex flex-col items-center justify-between mx-auto p-4">
          <Link
            to={"/"}
            className="w-full hidden md:flex items-center md:justify-center lg:justify-start md:mt-8 lg:ml-24"
          >
            <img
              src={logo}
              className="md:h-14 lg:h-24 rounded-full object-cover"
              alt="Logo"
            />
          </Link>
          <ul className="w-full md:min-h-80 h-full flex md:flex-col items-center justify-between md:justify-start md:mt-20 lg:ml-24 md:gap-14 lg:gap-5 order-1 font-medium">
            <li className="w-full lg:flex items-center">
              <Link to={"/"} className="flex justify-center items-center gap-2">
                {pathname == "/" ? (
                  <HomeSolid className="size-7 text-button-default hover:text-button-hover" />
                ) : (
                  <HomeIcon className="size-6 text-button-default hover:text-button-hover" />
                )}
                <p
                  className={`hidden lg:block ${
                    pathname == "/" ? "text-3xl" : "text-2xl"
                  } font-bold text-light-primaryText hover:text-button-hover dark:text-dark-primaryText dark:hover:text-button-hover`}
                >
                  Home
                </p>
              </Link>
            </li>
            <li className="w-full lg:flex items-center">
              <Link
                to={`/user/${
                  authUserData?.userName
                    ? authUserData?.userName
                    : authUserData.data?.userName
                }`}
                className="flex justify-center items-center gap-2"
              >
                {pathname ==
                `/user/${
                  authUserData?.userName
                    ? authUserData?.userName
                    : authUserData.data?.userName
                }` ? (
                  <UserSolid className="size-7 text-button-default hover:text-button-hover" />
                ) : (
                  <UserIcon className="size-6 text-button-default hover:text-button-hover" />
                )}
                <p
                  className={`hidden lg:block ${
                    pathname ==
                    `/user/${
                      authUserData?.userName
                        ? authUserData?.userName
                        : authUserData.data?.userName
                    }`
                      ? "text-3xl"
                      : "text-2xl"
                  } font-bold text-light-primaryText hover:text-button-hover dark:text-dark-primaryText dark:hover:text-button-hover`}
                >
                  Profile
                </p>
              </Link>
            </li>
            <li className="w-full lg:flex items-center">
              <Link
                to={"/search"}
                className="flex justify-center items-center gap-2"
              >
                {pathname == "/search" ? (
                  <MagnifyingGlassSolid className="size-7 text-button-default hover:text-button-hover" />
                ) : (
                  <MagnifyingGlassIcon className="size-6 text-button-default hover:text-button-hover" />
                )}
                <p
                  className={`hidden lg:block ${
                    pathname == "/search" ? "text-3xl" : "text-2xl"
                  } font-bold text-light-primaryText hover:text-button-hover dark:text-dark-primaryText dark:hover:text-button-hover`}
                >
                  Search
                </p>
              </Link>
            </li>
            <li className="w-full lg:flex items-center">
              <Link
                to={"/notfication"}
                className="flex justify-center items-center gap-2"
              >
                {pathname == "/notfication" ? (
                  <BellSolid className="size-7 text-button-default hover:text-button-hover" />
                ) : (
                  <div className="relative">
                    <BellIcon className="size-6 text-button-default hover:text-button-hover" />
                    {hasNewNotifications && (
                      <span className="absolute -top-1 -right-0 size-3 rounded-full bg-light-secondaryText dark:bg-dark-secondaryText"></span>
                    )}
                  </div>
                )}
                <p
                  className={`hidden lg:block ${
                    pathname == "/notfication" ? "text-3xl" : "text-2xl"
                  } font-bold text-light-primaryText hover:text-button-hover dark:text-dark-primaryText dark:hover:text-button-hover`}
                >
                  Notifications
                </p>
              </Link>
            </li>
          </ul>
          <div className="hidden mb-4 lg:flex flex-col gap-4 order-2 w-3/4">
            {/* <DefaultButton label={"Dark Mode"} /> */}
            <DefaultButton
              label={darkMode ? "Light Mode" : "Dark Mode"}
              Icon={darkMode ? SunIcon : MoonIcon}
              onClick={() => changeTheme()}
            />
            <ErrorButton
              label="Sign Out"
              Icon={ArrowLeftStartOnRectangleIcon}
              onClick={() => handleLogout()}
            />
          </div>
          <div className="w-full hidden md:flex mb-8 lg:hidden flex-col gap-8 order-2">
            <button
              type="button"
              className="mx-auto p-2 text-dark-primaryText bg-button-default hover:bg-button-hover rounded-full"
              onClick={() => changeTheme()}
            >
              {darkMode ? (
                <SunIcon className="size-6" />
              ) : (
                <MoonIcon className="size-6" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleLogout()}
              className="mx-auto p-2 text-dark-primaryText bg-button-error hover:bg-red-800 rounded-full"
            >
              <ArrowLeftStartOnRectangleIcon className="size-6" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
