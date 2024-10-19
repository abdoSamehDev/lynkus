import { useDispatch, useSelector } from "react-redux";
import NotificationItem from "../components/NotificationItem";
import {
  clearAllNotifications,
  clearNotification,
  getAllNotifications,
} from "../store/notificationSlice";
import { useEffect } from "react";
import LoadingPage from "./LoadingPage";
import { SecondaryErrorButton } from "../components/Buttons";
import { XMarkIcon } from "@heroicons/react/24/solid";
function NotificationsPage() {
  const dispatch = useDispatch();

  const { notifications, loading, err } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  return (
    <div className="w-full max-h-screen bg-light-background dark:bg-dark-background md:col-span-7 lg:col-span-4 overflow-y-auto hide-scrollbar text-light-primaryText dark:text-dark-primaryText">
      <div className="flex justify-between items-center mx-[30px] my-[25px] mb-[25px]">
        <h1 className="text-3xl font-bold text-light-primaryText dark:text-dark-primaryText">
          Notifications
        </h1>
        <SecondaryErrorButton
          label="Clear All"
          Icon={XMarkIcon}
          onClick={async () => {
            await dispatch(clearAllNotifications());
            await dispatch(getAllNotifications());
          }}
        />
      </div>

      {(loading || !notifications) && !err && (
        <div className="w-full h-full flex items-center justify-center text-light-primaryText dark:text-dark-primaryText opacity-80">
          <LoadingPage />
        </div>
      )}
      {err && (
        <div className="w-full h-full flex items-center justify-center text-light-primaryText dark:text-dark-primaryText opacity-80">
          Error: {err}
        </div>
      )}

      {notifications?.length == 0 && !loading && !err ? (
        <div className="w-full h-full flex items-center justify-center text-light-primaryText dark:text-dark-primaryText opacity-80">
          <p>You have no notifications yet!</p>
        </div>
      ) : (
        notifications?.map((notification, index) => {
          return (
            <NotificationItem
              key={index}
              from={notification.from.userName}
              read={notification.read}
              type={notification.type}
              delFunction={async () => {
                await dispatch(clearNotification(notification._id));
                await dispatch(getAllNotifications());
              }}
            />
          );
        })
      )}
    </div>
  );
}

export default NotificationsPage;
