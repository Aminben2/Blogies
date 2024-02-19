import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactionButton from "./ReactionButton";
import { addReaction, removeReaction } from "../store/postsSlice";

const Bar = ({ _id, show }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [userReaction, setUserReaction] = useState(null);
  const [preReaction, setPreReaction] = useState(null);

  useEffect(() => {
    const getReactions = async () => {
      const res = await fetch(
        `http://localhost:4000/api/blogs/${_id}/reactions`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        if (data.reactions.length === 0) {
          setUserReaction(null);
        } else {
          const reactionObj = data.reactions.find((r) => r.userId === user._id);
          setUserReaction(reactionObj.reaction);
        }
      } else {
        console.log(data.error);
      }
    };
    getReactions();
  }, [_id, user._id, user.token, userReaction]);

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
      const isDone = await unReact({ userId: user._id, reaction: reaction });
      if (isDone) {
        setSelectedReaction(null);
        setUserReaction(null);
      }
    } else {
      // Otherwise, select the clicked reaction
      if (preReaction) {
        // If a previous reaction exists, undo it
        const isDoneUndo = await unReact(preReaction);
        if (isDoneUndo) {
          // After undoing the previous reaction, add the new one
          const isDoneAdd = await react({
            userId: user._id,
            reaction: reaction,
          });
          if (isDoneAdd) {
            setSelectedReaction(reaction);
            setUserReaction(reaction);
          }
        }
      } else {
        // If no previous reaction exists, simply add the new reaction
        const isDone = await react({ userId: user._id, reaction: reaction });
        if (isDone) {
          setSelectedReaction(reaction);
          setUserReaction(reaction);
        }
      }
    }
    // Set the previous reaction for future undo operation
    setPreReaction({ userId: user._id, reaction: reaction });
  };
  return (
    <div
      className={`absolute reactBar -top-9 left-0 flex m-1 items-center justify-between dark:bg-gray-500 w-fit rounded-lg py-1  px-3 shadow-lg gap-1 ${
        show && "opacity-100"
      } `}
    >
      <ReactionButton
        icon="like"
        onClick={() => handleReactionClick("like")}
        selected={selectedReaction === "like"}
        isLiked={userReaction === "like"}
      />
      <ReactionButton
        icon="love"
        onClick={() => handleReactionClick("love")}
        selected={selectedReaction === "love"}
        isLiked={userReaction === "love"}
      />
      <ReactionButton
        icon="care"
        onClick={() => handleReactionClick("care")}
        selected={selectedReaction === "care"}
        isLiked={userReaction === "care"}
      />
      <ReactionButton
        icon="wow"
        onClick={() => handleReactionClick("wow")}
        selected={selectedReaction === "wow"}
        isLiked={userReaction === "wow"}
      />
    </div>
  );
};

export default Bar;
