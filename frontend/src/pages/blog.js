import { nanoid } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AuthorPost from "../components/authorPost";
import { Comment } from "../components/comment";
import OnePostLoader from "../components/onePostLoader";
import { addComment, getOnePost } from "../store/postsSlice";

export const Blog = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { onePost, isLoadigOnePost } = useSelector((state) => state.posts);

  React.useEffect(() => {
    dispatch(getOnePost(id));
  }, [id, dispatch]);

  const [comment, setComment] = React.useState("");
  const [error, setError] = React.useState("");

  let postComments = null;
  if (onePost && onePost.comments && onePost.comments.length > 0) {
    postComments = onePost.comments.map((ele) => {
      return <Comment key={ele.commentId} {...ele} />;
    });
  }

  const handleChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be loged in");
      return;
    }

    const commentObject = {
      commentId: nanoid(),
      comment,
      userId: user._id,
    };

    const response = await fetch(`/api/blogs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(commentObject),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError("");
      dispatch(
        addComment({
          postId: onePost._id,
          commentContent: comment,
          userId: user._id,
        })
      );
    }
    setComment("");
  };

  return (
    <>
      {isLoadigOnePost ? (
        <OnePostLoader />
      ) : (
        <section className="post one h-full dark:bg-gray-800">
          <Link className="go-back " to={"/blogs"}>
            &lt; See Other Blogs
          </Link>
          <img src={`.${onePost.img}`} className="post-img" alt="pic" />
          <h1 className="post-title text-xl text-green-500 dark:text-green-400">
            {onePost.title}
          </h1>
          <p className="post-content font-bold dark:text-gray-200">
            {onePost.content}
          </p>
          <div className="author">
            <AuthorPost userId={onePost.userId} />
            {/* <ReactionBar post={onePost} /> */}
          </div>
          <div className="comments dark:bg-gray-600">
            <p className="dark:text-gray-100">
              {onePost.comments ? onePost.comments.length : "0"} Comments
            </p>
            <div className="all-comments">
              {postComments && postComments.length > 0 ? (
                postComments
              ) : (
                <span className="no-comments dark:text-gray-100">
                  No Comments
                </span>
              )}
            </div>
            <form className="comment-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="comment"
                placeholder="Leave Your Comment"
                onChange={handleChange}
                value={comment}
                required
                className="dark:bg-gray-500 placeholder:text-gray-300 dark:text-gray-100"
              />
              <button type="submit">Comment</button>
              {error && <span className="err">{error}</span>}
            </form>
          </div>
        </section>
      )}
    </>
  );
};
