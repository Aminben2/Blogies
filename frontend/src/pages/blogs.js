import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import AuthorPost from "../components/authorPost";
import PostLoaders from "../components/postLoaders";
import ReactionBar from "../components/reactionBar";
import { getPosts } from "../store/postsSlice";
import { formatDistanceToNow } from "date-fns";
import Bar from "../components/Bar";

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const isDarkMode = useSelector((state) => state.theme);

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
          <h1 className="post-title text-green-500 dark:text-green-400 text-xl">
            {ele.title}
          </h1>
          <p className="post-content font-bold dark:text-gray-100">
            {ele.content}
          </p>
          <div className="author">
            <AuthorPost userId={ele.userId} />
            <Bar {...ele} />
          </div>
          <Link to={ele._id.toString()}>
            <div className="comments flex flex-row dark:bg-gray-600 ">
              <p className="dark:text-gray-100">
                {ele.comments ? ele.comments.length : "0"} Comments
              </p>
              <img
                src={
                  isDarkMode
                    ? "./imgs/commenter-light.png"
                    : "./imgs/commenter.png"
                }
                alt=""
              />
            </div>
          </Link>
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
