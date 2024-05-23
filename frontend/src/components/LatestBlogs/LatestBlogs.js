import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLatestPosts } from "../../store/postsSlice";
import OneLatestBlog from "./OneLatestBlog";

function LatestBlogs({ setShowLogin }) {
  const { latestPosts, isLatestPostsLoading } = useSelector(
    (state) => state.posts
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLatestPosts());
  }, [dispatch]);

  return (
    <div className="bg-white font-[sans-serif] dark:bg-gray-700 border-t py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#333] inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-green-600 after:rounded-full dark:text-gray-100">
            LATEST BLOGS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-md:max-w-lg mx-auto">
          {latestPosts.map((post) => (
            <OneLatestBlog
              key={post._id}
              title={post.title}
              content={post.content}
              createdAt={post.createdAt}
              userId={post.userId}
              setShowLogin={setShowLogin}
              image={post.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LatestBlogs;
