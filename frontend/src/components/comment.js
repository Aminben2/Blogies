import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../store/usersSlice";

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { delComment } from "../store/postsSlice";

export const Comment = (props) => {
  const { users } = useSelector((state) => state.users);
  const [showCommentControls, setShowCommentControls] = useState(false);
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const userComment = users.find((user) => user._id === props.userId);

  const pin = () => {};

  const appreciate = () => {};
  const deleteComment = async (postId, commentId) => {
    const response = await fetch("api/profile/delComment", {
      method: "PATCH",
      body: JSON.stringify({ postId, commentId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch(delComment({ postId, commentId }));
    } else {
      console.log(json.error);
    }
  };

  return (
    <>
      {userComment && (
        <div className="cmnt w-fit py-4 mt-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm md:w-2/3 dark:bg-gray-400 dark:border-0">
          <div className="relative flex flex-row md-10">
            <img
              className="w-12 h-12 border-2 border-gray-300 rounded-full"
              alt="Anonymous's avatar"
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&faces=1&faceindex=1&facepad=2.5&w=500&h=500&q=80"
            />
            <div className="flex-col mt-1">
              <div className="flex items-center flex-1 px-4 font-bold leading-tight">
                {userComment.firstName} {userComment.lastName}
                <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-700">
                  {props.createdAt
                    ? formatDistanceToNow(new Date(props.createdAt), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </span>
              </div>
              <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600 dark:text-white">
                {props.comment}
              </div>
            </div>
            {props.modify && (
              <div className="absolute flex justify-between items-center right-0 ">
                <span
                  onClick={(e) =>
                    setShowCommentControls((preState) => !preState)
                  }
                  className="self-end"
                >
                  <img
                    src="./imgs/menu.png"
                    className="w-9 cursor-pointer hover:bg-gray-200 rounded-full p-1 hover:transition-colors duration-100 dark:hover:bg-gray-300"
                    alt="CommentMenu"
                  />
                </span>
                {showCommentControls && (
                  <ul
                    onMouseLeave={() => setShowCommentControls(false)}
                    className={`absolute flex flex-col transition gap-2 top-10 right-0 bg-gray-200 text-gray-800 p-2 rounded-md z-30 dark:bg-gray-300 duration-500 ctrl-comment`}
                  >
                    <li
                      className="cursor-pointer font-medium text-xs"
                      onClick={() =>
                        deleteComment(props.commentId, props.postId)
                      }
                    >
                      Delete
                    </li>
                    <li
                      className="cursor-pointer font-medium text-xs"
                      onClick={pin}
                    >
                      Pin{" "}
                    </li>
                    <li
                      className="cursor-pointer font-medium text-xs"
                      onClick={appreciate}
                    >
                      Appreciate
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
