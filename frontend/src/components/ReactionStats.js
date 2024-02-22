import React, { useState } from "react";

function ReactionStats({ id }) {
  const [reactions, setReactions] = useState([]);
  const getAllReactions = async () => {
    const res = await fetch(
      `http://localhost:4000/api/blogs/${id}/getAllReactions`
    );

    const data = await res.json();
    if (res.ok) {
      setReactions(data);
    } else {
      console.log(data.error);
    }
  };
  return <div className=""></div>;
}

export default ReactionStats;
