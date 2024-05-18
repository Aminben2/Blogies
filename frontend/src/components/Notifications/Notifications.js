import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllNotifications,
  getNotifications,
  updateAllNotificationsSeen,
} from "../../store/NotificationsSlice";
import OneNotif from "./OneNotif";
import InfoAlert from "../Alerts/InfoAlert";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const NotificationList = ({ show, setShow }) => {
  const { notifications, isLoanding } = useSelector(
    (state) => state.notifications
  );
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const clearAll = async () => {
    const res = await fetch("http://localhost:4000/api/notification", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const dataRes = await res.json();
    if (res.ok) {
      dispatch(deleteAllNotifications());
    } else {
      console.log(dataRes.error);
    }
  };

  const markSeenAll = async () => {
    const res = await fetch(
      "http://localhost:4000/api/notification/markAllSeen",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const dataRes = await res.json();
    if (res.ok) {
      dispatch(updateAllNotificationsSeen());
    } else {
      console.log(dataRes.error);
    }
  };
  return (
    <div className="absolute shadow-lg bg-white dark:bg-gray-700 py-2 z-[1000] min-w-full rounded-lg w-[410px] max-h-[500px] overflow-auto top-11 right-0">
      <div className="flex justify-between p-4 border-b border-b-gray-300 dark:border-b-gray-600">
        <h2 className="text-green-600 font-extrabold text-xl dark:text-green-500">Notifications</h2>
        <div
          className=" text-gray-900 text-right cursor-pointer dark:text-gray-100"
          onClick={() => setShow(false)}
        >
          <i className="fa-solid fa-x"></i>
        </div>
      </div>
      <div className="flex items-center justify-between my-4 px-4">
        <span
          onClick={clearAll}
          className="text-xs text-gray-900 cursor-pointer dark:text-gray-100"
        >
          Clear all
        </span>
        <span
          onClick={markSeenAll}
          className="text-xs text-gray-900 cursor-pointer dark:text-gray-100"
        >
          Mark all as read
        </span>
      </div>
      {notifications.length > 0 ? (
        <ul className="divide-y">
          {notifications
            .slice() // Create a shallow copy of the notifications array to avoid mutating the original array
            .sort((a, b) => {
              // Sort notifications by timestamp in descending order
              if (a.timestamp < b.timestamp) return 1;
              if (a.timestamp > b.timestamp) return -1;

              // If timestamps are equal, sort unseen notifications above seen notifications
              if (!a.seen && b.seen) return -1;
              if (a.seen && !b.seen) return 1;

              // If timestamps and seen statuses are equal, maintain the current order
              return 0;
            })
            .map((n) => (
              <OneNotif key={n._id} {...n} />
            ))}
        </ul>
      ) : (
        <ul className="divide-y">
          <InfoAlert msg={"No notifications"} />
        </ul>
      )}
      <Link className="text-sm px-4 mt-6 mb-4 inline-block text-gray-600 cursor-pointer dark:text-gray-100">
        View all Notifications
      </Link>
    </div>
  );
};

export default NotificationList;
