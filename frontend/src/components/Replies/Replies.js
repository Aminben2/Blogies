import React from "react";
import Reply from "./Reply";

function Replies({ replies }) {
  return (
    <div className="flex flex-col gap-6 pl-12 rounded-lg flex-grow">
      {replies.map((rep) => (
        <Reply key={rep._id} {...rep} />
      ))}
    </div>
  );
}

export default Replies;
