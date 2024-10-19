/* eslint-disable react/prop-types */
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  SunIcon,
  MoonIcon,
  ArrowLeftStartOnRectangleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { toggleTheme } from "../store/themeSlice";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import { fetchPosts } from "../store/postSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";

function CreatePost({ profileImg }) {
  const theme = useSelector((state) => state.theme.theme);
  const darkMode = theme === "dark";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [postBody, setPostBody] = useState("");
  const [postCreation, setPostCreation] = useState("false");

  useEffect(() => {
    setPostCreation(false);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPostCreation(true);

    try {
      const postData = new FormData();

      postData.append("postBody", postBody);
      if (image) {
        postData.append("image", image);
      }

      const res = await api.post("posts", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPostBody("");
      setImage(null);
      dispatch(fetchPosts());
    } catch (error) {
      toast.error(`Failed to create post! ${error}`);
    } finally {
      setPostCreation(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Mobile Dark Toggle & Sign out */}
      <div className=" w-full bg-dark-secondaryBackground md:hidden flex justify-between items-center py-2 px-4">
        <img src={logo} className="h-14 rounded-full object-cover" alt="Logo" />
        <div className="flex justify-center items-center gap-5">
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
      {/* Create Post Form */}
      <form className="mt-6 mx-6" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex items-center justify-center gap-4">
          <img
            src={profileImg}
            className="h-14 rounded-full object-cover"
            alt="UserImg"
          />
          <input
            type="text"
            name="postBody"
            id="postBody"
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            className="w-full block py-2.5 text-light-primaryText bg-transparent border-0 border-b-2 border-light-secondaryText appearance-none dark:text-dark-primaryText dark:border-dark-secondaryText dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600"
            placeholder="What's Happening?"
          />
        </div>
        {image && (
          <div className="relative w-full h-96 pt-6">
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-full object-cover"
              alt="postImg"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-8 right-2 bg-red-500 text-white rounded-full px-2 hover:bg-red-600"
            >
              &times;
            </button>
          </div>
        )}

        <div className="mb-6 flex justify-between items-end">
          <label className="mt-6 ml-3 mr-6 flex justify-center items-center gap-2">
            <PhotoIcon className="size-7 text-button-default hover:text-button-hover" />
            <p className="text-light-primaryText hover:text-button-hover dark:text-dark-primaryText dark:hover:text-button-hover">
              {image ? image.name : "Upload Photo"}
            </p>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              hidden
            />
          </label>
          <button
            type="submit"
            className="font-semibold rounded-3xl text-sm px-6 py-2 text-center text-dark-primaryText bg-button-default hover:bg-button-hover"
          >
            {postCreation ? <LoadingSpinner size="sm" /> : "Post"}
          </button>
        </div>
      </form>
    </>
  );
}

export default CreatePost;
