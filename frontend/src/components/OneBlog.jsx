import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthorPost from "./authorPost";
import Bar from "./Bar";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { removePrevReaction } from "../store/postsSlice";

export default function OneBlog(props) {
  const dispatch = useDispatch();
  const [revealed, setRevealed] = useState(false);
  const [userReaction, setUserReaction] = useState("");
  const isDarkMode = useSelector((state) => state.theme);
  const { prevReactions } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.auth);

  const [reactions, setReactions] = useState([]);

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
        setReactions(data.reactions);
      } else {
        console.log(data.error);
      }
    };
    getReactions(props._id);
  }, [dispatch, props._id, setReactions, user]);
  useEffect(() => {
    const reactObj = prevReactions.find((r) => r.postId === props._id);
    if (reactObj) {
      setUserReaction(reactObj.reaction);
    } else {
      const reactObj = reactions.find((r) => r.userId === user._id);
      if (reactObj) {
        setUserReaction(reactObj.reaction);
      }
    }
  }, [prevReactions, props._id, user, reactions, userReaction]);

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
  console.log(userReaction);
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
      setUserReaction("");
      return json;
    } else {
      console.log(json.error);
    }
  };
  return (
    <section
      className="post border w-full border-green-500 dark:border-green-400"
      key={props._id}
    >
      <div className="w-full">
        <Link to={props._id.toString()}>
          <img
            src={"http://localhost:4000/uploads/" + props.image[0]}
            className="post-img transition-transform hover:scale-105 duration-200 w-full"
            alt="pic"
          />
        </Link>
      </div>
      <h1 className="post-title text-green-500 dark:text-green-400 text-xl first-letter:capitalize">
        {props.title}
      </h1>
      <p className="post-content font-bold dark:text-gray-100 first-letter:capitalize">
        {props.content}
      </p>
      <div className="author">
        <AuthorPost userId={props.userId} />
      </div>

      <div className="relative comments flex flex-row justify-center items-center dark:bg-gray-600 ">
        {revealed && (
          <Bar show={revealed} {...props} hideReactions={setRevealed} />
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
          to={props._id.toString()}
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
      <NavLink to={props._id}>
        <p className="dark:text-gray-100 font-thin text-sm px-1">
          See all {props.comments ? props.comments.length : "0"} Comments
        </p>
      </NavLink>
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
