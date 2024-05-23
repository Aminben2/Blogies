import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/usersSlice";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

function OneLatestBlog({
  createdAt,
  userId,
  title,
  content,
  setShowLogin,
  image,
}) {
  const user = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch, userId]);

  const navv = () => {
    if (user) {
      navigate("/blogs");
    } else {
      setShowLogin();
    }
  };
  return (
    <div
      onClick={navv}
      className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group"
    >
      <img
        src={"http://localhost:4000/uploads/" + image[0]}
        className="w-full h-96 object-cover"
      />
      <div className="p-6 absolute bottom-0 left-0 right-0 bg-white opacity-90 dark:bg-gray-300">
        <span className="text-sm block text-gray-600 mb-2 dark:text-gray-700">
          {createdAt
            ? formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
              })
            : "Just now"}{" "}
          | BY {userData.firstName + " " + userData.lastName}
        </span>
        <h3 className="text-xl font-bold text-[#333] dark:text-black">
          {title}
        </h3>
        <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
          <p className="text-gray-600 text-sm dark:text-black">{content}</p>
        </div>
      </div>
    </div>
  );
}

export default OneLatestBlog;
