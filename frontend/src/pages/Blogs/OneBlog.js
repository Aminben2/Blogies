import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthorPost from "../../components/authorPost";
import Bar from "../../components/Bar";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { removePrevReaction, removeReaction } from "../../store/postsSlice";
import { Avatar, useToast } from "@chakra-ui/react";
import ReactionStats from "../../components/ReactionStats/ReactionStats";

export default function OneBlog(props) {
  const dispatch = useDispatch();
  const [revealed, setRevealed] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  const isLongText = props.content.length > maxLength;
  const isDarkMode = useSelector((state) => state.theme);
  const { prevReactions } = useSelector((state) => state.posts);
  const [user1, setUser1] = useState({});
  const [showReactionStats, setShowReactionStats] = useState(false);

  const [commentingUser, setCommentingUser] = useState({});

  const user = useSelector((state) => state.auth);

  useEffect(() => {
    const getReactions = async (id) => {
      const res = await fetch(
        `http://localhost:4000/api/blogs/${id}/reactions`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const reactObj = data.reactions.find((r) => r.userId === user._id);
        if (reactObj) {
          setUserReaction(reactObj.reaction);
        }
      } else {
        console.log(data.error);
      }
    };
    getReactions(props._id);
  }, [dispatch, props._id, user]);

  useEffect(() => {
    const reactObj = prevReactions.find((r) => r.postId === props._id);
    if (reactObj) {
      setUserReaction(reactObj.reaction);
    }
  }, [prevReactions, props._id, user, userReaction]);

  let reactionStyle = "";
  let reactionIcon = "";
  switch (userReaction) {
    case "like":
      reactionStyle = "text-blue-500";
      reactionIcon = "./imgs/like.png";
      break;
    case "love":
      reactionStyle = "text-red-500";
      reactionIcon = "./imgs/love.png";
      break;
    case "wow":
      reactionStyle = "text-yellow-500";
      reactionIcon = "./imgs/wow.png";
      break;
    case "care":
      reactionStyle = "text-orange-500";
      reactionIcon = "./imgs/care.png";
      break;
    default:
      reactionStyle = "";
      break;
  }
  const toast = useToast();

  const unReact = async (reactObj) => {
    if (!user) {
      return;
    }
    const response = await fetch(
      `http://localhost:4000/api/blogs/${props._id}/unReact`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(reactObj),
      }
    );

    const json = await response.json();
    if (response.ok) {
      dispatch(removePrevReaction({ postId: props._id }));
      dispatch(removeReaction(reactObj));
      setUserReaction(null);
      toast({
        title: `Post Unreacted`,
        status: "success",
        isClosable: true,
      });
    } else {
      console.log(json.error);
      toast({
        title: `Someting went wrong`,
        status: "error",
        isClosable: true,
      });
    }
  };
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
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
  }, [dispatch, props.userId]);

  useEffect(() => {
    const fetchUserComment = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/users/oneUser/${props.reactions[0].userId}`
        );
        const user = await response.json();

        if (!response.ok) {
          console.log("Could NOT fetch user from api");
        } else {
          setUser1(user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (props.reactions.length >= 1) fetchUserComment();
  }, [props.reactions]);

  return (
    <section
      className="post border w-full border-green-500 dark:border-green-400"
      key={props._id}
    >
      {showReactionStats && (
        <ReactionStats
          reactions={props.reactions}
          setShow={() => setShowReactionStats(false)}
          show={showReactionStats}
        />
      )}
      <div className="flex gap-3">
        <NavLink to={"/profile/" + props.userId}>
          <Avatar
            size="md"
            cursor="pointer"
            name={commentingUser.username}
            src={"http://localhost:4000/uploads/" + commentingUser.img}
          />
        </NavLink>
        <div className="flex flex-col ">
          <span className="dark:text-gray-100 capitalize">
            {commentingUser.firstName + " " + commentingUser.lastName}
          </span>
          <span className="dark:text-gray-400">@{commentingUser.username}</span>
        </div>
      </div>
      <h1 className="text-green-500 dark:text-green-400 text-md first-letter:capitalize font-bold">
        {props.title}
      </h1>
      <p className="font-bold dark:text-gray-100 first-letter:capitalize px-3">
        {isExpanded
          ? props.content
          : `${props.content.substring(0, maxLength)}${
              isLongText ? "..." : ""
            }`}
        {isLongText && (
          <span
            onClick={handleToggle}
            className="text-blue-500 cursor-pointer text-sm ml-1"
          >
            {isExpanded ? "show less" : "show more"}
          </span>
        )}
      </p>
      <div className="w-[95%] m-auto mt-2">
        <Link to={props._id.toString()}>
          <img
            src={"http://localhost:4000/uploads/" + props.image[0]}
            className="post-img w-full"
            alt="pic"
          />
        </Link>
      </div>
      <div className="author">
        <AuthorPost userId={props.userId} />
      </div>
      <div className="">
        {props.reactions.length >= 1 && (
          <span
            className="dark:text-gray-300 font-bold text-sm tracking-tight cursor-pointer hover:underline hover:text-green-600"
            onClick={() => setShowReactionStats(true)}
          >
            {props.reactions.length > 1
              ? user1.username +
                " and " +
                props.reactions.length +
                " other peopole"
              : "Reacted by " + user1.username}
          </span>
        )}
        <div className="float-right">
          <NavLink to={props._id}>
            <p className="dark:text-gray-100 font-thin text-sm px-1 hover:underline hover:text-green-600">
              See all {props.comments ? props.comments.length : "0"} Comments
            </p>
          </NavLink>
        </div>
      </div>
      <div className="relative comments flex flex-row justify-center items-center dark:bg-gray-600 ">
        {revealed && (
          <Bar show={revealed} postId={props._id} hideReactions={setRevealed} />
        )}

        <button
          className="flex justify-center items-center gap-1 font-bold dark:text-gray-100"
          onClick={
            userReaction
              ? () => unReact({ userId: user._id, postId: props._id })
              : () => setRevealed((pre) => !pre)
          }
        >
          {userReaction ? (
            <img src={reactionIcon} alt="reactionIcon" className="w-7" />
          ) : (
            <lord-icon
              src="https://cdn.lordicon.com/xyboiuok.json"
              trigger="hover"
              colors={isDarkMode ? "primary:#ffffff" : ""}
              style={{ width: "30px", height: "30px" }}
            ></lord-icon>
          )}
          <span className={reactionStyle}>
            {userReaction ? userReaction : "React"}
          </span>
        </button>

        <NavLink
          to={"/blogs/" + props._id.toString()}
          className="flex items-center justify-center gap-1"
        >
          <span className="dark:text-gray-100 font-bold">Comment</span>
          <lord-icon
            src="https://cdn.lordicon.com/fdxqrdfe.json"
            trigger="hover"
            colors={isDarkMode && "primary:#ffffff"}
            style={{ width: "30px", height: "30px" }}
          ></lord-icon>
        </NavLink>
      </div>
      <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-300">
        {props.createdAt
          ? formatDistanceToNow(new Date(props.createdAt), {
              addSuffix: true,
            })
          : "Just now"}
      </span>
    </section>
  );
}
