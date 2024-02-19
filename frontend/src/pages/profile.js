import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePrivacy,
  deleteUserPost,
  getUserPosts,
  toggleCmnts,
} from "../store/postsSlice";
import { Comment } from "../components/comment";
import { formatDistanceToNow } from "date-fns";
import { NavLink } from "react-router-dom";
import WarningModal from "../components/WaeningModal";
import UpdatePostForm from "../components/UpdatePostForm";
import AuthorPost from "../components/authorPost";
import Bar from "../components/Bar";

const Profile = () => {
  const user = useSelector((state) => state.auth);
  const posts = useSelector((state) => state.posts.userPosts);
  const mode = useSelector((state) => state.theme);
  const [activeBlog, setActiveBlog] = useState("");
  const [showComments, setShowCmnt] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showConfimrModel, setShowConfirmModel] = useState(false);
  const [privacyUpdate, setPrivacyUpdate] = useState(false);
  const [showEditBlogForm, setShowEditBlogForm] = useState(false);

  const dispatch = useDispatch();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowControls(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    dispatch(getUserPosts(user._id));
  }, [dispatch, user._id]);
  const updatePrivacy = async (obj) => {
    const response = await fetch(
      `http://localhost:4000/api/profile/${obj.postId}/privacy`,
      {
        method: "PATCH",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      // update the state
      dispatch(changePrivacy(obj));
      setPrivacyUpdate(false);
      setShowControls(false);
    }
    if (!response.ok) {
      console.log(json.error);
    }
  };

  const ConfirmDeleteBlog = (id) => {
    document.body.style.overflow = "hidden";
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
      document.body.style.overflow = "auto";
    }
    if (!response.ok) {
      // show the error
      console.log(json.error);
    }
  };

  const toggleComments = async (id) => {
    const res = await fetch(
      `http://localhost:4000/api/profile/${id}/toggleComments`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await res.json();
    if (res.ok) {
      // update the state
      dispatch(toggleCmnts({ id }));
      setShowControls(false);
      json ? setShowCmnt(true) : setShowCmnt(false);
    } else {
      console.log(json.error);
    }
  };

  const editBlog = async () => {};
  const closeAll = () => {
    setPrivacyUpdate(false);
    setShowControls(false);
  };
  const cancelDelete = () => {
    document.body.style.overflow = "auto";
    setShowConfirmModel(false);
  };

  const showPopUp = () => {
    setShowEditBlogForm(true);
    document.body.classList.add("overflow-hidden");
  };

  const blogs = posts.map((blog) => {
    return (
      <section key={blog._id} className="post one dark:bg-gray-800 relative">
        {showEditBlogForm && (
          <div className="fixed top-0 left-0 w-full h-full backdrop-blur z-50 "></div>
        )}
        {showConfimrModel && blog._id === activeBlog && (
          <WarningModal
            confirm={() => deleteBlog(blog._id)}
            cancel={cancelDelete}
          />
        )}
        {showEditBlogForm && (
          <UpdatePostForm
            fun={setShowEditBlogForm}
            handleEdit={editBlog}
            {...blog}
          />
        )}
        <div className="relative flex justify-between items-center">
          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-300">
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </span>

          <span
            onClick={() => setShowControls((pre) => !pre)}
            className="self-end"
          >
            <img
              src={mode ? "./imgs/menu-light.png" : "./imgs/menu.png"}
              className="w-9 cursor-pointer dark:hover:bg-gray-700  hover:bg-gray-200 rounded-full p-1 hover:transition-colors duration-100"
              alt="menu"
            />
          </span>

          <ul
            ref={menuRef}
            onMouseLeave={closeAll}
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
              onClick={showPopUp}
            >
              Edit blog
            </li>
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={() => toggleComments(blog._id)}
            >
              {blog.ifCommentsEnabaled ? "Disable comments" : "Enable comments"}
            </li>
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={() => setPrivacyUpdate((preState) => !preState)}
            >
              Change blog privacy
              {privacyUpdate && (
                <ul
                  onMouseLeave={() => setPrivacyUpdate(false)}
                  className={`update-controls flex flex-col ms-2 mt-1 justify-center text-gray-800  rounded-md  dark:text-white ${
                    privacyUpdate && "opacity-100"
                  }`}
                >
                  <li
                    onClick={() =>
                      updatePrivacy({ private: true, postId: blog._id })
                    }
                    className={`cursor-pointer font-sm text-xs ${
                      blog.private &&
                      "font-bold dark:bg-gray-400 px-2 rounded-sm"
                    }`}
                  >
                    For my self
                  </li>
                  <li
                    onClick={() =>
                      updatePrivacy({ private: false, postId: blog._id })
                    }
                    className={` cursor-pointer font-sm text-xs ${
                      !blog.private &&
                      "font-bold dark:bg-gray-400 px-2 rounded-sm"
                    }`}
                  >
                    Public
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <img
          src={"http://localhost:4000/uploads/" + blog.image}
          className="post-img shadow"
          alt="pic"
        />
        <h1 className="post-title text-xl text-green-500 dark:text-green-400">
          {blog.title}
        </h1>
        <p className="post-content font-bold dark:text-gray-200">
          {blog.content}
        </p>
        <div className="author">
          <AuthorPost userId={blog.userId} />
          <Bar {...blog} />
        </div>
        <div className="comments flex flex-row dark:bg-gray-600 transition duration-300">
          {blog.ifCommentsEnabaled ? (
            <div
              className="flex flex-row justify-between"
              onClick={() => setShowCmnt((pre) => !pre)}
            >
              <p className="dark:text-gray-100">
                {blog.comments ? blog.comments.length : "0"} Comments
              </p>
              {!mode ? (
                <img
                  src={
                    showComments ? "./imgs/up-arrow.png" : "./imgs/arrow.png"
                  }
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
          ) : (
            <div className="flex flex-row justify-between">
              <p className="dark:text-gray-100">Comments are disabled</p>
              {!mode ? (
                <img
                  src={
                    showComments ? "./imgs/up-arrow.png" : "./imgs/arrow.png"
                  }
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
          )}

          {showComments && (
            <div className="all-comments">
              {blog.comments && blog.comments.length > 0 ? (
                <>
                  {blog.comments
                    .filter((comment) => comment.pinned)
                    .map((ele) => (
                      <Comment
                        modify={true}
                        key={ele._id}
                        {...ele}
                        postId={blog._id}
                        author={user._id === ele.userId ? "true" : "false"}
                        isLoved={blog.ifCommentsEnabaled}
                      />
                    ))}
                  {blog.comments
                    .filter((comment) => !comment.pinned)
                    .map((ele) => (
                      <Comment
                        modify={true}
                        key={ele._id}
                        {...ele}
                        postId={blog._id}
                        author={user._id === ele.userId ? "true" : "false"}
                        isLoved={blog.ifCommentsEnabaled}
                      />
                    ))}
                </>
              ) : (
                <span className="no-comments dark:text-gray-100 text-center p-5 block">
                  No comments
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
        <div className="flex gap-y-5 flex-col justify-center items-center h-screen">
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
