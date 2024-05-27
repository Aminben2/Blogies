import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { updateNotificationSeen } from "../../store/NotificationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, useToast } from "@chakra-ui/react";

function OneNotif({ _id, subject, title, seen, createdAt, userId }) {
  const user = useSelector((state) => state.auth);
  const toast = useToast();
  const [userNotif, setUserNotif] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserComment = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/users/oneUser/${userId}`
        );
        const user = await response.json();

        if (!response.ok) {
          console.log("Could NOT fetch user from api");
        } else {
          setUserNotif(user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUserComment();
  }, [userId]);
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
      toast({
        title: `All notifocations marked seen`,
        status: "success",
        isClosable: true,
      });
      dispatch(updateNotificationSeen(_id));
    } else {
      toast({
        title: `Someting went wrong`,
        status: "error",
        isClosable: true,
      });
      console.log(dataRes.error);
    }
  };

  return (
    <li
      onClick={markSeen}
      className={`py-4 border-none px-4 flex items-center relative hover:bg-green-50 dark:hover:bg-gray-800 ${
        !seen &&
        "bg-green-50 hover:bg-green-100 dark:bg-gray-700 dark:hover:bg-gray-800 "
      } text-black text-sm cursor-pointer`}
    >
      {!seen && (
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-green-600 rounded-full dark:bg-green-500"></div>
        </div>
      )}
      <Avatar
        size="md"
        cursor="pointer"
        name={userNotif.username}
        src={"http://localhost:4000/uploads/" + userNotif.img}
      />
      <div className="ml-6">
        <h3 className="text-sm text-[#333] font-semibold dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-300 mt-2">
          {subject}
        </p>
        <p className="text-xs text-green-600 leading-3 dark:text-green-500 mt-2">
          {formatTimestamp(createdAt)}
        </p>
      </div>
    </li>
  );
}

export default OneNotif;
