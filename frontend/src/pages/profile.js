import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePrivacy,
  deleteUserPost,
  getUserPosts,
} from "../store/postsSlice";
import { Comment } from "../components/comment";
import { formatDistanceToNow } from "date-fns";
import { NavLink } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.auth);
  const posts = useSelector((state) => state.posts.userPosts);
  const mode = useSelector((state) => state.theme);
  const [activeBlog, setActiveBlog] = useState("");
  const [showComments, setShowCmnt] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showConfimrModel, setShowConfirmModel] = useState(false);
  const [privacyUpdate, setPrivacyUpdate] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserPosts());
  }, [dispatch]);
  const updatePrivacy = async (obj) => {
    const response = await fetch(`http://localhost:4000/api/profile/privacy`, {
      method: "PATCH",
      body: JSON.stringify(obj.privacy),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      // update the state
      dispatch(changePrivacy(obj.privacy));
    }
    if (!response.ok) {
      console.log(json.error);
    }
  };

  const ConfirmDeleteBlog = (id) => {
    setShowConfirmModel(true);
    setActiveBlog(id);
  };

  const deleteBlog = async (id) => {
    const response = await fetch(`http://localhost:4000/api/profile/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      // delete the blog from the state
      dispatch(deleteUserPost({ postId: id }));
      setShowConfirmModel(false);
    }
    if (!response.ok) {
      // show the error
      console.log(json.error);
    }
  };

  const editBlog = async () => {};

  const blogs = posts.map((blog) => {
    return (
      <section key={blog._id} className="post one dark:bg-gray-800 relative">
        {showConfimrModel && blog._id === activeBlog && (
          <div className="flex flex-col p-8 bg-gray-700 shadow-md hover:shodow-lg rounded-2xl">
            <div className="flex items-center justify-between ">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 rounded-2xl p-3 border border-blue-100 text-blue-400 bg-blue-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div className="flex flex-col ml-3">
                  <div className="font-medium leading-none">
                    Delete Your Blog ?
                  </div>
                  <p className="text-sm text-gray-600 leading-none mt-1 dark:text-gray-100">
                    By deleting your account you will lose your all data
                  </p>
                </div>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="flex-no-shrink bg-red-500 px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 text-white rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="relative flex justify-between items-center">
          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-300">
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </span>

          <span
            onClick={() => setShowControls((pre) => !pre)}
            className="self-end "
          >
            <img
              src={mode ? "./imgs/menu-light.png" : "./imgs/menu.png"}
              className="w-9 cursor-pointer dark:hover:bg-gray-700  hover:bg-gray-200 rounded-full p-1 hover:transition-colors duration-100"
              alt="menu"
            />
          </span>

          <ul
            onMouseLeave={() => setShowControls(false)}
            className={`blog-controls absolute opacity-0 ${
              showControls && "opacity-100"
            } flex flex-col  gap-2 top-10 right-0 bg-gray-200 dark:bg-gray-700 text-gray-800 p-2 rounded-md  dark:text-white`}
          >
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={() => ConfirmDeleteBlog(blog._id)}
            >
              Delete blog
            </li>
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={editBlog}
            >
              / Edit blog
            </li>
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={() => setPrivacyUpdate(true)}
            >
              Change blog privacy
              {privacyUpdate && (
                <ul className="flex flex-col gap-1 p-2 justify-center bg-gray-300 text-gray-800  rounded-md dark:bg-gray-700 dark:text-white">
                  <li
                    onClick={() =>
                      updatePrivacy({ private: true, postId: blog._id })
                    }
                    className={`dark:bg-gray-600 cursor-pointer font-sm text-xs ${
                      blog.private && "font-bold dark:bg-gray-400"
                    }`}
                  >
                    For my self
                  </li>
                  <li
                    onClick={() =>
                      updatePrivacy({ private: false, postId: blog._id })
                    }
                    className={`dark:bg-gray-600 cursor-pointer font-sm text-xs ${
                      !blog.private && "font-bold dark:bg-gray-400"
                    }`}
                  >
                    Public
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <img src={`.${blog.img}`} className="post-img shadow" alt="pic" />
        <h1 className="post-title text-xl text-green-500 dark:text-green-400">
          {blog.title}
        </h1>
        <p className="post-content font-bold dark:text-gray-200">
          {blog.content}
        </p>
        <div className="comments flex flex-row dark:bg-gray-600 transition duration-300">
          <div
            className="flex flex-row justify-between"
            onClick={() => setShowCmnt((pre) => !pre)}
          >
            <p className="dark:text-gray-100">
              {blog.comments ? blog.comments.length : "0"} Comments
            </p>
            {!mode ? (
              <img
                src={showComments ? "./imgs/up-arrow.png" : "./imgs/arrow.png"}
                alt=""
                className="w-5 h-5"
              />
            ) : (
              <img
                src={
                  showComments
                    ? "./imgs/up-arrow-light.png"
                    : "./imgs/arrow-light.png"
                }
                alt=""
                className="w-5 h-5"
              />
            )}
          </div>

          {showComments && (
            <div className="all-comments">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((ele) => {
                  return (
                    <Comment
                      modify={true}
                      key={ele.commentId}
                      {...ele}
                      postId={blog._id}
                    />
                  );
                })
              ) : (
                <span className="no-comments dark:text-gray-100">
                  No Comments
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    );
  });

  return (
    <div className="w-full flex flex-col bg-white dark:bg-gray-900">
      {/* <img className='' src="" alt="backGround" /> */}
      <div className="relative bg-green-400 w-full h-40 shadow-sm text-green-400">
        {/* <img src="" alt="profile_pic" /> */}
        <div className="dark:bg-gray-800 dark:text-gray-500 absolute -bottom-16 left-6 profile-pic rounded-full bg-white mx-5 w-40 h-40 shadow-lg"></div>
        <NavLink
          title="Add a new blog"
          to="../addBlog"
          className=" absolute font-bold right-3 -bottom-6 profile-pic rounded p-4 bg-white mx-5   shadow-lg dark:bg-gray-800 dark:text-gray-100"
        >
          What is on your mind ?
        </NavLink>
      </div>
      {blogs.length > 0 ? (
        <div className="bg-white flex flex-col items-center w-2/3 m-auto py-20 gap-y-7 dark:bg-gray-800">
          <h1 className="text-green-500 text-2xl font-bold italic">
            Your Blogs
          </h1>
          <div className="border-2 border-gray-200">{blogs}</div>
        </div>
      ) : (
        <div className="flex gap-y-5 flex-col justify-center items-center h-full">
          <span className="text-green-500 font-bold text-2xl ">
            You have no blogs, Add some ?
          </span>
          <NavLink
            to="/addBlog"
            className="bg-green-500 p-2 px-10 text-gray-100 rounded-lg hover:bg-green-600 shadow-md font-bold italic"
          >
            here
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Profile;
