import { useDispatch, useSelector } from "react-redux";
import { addReaction } from "../store/postsSlice";

const ReactionBar = ({ post }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  const reactions = [
    { name: "like", emoji: "👍🏼" },
    { name: "wow", emoji: "😮" },
    { name: "care", emoji: "🥰" },
    { name: "love", emoji: "💖" },
  ];

  const react = async (reactObj) => {
    if (!user) {
      return;
    }
    const response = await fetch("http://localhost:4000/api/blogs/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(reactObj),
    });

    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      console.log(json.error);
    }
  };

  const reactionButtons = reactions.map((ele) => {
    return (
      <button
        className="react dark:text-gray-100 dark:active:bg-gray-500"
        key={ele.name}
        onClick={() => {
          const re = react({ postId: post._id, reaction: ele.name });
          if (re)
            dispatch(addReaction({ postId: post._id, reaction: ele.name }));
        }}
      >
        {ele.emoji}
        {post.reactions[ele.name]}
      </button>
    );
  });
  return <div className="reactions">{reactionButtons}</div>;
};

export default ReactionBar;
