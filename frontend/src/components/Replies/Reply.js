import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getUser, getUsers } from "../../store/usersSlice";
import {
  appReply,
  deleteReply,
  likeReply,
  unlikeReply,
} from "../../store/postsSlice";
import { Avatar, useToast } from "@chakra-ui/react";

function Reply(props) {
  const { users, userData } = useSelector((state) => state.users);
  const user = useSelector((state) => state.auth);
  const [userLoved, setUserLoved] = useState(null);
  const [showReplyControls, setShowReplyControls] = useState(false);
  const [commentingUser, setCommentingUser] = useState({});
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getUser(props.replyTo));
  }, [dispatch]);

  useEffect(() => {
    const fetchUserComment = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/users/oneUser/${props.userId}`
        );
        const user = await response.json();

        if (!response.ok) {
          console.log("Could NOT fetch user from api");
        } else {
          setCommentingUser(user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUserComment();
  }, [props.userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowReplyControls(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          toast({
            title: `Reply unliked`,
            status: "success",
            isClosable: true,
          });
        } else {
          dispatch(likeReply(data));
          setUserLoved(props.userId);
          toast({
            title: `Reply liked`,
            status: "success",
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error liking/unliking reply:", error);
      toast({
        title: `Someting went wrong`,
        status: "error",
        isClosable: true,
      });
    }
  };

  const deleteReplyy = async () => {
    const body = {
      postId: props.postId,
      commentId: props.commentId,
      replyId: props._id,
    };
    try {
      const response = await fetch(
        "http://localhost:4000/api/profile/deleteReply",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();

      if (response.ok) {
        dispatch(deleteReply(body));
        toast({
          title: `Reply deleted`,
          status: "success",
          isClosable: true,
        });
      } else {
        console.log(data.error);
        toast({
          title: `Someting went wrong`,
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const appreciateReply = async () => {
    const body = {
      postId: props.postId,
      commentId: props.commentId,
      replyId: props._id,
    };

    try {
      const response = await fetch(
        "http://localhost:4000/api/profile/appreciateReply",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();

      if (response.ok) {
        dispatch(appReply(body));
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error toggling reply loved field:", error);
    }
  };
  const userComment = users.find((user) => user._id === props.userId);
  return (
    <div className="py-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-3 md:px-4 sm:rounded-lg sm:shadow-sm  dark:bg-gray-400 dark:border-0 flex flex-col relative ">
      <div className="relative flex flex-row md-10 justify-between items-center">
        <div className="flex flex-row">
          <NavLink to={"/profile/" + props.userId}>
            <Avatar
              size="md"
              cursor="pointer"
              name={commentingUser.username}
              src={"http://localhost:4000/uploads/" + commentingUser.img}
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
            </div>
            <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-black">
              <span className="text-gray-900 font-bold">
                @{userData.username}
              </span>{" "}
              <span>{props.reply}</span>
            </div>
          </div>
        </div>
        {!props.modify ? (
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
        ) : (
          <div className="flex flex-col gap-1">
            <span
              onClick={(e) => setShowReplyControls((preState) => !preState)}
            >
              <img
                src="./imgs/menu.png"
                className="w-9 cursor-pointer hover:bg-gray-200 rounded-full p-1 hover:transition-colors duration-100 dark:hover:bg-gray-300"
                alt="CommentMenu"
              />
            </span>

            {showReplyControls && (
              <ul
                ref={menuRef}
                onMouseLeave={() => setShowReplyControls(false)}
                className={`absolute flex flex-col transition gap-2 top-10 right-0 bg-gray-200 text-gray-800 p-2 rounded-md z-30 dark:bg-gray-300 duration-500 ctrl-comment`}
              >
                <li
                  className="cursor-pointer font-medium text-xs"
                  onClick={deleteReplyy}
                >
                  Delete
                </li>
                <li
                  className="cursor-pointer font-medium text-xs"
                  onClick={appreciateReply}
                >
                  Appreciate
                </li>
              </ul>
            )}
            <span className="text-sm text-gray-900">
              {props?.likes ? props.likes.length : "0"} likes
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reply;
