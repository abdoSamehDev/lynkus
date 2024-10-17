import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setTheme } from "./store/themeSlice";
import PostDetailsPage from "./pages/PostDetailsPage.jsx";
import Welcome from "./pages/Welcome";
import Error from "./pages/Error";
import NotificationsPage from "./pages/NotificationsPage";
import usePeriodicFetch from "./hooks/usePeriodicFetch";
import { getAllNotifications } from "./store/notificationSlice";
import PrivateRouter from "./components/PrivateRouter";
import { fetchUserDataFromCookies } from "./store/userSlice";
import LoadingPage from "./pages/LoadingPage";
import { isAuthorized } from "./utils/checkAuth";

function App() {
  const dispatch = useDispatch();

  //Fetch notifications globally
  usePeriodicFetch(() => dispatch(getAllNotifications()), 300000);

  useEffect(() => {
    if (isAuthorized()) {
      console.log("WELCOEM WE ARE GETTING UR DATA...");

      dispatch(fetchUserDataFromCookies());
    }
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      dispatch(setTheme(storedTheme));
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(setTheme(systemTheme ? "dark" : "light"));
      document.documentElement.classList.toggle("dark", systemTheme);
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<Welcome />} /> */}
        <Route element={<Layout />}>
          <Route path="/post/:postId" element={<PostDetailsPage />} />
          <Route
            index
            element={
              <PrivateRouter>
                <HomePage />
              </PrivateRouter>
            }
          />
          <Route
            path="/user/:username"
            element={
              <PrivateRouter>
                <ProfilePage />
              </PrivateRouter>
            }
          />
          <Route
            path="/notfication"
            element={
              <PrivateRouter>
                <NotificationsPage />
              </PrivateRouter>
            }
          />
        </Route>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
