import React from "react";
import Reply from "./Reply";

function Replies({ replies, commentId, postId, modify }) {
  return (
    <div className="flex flex-col gap-2 pl-12 rounded-lg flex-grow">
      {replies.map((rep) => (
        <Reply
          key={rep._id}
          {...rep}
          commentId={commentId}
          postId={postId}
          modify={modify}
        />
      ))}
    </div>
  );
}

export default Replies;
