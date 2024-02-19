import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import AuthorPost from "../components/authorPost";
import PostLoaders from "../components/postLoaders";
import { getPosts } from "../store/postsSlice";
import { formatDistanceToNow } from "date-fns";
import Bar from "../components/Bar";

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const isDarkMode = useSelector((state) => state.theme);
  const [revealed, setRevealed] = useState(false);

  let postsElements = posts
    .filter((ele) => !ele.private)
    .map((ele) => {
      return (
        <section
          className="post border w-full border-green-500 dark:border-green-400"
          key={ele._id}
        >
          <div className="w-full">
            <Link to={ele._id.toString()}>
              <img
                src={"http://localhost:4000/uploads/" + ele.image[0]}
                className="post-img transition-transform hover:scale-105 duration-200 w-full"
                alt="pic"
              />
            </Link>
          </div>
          <h1 className="post-title text-green-500 dark:text-green-400 text-xl first-letter:capitalize">
            {ele.title}
          </h1>
          <p className="post-content font-bold dark:text-gray-100 first-letter:capitalize">
            {ele.content}
          </p>
          <div className="author">
            <AuthorPost userId={ele.userId} />
          </div>
          <div className="relative comments flex flex-row justify-center items-center dark:bg-gray-600 ">
            {revealed && <Bar show={revealed} {...ele} />}

            <button
              className="flex justify-center items-center gap-1 font-bold dark:text-gray-100"
              onClick={() => setRevealed((pre) => !pre)}
            >
              <lord-icon
                src="https://cdn.lordicon.com/xyboiuok.json"
                trigger="hover"
                colors={isDarkMode ? "primary:#ffffff" : ""}
                style={{ width: "30px", height: "30px" }}
              ></lord-icon>
              <span>React</span>
            </button>

            <NavLink
              to={ele._id.toString()}
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
          <NavLink to={ele._id}>
            <p className="dark:text-gray-100 font-thin text-sm px-1">
              See all {ele.comments ? ele.comments.length : "0"} Comments
            </p>
          </NavLink>
          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-300">
            {ele.createdAt
              ? formatDistanceToNow(new Date(ele.createdAt), {
                  addSuffix: true,
                })
              : "Just now"}
          </span>
        </section>
      );
    });

  React.useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <div className="main dark:bg-gray-800 ">
      {isLoading ? (
        <PostLoaders />
      ) : postsElements.length > 0 ? (
        <div className="Posts-list w-full h-auto">{postsElements}</div>
      ) : (
        <div className="flex flex-col gap-5 justify-center items-center h-screen">
          <span className="text-3xl text-green-500">
            There's no blogs wait for updates :)
          </span>
          <button className="p-3 px-4 border-0 dark:bg-green-500 dark:text-gray-100 rounded-lg dark:hover:bg-green-700 duration-300 shadow-lg text-xl">
            <NavLink to="/addBlog"> Share Your Thoutghs</NavLink>
          </button>
        </div>
      )}
    </div>
  );
};

export default Blogs;
