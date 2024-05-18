import { formatDistanceToNow } from "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getUser, getUsers } from "../../store/usersSlice";

function Reply(props) {
  const { users, userData, isUserLoanding } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getUser(props.replyTo));
  }, [dispatch, props.replyTo]);
  const userComment = users.find((user) => user._id === props.userId);
  return (
    <div className="py-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-3 md:px-4 sm:rounded-lg sm:shadow-sm  dark:bg-gray-400 dark:border-0 flex flex-col relative ">
      <div className="relative flex flex-row md-10 justify-between">
        <div className="flex flex-row">
          <NavLink to={"/profile/" + props.userId}>
            <img
              className="w-12 h-12 border-2 border-gray-300 rounded-full"
              alt="Anonymous's avatar"
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&faces=1&faceindex=1&facepad=2.5&w=500&h=500&q=80"
            />
          </NavLink>
          <div className="flex-col mt-1">
            <div className="flex items-center flex-1 px-4 font-bold leading-tight">
              <NavLink to={"/profile/" + props.userId}>
                {userComment.firstName} {userComment.lastName}
              </NavLink>
              <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-700">
                {props.createdAt
                  ? formatDistanceToNow(new Date(props.createdAt), {
                      addSuffix: true,
                    })
                  : "Just now"}
              </span>
              {props.author && (
                <span className="ml-2 text-xs underline text-gray-500 dark:text-gray-900 font-bold">
                  Author
                </span>
              )}
            </div>
            <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-black">
              <span className="text-gray-900 font-bold">
                @{userData.username}
              </span>{" "}
              <span>{props.reply}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reply;
