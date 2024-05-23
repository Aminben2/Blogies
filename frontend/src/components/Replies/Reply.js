import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getUser, getUsers } from "../../store/usersSlice";
import { likeReply, unlikeReply } from "../../store/postsSlice";

function Reply(props) {
  const { users, userData } = useSelector((state) => state.users);
  const user = useSelector((state) => state.auth);
  const [userLoved, setUserLoved] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getUser(props.replyTo));
  }, [dispatch, props.replyTo]);

  useEffect(() => {
    let isLiked;
    if (!props.likes == 0) {
      isLiked = props.likes.find((l) => l.userId === user._id);
    }
    if (isLiked) setUserLoved(isLiked.userId);
  }, [props.likes, user]);
  const handleLike = async () => {
    const data = {
      postId: props.postId,
      commentId: props.commentId,
      replyId: props._id,
    };
    try {
      const response = await fetch(
        `http://localhost:4000/api/blogs/${props.postId}/comments/${props.commentId}/replies/${props._id}/like`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        if (userLoved) {
          dispatch(unlikeReply(data));
          setUserLoved(null);
        } else {
          dispatch(likeReply(data));
          setUserLoved(props.userId);
        }
      }
    } catch (error) {
      console.error("Error liking/unliking reply:", error);
    }
  };

  const userComment = users.find((user) => user._id === props.userId);

  return (
    <div className="py-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-3 md:px-4 sm:rounded-lg sm:shadow-sm  dark:bg-gray-400 dark:border-0 flex flex-col relative ">
      <div className="relative flex flex-row md-10 justify-between items-center">
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
        <div className="flex gap-2 cursor-pointer" onClick={handleLike}>
          <img
            className="w-5"
            src={userLoved ? "../imgs/loved.png" : "../imgs/darkHeart.png"}
            alt=""
          />
          <span className="text-sm text-gray-900">
            {props?.likes ? props.likes.length : "0"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Reply;
