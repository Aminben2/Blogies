import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../store/usersSlice";

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { delComment, likeComment, unlikeComment } from "../store/postsSlice";
import { pinCom } from "../store/postsSlice";
import { apreCom } from "../store/postsSlice";
import { NavLink } from "react-router-dom";
import Replies from "./Replies/Replies";

export const Comment = (props) => {
  const { users } = useSelector((state) => state.users);
  const [showCommentControls, setShowCommentControls] = useState(false);
  const user = useSelector((state) => state.auth);
  const [userLoved, setUserLoved] = useState(null);
  const [showReplies, setShowReplies] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  const menuRef = useRef(null);
  useEffect(() => {
    let isLiked;
    if (!props.likes == 0) {
      isLiked = props.likes.find((l) => l.userId === user._id);
    }
    if (isLiked) setUserLoved(isLiked.userId);
  }, [props.likes, user]);

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
  const likeUnlike = async () => {
    const res = await fetch(
      `http://localhost:4000/api/blogs/${props.postId}/likeComment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: props.userId, commentId: props._id }),
      }
    );

    const data = await res.json();
    const cmnt = {
      commentId: props._id,
      userId: props.userId,
    };
    if (res.ok) {
      // Update the state
      if (userLoved) {
        dispatch(unlikeComment(cmnt));
        setUserLoved(null);
      } else {
        dispatch(likeComment(cmnt));
        setUserLoved(props.userId);
      }
    } else {
      console.log(data.error);
    }
  };

  const setRepState = () => {
    props.setCommentId(props._id);
    props.setReplyTo(props.userId);
    props.setRep();
    document.getElementById("commentInput").focus();
  };
  return (
    <>
      {userComment && (
        <div className="flex flex-col gap-1 w-2/3">
          <div className="py-3 mt-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-3 md:px-4 sm:rounded-lg sm:shadow-sm dark:bg-gray-400 dark:border-0 flex flex-col flex-grow">
            <div className="relative flex flex-row md-10 justify-between w-full">
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
                    {props.loved && (
                      <div className="loved">
                        <img
                          src="/imgs/loved.png"
                          alt="loved"
                          className={`w-4 ms-2 opacity-0 isLoved ${
                            props.loved && "opacity-100"
                          } `}
                        />
                      </div>
                    )}
                    {props.author && (
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
                  <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-black ">
                    {props.comment}
                  </div>
                </div>
              </div>
              {props.modify && (
                <div className="flex flex-col slef-end">
                  <span
                    onClick={(e) =>
                      setShowCommentControls((preState) => !preState)
                    }
                  >
                    <img
                      src="./imgs/menu.png"
                      className="w-9 cursor-pointer hover:bg-gray-200 rounded-full p-1 hover:transition-colors duration-100 dark:hover:bg-gray-300"
                      alt="CommentMenu"
                    />
                  </span>

                  <div className="flex items-center gap-2" onClick={likeUnlike}>
                    <img
                      className="w-5"
                      src={
                        userLoved
                          ? "../imgs/loved.png"
                          : "../imgs/darkHeart.png"
                      }
                      alt=""
                    />
                  </div>
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
              {!props.modify && (
                <div className="flex items-center gap-2" onClick={likeUnlike}>
                  <img
                    className="w-5"
                    src={
                      userLoved ? "../imgs/loved.png" : "../imgs/darkHeart.png"
                    }
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className="flex flex-row gap-4 items-center w-fit ml-16">
              <span className="text-sm text-gray-900">
                {props.likes ? props.likes.length : "0"} likes
              </span>
              <div
                onClick={setRepState}
                className=" cursor-pointer flex gap-1 text-sm items-center text-gray-900"
              >
                <svg
                  width="14px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="text-gray-900"
                >
                  <path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" />
                </svg>
                <span>reply</span>
              </div>
            </div>
          </div>
          {props.replies?.length >= 1 && (
            <div className="pl-6">
              <span
                className="font-bold text-sm cursor-pointer  dark:text-gray-100"
                onClick={() => setShowReplies((pre) => !pre)}
              >
                ---- {showReplies ? "hide" : "show"} replies (
                {props.replies?.length})
              </span>
            </div>
          )}
          {showReplies && (
            <Replies
              replies={props.replies}
              postId={props.postId}
              commentId={props._id}
            />
          )}
        </div>
      )}
    </>
  );
};
