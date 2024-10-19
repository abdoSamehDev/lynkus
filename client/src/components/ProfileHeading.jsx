/* eslint-disable react/prop-types */
import { DefaultButton, ErrorButton } from "./Buttons";
import {
  LinkIcon,
  LinkSlashIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Avatar } from "flowbite-react";
import { capitalizeName, formatImageUrl } from "../utils/helpers";
import { useDispatch } from "react-redux";
import { fetchUserData, getUserData, toggleFollow } from "../store/userSlice";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

function ProfileHeading({
  isOwnProfile,
  initiateDelModal,
  initiateEditModal,
  userData,
  loading,
}) {
  const dispatch = useDispatch();
  const headerImg = formatImageUrl(
    userData?.data?.headerImg || userData?.headerImg,
    "headerImg"
  );
  const profileImg = formatImageUrl(
    userData?.data?.profileImg || userData?.profileImg,
    "profileImg"
  );
  const [isFollowed, setIsFollowed] = useState(userData?.isFollowing);
  const [followLoading, setFollowLoading] = useState(false);

  return (
    <div className="w-full min-h-[300px] md:min-h-[450px] pb-[30px] bg-light-secondaryBackground dark:bg-dark-secondaryBackground">
      {/* AVATAR AND HEADER */}
      <div className="w-full h-[140px] md:h-[310px]">
        {/* HEADER */}
        <div className="w-full h-[125px] md:h-[280px] bg-light-accent dark:bg-dark-accent">
          <img
            alt="header-image"
            src={`${
              headerImg
                ? headerImg
                : "https://placeholder.pics/svg/700/DEDEDE/DEDEDE/"
            }`}
            className="object-cover w-full h-full"
          />

          {/* AVATAR */}
        </div>
        <div className="relative ">
          <div className="absolute z-30 left-1/2 transform -translate-x-1/2 -bottom-12 md:-bottom-16 size-[90px] md:size-[150px] rounded-full border-4 border-light-accent dark:border-dark-accent flex items-center justify-center">
            <Avatar
              img={`${
                profileImg
                  ? profileImg
                  : `https://avatar.iran.liara.run/username?username=${
                      userData?.data?.name || userData?.name
                    }&background=008080&color=F0F8FF`
              }`}
              alt="user-avatar"
              rounded
              size="2xl"
              className="object-cover self-center items-center "
            />
          </div>
        </div>
      </div>
      {/* USER INFO AND ACTIONS */}
      <div className=" flex flex-col gap-[30px] mx-[50px]">
        <div className="flex justify-between items-center">
          {/* NAME AND USERNAME*/}
          <div className="flex flex-col w-2/5">
            <h2 className="font-bold text-2xl xl:text-3xl">
              {capitalizeName(userData?.data?.name) ||
                capitalizeName(userData?.name)}
            </h2>
            <p className="text-light-secondaryText dark:text-dark-secondaryText">
              @{userData?.data?.userName || userData?.userName}
            </p>
          </div>
          {/* ACTIONS */}
          {isOwnProfile ? (
            <div className="flex flex-col  gap-[10px] ">
              <DefaultButton
                label="Edit Profile"
                Icon={PencilSquareIcon}
                onClick={initiateEditModal}
              />
              <ErrorButton
                label="Delete Profile"
                Icon={TrashIcon}
                onClick={initiateDelModal}
              />
            </div>
          ) : loading ? (
            <div className="w-full h-full flex items-center justify-center md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar text-light-primaryText dark:text-dark-primaryText opacity-80">
              Loading...
            </div>
          ) : (
            <div className="flex flex-col gap-[10px] ">
              {followLoading ? (
                <LoadingSpinner />
              ) : (
                <DefaultButton
                  Icon={
                    userData?.isFollowing || isFollowed
                      ? LinkSlashIcon
                      : LinkIcon
                  }
                  label={
                    userData?.isFollowing || isFollowed ? "Unlink" : "Link"
                  }
                  onClick={async () => {
                    setFollowLoading(true);
                    await dispatch(
                      toggleFollow(userData?.data?.id || userData?.id)
                    ).unwrap();
                    await dispatch(
                      fetchUserData(userData?.data?.id || userData?.id)
                    ).unwrap();

                    await dispatch(
                      getUserData(
                        userData?.data?.userName || userData?.userName
                      )
                    ).unwrap();
                    setIsFollowed(!userData?.isFollowing);
                    setFollowLoading(false);
                  }}
                />
              )}
            </div>
          )}
        </div>
        {/* BIO */}
        <p className="text-sm">{userData?.data?.bio || userData?.bio}</p>
      </div>
    </div>
  );
}

export default ProfileHeading;
