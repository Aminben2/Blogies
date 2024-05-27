import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function OneUserStat({ reaction, userId }) {
  const [user, setUser] = useState({});

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
          setUser(user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUserComment();
  }, [userId]);

  let reactionIcon = "";
  switch (reaction) {
    case "like":
      reactionIcon = "./imgs/like.png";
      break;
    case "love":
      reactionIcon = "./imgs/love.png";
      break;
    case "wow":
      reactionIcon = "./imgs/wow.png";
      break;
    case "care":
      reactionIcon = "./imgs/care.png";
      break;
    default:
      reactionIcon = "";
      break;
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <NavLink to={"/profile/" + userId}>
          <Avatar
            size="sm"
            cursor="pointer"
            name={user.username}
            src={"http://localhost:4000/uploads/" + user.img}
          />
        </NavLink>
        <div className="flex flex-col ">
          <span className="dark:text-gray-100 capitalize font-bold text-sm">
            {user.firstName + " " + user.lastName}
          </span>
          <span className="text-gray-700 text-xs">@{user.username}</span>
        </div>
      </div>
      <img className="w-6" src={reactionIcon} alt="..." />
    </div>
  );
}

export default OneUserStat;
