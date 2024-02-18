import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comment } from "../components/comment";
import { useNavigate, useParams } from "react-router-dom";
import { getUserPostsListing } from "../store/postsSlice";
import PostLoaders from "../components/postLoaders";

function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const mode = useSelector((state) => state.theme);
  const { isLoadingUserPostsListing, userPostsListing } = useSelector(
    (state) => state.posts
  );
  const [showComments, setShowCmnt] = useState(false);
  useEffect(() => {
    dispatch(getUserPostsListing(id));
  }, [dispatch, id]);
  if (user._id === id) {
    navigate("/profile");
    return;
  }
  const blogs = userPostsListing
    .filter((blog) => !blog.private)
    .map((blog) => {
      return (
        <section key={blog._id} className="post one dark:bg-gray-800">
          <div className="relative flex justify-between items-center">
            <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-300">
              {formatDistanceToNow(new Date(blog.createdAt), {
                addSuffix: true,
              })}
            </span>
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
                    className="w-5 h-5 hover:cursor-pointer"
                  />
                ) : (
                  <img
                    src={
                      showComments
                        ? "./imgs/up-arrow-light.png"
                        : "./imgs/arrow-light.png"
                    }
                    alt=""
                    className="w-5 h-5 hover:cursor-pointer"
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
                          key={ele._id}
                          {...ele}
                          postId={blog._id}
                          isLoved={blog.ifCommentsEnabaled}
                          author={blog.userId === ele.userId ? "true" : "false"}
                        />
                      ))}
                    {blog.comments
                      .filter((comment) => !comment.pinned)
                      .map((ele) => (
                        <Comment
                          key={ele._id}
                          {...ele}
                          postId={blog._id}
                          isLoved={blog.ifCommentsEnabaled}
                          author={blog.userId === ele.userId ? "true" : "false"}
                        />
                      ))}
                  </>
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
    <>
      {isLoadingUserPostsListing ? (
        <PostLoaders />
      ) : (
        <div className="w-full flex flex-col bg-white dark:bg-gray-900">
          {/* <img className='' src="" alt="backGround" /> */}
          <div className="relative bg-green-400 w-full h-40 shadow-sm text-green-400">
            {/* <img src="" alt="profile_pic" /> */}
            <div className="dark:bg-gray-800 dark:text-gray-500 absolute -bottom-16 left-6 profile-pic rounded-full bg-white mx-5 w-40 h-40 shadow-lg"></div>
          </div>
          {blogs.length > 0 ? (
            <div className="bg-white flex flex-col items-center w-2/3 m-auto py-20 gap-y-7 dark:bg-gray-800">
              <h1 className="text-green-500 text-2xl font-bold italic">
                All Blogs
              </h1>
              <div className="border-2 border-gray-200">{blogs}</div>
            </div>
          ) : (
            <div className="flex gap-y-5 flex-col justify-center items-center h-screen">
              <span className="text-green-500 font-bold text-2xl ">
                No blogs avaibale
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default UserProfile;
