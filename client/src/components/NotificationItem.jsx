/* eslint-disable react/prop-types */
import { ChatBubbleOvalLeftIcon, LinkIcon } from "@heroicons/react/24/outline";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/solid";

function NotificationItem({ type, from, delFunction }) {
  return (
    <div className="w-full flex justify-between items-center px-[30px] py-[25px] border-t border-light-secondaryText dark:border-dark-secondaryText ">
      <div className="flex justify-start items-center gap-[15px] ">
        {type == "FOLLOW" ? (
          <LinkIcon className="size-[24px] xl:size-5  text-button-default" />
        ) : type == "LIKE" ? (
          <HeartIcon className="size-[24px] xl:size-5  text-button-default" />
        ) : (
          <ChatBubbleOvalLeftIcon className="size-[24px] xl:size-5  text-button-default" />
        )}
        <p className="text-[20px] md:text[24px]">
          <span className="font-bold text-light-secondaryText dark:text-dark-secondaryText">
            @{from}
          </span>{" "}
          {type == "FOLLOW"
            ? "has linked with you!"
            : type == "LIKE"
            ? "has liked your post!"
            : "has commented on your post!"}
        </p>
      </div>
      <div>
        <TrashIcon
          className="size-5 fill-button-error hover:opacity-80 cursor-pointer"
          onClick={delFunction}
        />
      </div>
    </div>
  );
}

export default NotificationItem;
