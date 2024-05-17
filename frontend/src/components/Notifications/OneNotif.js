import React from "react";
import { formatDistanceToNow } from "date-fns";
import { updateNotificationSeen } from "../../store/NotificationsSlice";
import { useDispatch, useSelector } from "react-redux";

function OneNotif({ _id, subject, title, seen, createdAt }) {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const markSeen = async () => {
    if (seen) return;
    const res = await fetch(
      "http://localhost:4000/api/notification/" + _id + "/markSeen",
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
      dispatch(updateNotificationSeen(_id));
    } else {
      console.log(dataRes.error);
    }
  };

  return (
    <li
      onClick={markSeen}
      className={`py-4 px-4 flex items-center relative hover:bg-green-50 ${
        !seen && "bg-green-50 hover:bg-green-100"
      } text-black text-sm cursor-pointer`}
    >
      {!seen && (
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
        </div>
      )}
      <img
        src="https://readymadeui.com/profile_2.webp"
        className="w-12 h-12 rounded-full shrink-0"
      />
      <div className="ml-6">
        <h3 className="text-sm text-[#333] font-semibold">{title}</h3>
        <p className="text-xs text-gray-400 mt-2">{subject}</p>
        <p className="text-xs text-green-600 leading-3 mt-2">
          {formatTimestamp(createdAt)}
        </p>
      </div>
    </li>
  );
}

export default OneNotif;
