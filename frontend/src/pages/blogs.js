import { useDispatch, useSelector } from "react-redux";
import PostLoaders from "../components/postLoaders";
import { getPosts } from "../store/postsSlice";
import OneBlog from "../components/OneBlog";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);

  let postsElements = posts
    .filter((ele) => !ele.private)
    .map((ele) => <OneBlog key={ele._id} {...ele} />);

  useEffect(() => {
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
