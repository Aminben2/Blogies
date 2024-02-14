import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthorPost from "../components/authorPost";
import PostLoaders from "../components/postLoaders";
import ReactionBar from "../components/reactionBar";
import { getPosts } from "../store/postsSlice";
import { formatDistanceToNow } from "date-fns";

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const isDarkMode = useSelector((state) => state.theme);

  let postsElements = posts
    .filter((ele) => !ele.private)
    .map((ele) => {
      return (
        <section
          className="post border border-green-500 dark:border-green-400"
          key={ele._id}
        >
          <Link to={ele._id.toString()}>
            <img
              src={ele.img}
              className="post-img transition-transform hover:scale-105 duration-200"
              alt="pic"
            />
          </Link>
          <h1 className="post-title text-green-500 dark:text-green-400 text-xl">
            {ele.title}
          </h1>
          <p className="post-content font-bold dark:text-gray-100">
            {ele.content}
          </p>
          <div className="author">
            <AuthorPost userId={ele.userId} />
            <ReactionBar post={ele} />
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
        <div className="Posts-list">{postsElements}</div>
      ) : (
        <div className="flex h-full justify-center items-center">
          <span className="text-3xl text-green-500">
            There's no blogs wait for updates :)
          </span>
        </div>
      )}
    </div>
  );
};

export default Blogs;
