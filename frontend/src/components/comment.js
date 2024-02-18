import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../store/usersSlice";

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { delComment } from "../store/postsSlice";
import { pinCom } from "../store/postsSlice";
import { apreCom } from "../store/postsSlice";
import { NavLink } from "react-router-dom";

export const Comment = (props) => {
  const { users } = useSelector((state) => state.users);
  const [showCommentControls, setShowCommentControls] = useState(false);
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCommentControls(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userComment = users.find((user) => user._id === props.userId);

  const pinComment = async (commentId, postId) => {
    const res = await fetch(
      `http://localhost:4000/api/profile/${commentId}/pinComment`,
      {
        method: "PATCH",
        body: JSON.stringify({ commentId, postId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await res.json();

    if (res.ok) {
      // Update the state in redux
      dispatch(pinCom({ commentId, postId }));
      setShowCommentControls(false);
    } else {
      console.log(json.error);
    }
  };

  const appreciate = async (commentId, postId) => {
    const com = { postId, commentId };
    const response = await fetch(
      `http://localhost:4000/api/profile/${commentId}/apreciateComment`,
      {
        method: "PATCH",
        body: JSON.stringify(com),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch(apreCom(com));
      setShowCommentControls(false);
    } else {
      console.log(json.error);
    }
  };

  const deleteComment = async (commentId, postId) => {
    const com = { postId, commentId };
    const response = await fetch(
      `http://localhost:4000/api/profile/${commentId}/delComment`,
      {
        method: "PATCH",
        body: JSON.stringify(com),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch(delComment(com));
      setShowCommentControls(false);
    } else {
      console.log(json.error);
    }
  };

  return (
    <>
      {userComment && (
        <div className="cmnt w-fit py-4 mt-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm md:w-2/3 dark:bg-gray-400 dark:border-0">
          <div className="relative flex flex-row md-10">
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
                {props.loved && (
                  <div className="loved">
                    <img
                      src="/imgs/loved.png"
                      alt="loved"
                      className={`w-5 ms-2 opacity-0 isLoved ${
                        props.isLoved && "opacity-100"
                      } `}
                    />
                  </div>
                )}
                {props.author === "true" && (
                  <span className="ml-2 text-xs underline text-gray-500 dark:text-gray-900 font-bold">
                    Author
                  </span>
                )}
                {props.pinned && (
                  <div className="pinned">
                    <img
                      src="/imgs/pinned.png"
                      alt="onned-icon"
                      className="w-5 ms-2"
                    />
                  </div>
                )}
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
                    ref={menuRef}
                    onMouseLeave={() => setShowCommentControls(false)}
                    className={`absolute flex flex-col transition gap-2 top-10 right-0 bg-gray-200 text-gray-800 p-2 rounded-md z-30 dark:bg-gray-300 duration-500 ctrl-comment`}
                  >
                    <li
                      className="cursor-pointer font-medium text-xs"
                      onClick={() => deleteComment(props._id, props.postId)}
                    >
                      Delete
                    </li>
                    <li
                      className="cursor-pointer font-medium text-xs"
                      onClick={() => pinComment(props._id, props.postId)}
                    >
                      {props.pinned ? "Unpin" : "Pin"}
                    </li>
                    <li
                      className="cursor-pointer font-medium text-xs"
                      onClick={() => appreciate(props._id, props.postId)}
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
