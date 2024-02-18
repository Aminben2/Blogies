import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactionButton from "./ReactionButton";
import { addLikedPost, removeLikedPost } from "../store/likedPostsSlice";
import { addReaction, removeReaction } from "../store/postsSlice";

const Bar = ({ _id, reactions }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const likedPosts = useSelector((state) => state.likedPosts);
  const [isLiked, setIsLiked] = useState();
  const [preReaction, setPreReaction] = useState({});
  useEffect(() => {
    setIsLiked(likedPosts.includes(_id));
  }, [_id, likedPosts]);
  const react = async (reactObj) => {
    if (!user) {
      return;
    }
    const response = await fetch(
      `http://localhost:4000/api/blogs/${_id}/react`,
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
      dispatch(addReaction(reactObj));
      return json;
    } else {
      console.log(json.error);
    }
  };
  const unReact = async (reactObj) => {
    if (!user) {
      return;
    }
    const response = await fetch(
      `http://localhost:4000/api/blogs/${_id}/unReact`,
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
      dispatch(removeReaction(reactObj));
      return json;
    } else {
      console.log(json.error);
    }
  };
  const handleReactionClick = async (reaction) => {
    if (selectedReaction === reaction) {
      // If the same reaction is clicked again, deselect it
      const isDone = await unReact({ postId: _id, reaction: reaction });
      if (isDone) {
        setSelectedReaction(null);
        setIsLiked(false);
        dispatch(removeLikedPost(_id));
      }
    } else {
      // Otherwise, select the clicked reaction
      if (preReaction) {
        await unReact(preReaction);
      }
      const isDone = await react({ postId: _id, reaction: reaction });
      if (isDone) {
        setSelectedReaction(reaction);
        setIsLiked(true);
        dispatch(addLikedPost(_id));
      }
    }
    setPreReaction({ postId: _id, reaction: reaction });
  };
  return (
    <div className="flex items-center space-x-4">
      <ReactionButton
        icon="like"
        onClick={() => handleReactionClick("like")}
        selected={selectedReaction === "like"}
        isLiked={isLiked}
        num={reactions.like}
      />
      <ReactionButton
        icon="love"
        onClick={() => handleReactionClick("love")}
        selected={selectedReaction === "love"}
        isLiked={isLiked}
        num={reactions.love}
      />
      <ReactionButton
        icon="care"
        onClick={() => handleReactionClick("care")}
        selected={selectedReaction === "care"}
        isLiked={isLiked}
        num={reactions.care}
      />
      <ReactionButton
        icon="wow"
        onClick={() => handleReactionClick("wow")}
        selected={selectedReaction === "wow"}
        isLiked={isLiked}
        num={reactions.wow}
      />
    </div>
  );
};

export default Bar;
