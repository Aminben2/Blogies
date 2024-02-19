import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AuthorPost from "../components/authorPost";
import { Comment } from "../components/comment";
import OnePostLoader from "../components/onePostLoader";
import { addComment, getOnePost } from "../store/postsSlice";
import ImageLoader from "../components/ImageLoader";

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
    const pinnedComments = onePost.comments.filter((comment) => comment.pinned);
    const nonPinnedComments = onePost.comments.filter(
      (comment) => !comment.pinned
    );
    postComments = [
      ...pinnedComments.map((ele) => (
        <Comment
          key={ele._id}
          {...ele}
          author={user._id === ele.userId ? "true" : "false"}
        />
      )),
      ...nonPinnedComments.map((ele) => (
        <Comment
          key={ele._id}
          {...ele}
          author={user._id === ele.userId ? "true" : "false"}
        />
      )),
    ];
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
      comment,
      userId: user._id,
    };

    const response = await fetch(`http://localhost:4000/api/blogs/${id}`, {
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

          {onePost.image === undefined ? (
            <ImageLoader />
          ) : (
            <img
              src={"http://localhost:4000/uploads/" + onePost.image[0]}
              className="post-img"
              alt="pic"
            />
          )}
          <h1 className="post-title text-xl text-green-500 dark:text-green-400">
            {onePost.title}
          </h1>
          <p className="post-content font-bold dark:text-gray-200">
            {onePost.content}
          </p>
          <div className="author">
            <AuthorPost userId={onePost.userId} />
          </div>
          <div className="comments dark:bg-gray-600">
            <p className="dark:text-gray-100">
              {onePost.comments ? onePost.comments.length : "0"} Comments
            </p>
            <div className="all-comments">
              {postComments && postComments.length > 0 ? (
                postComments
              ) : (
                <span className="no-comments dark:text-gray-100 block text-center p-5">
                  No comments
                </span>
              )}
            </div>
            {onePost.ifCommentsEnabaled && (
              <form className="comment-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="comment"
                  placeholder="Leave your comment"
                  onChange={handleChange}
                  value={comment}
                  required
                  className="dark:bg-gray-500 border-0 outline outline-green-500 outline-0 
                  hover:outline-2 focus:outline-2 placeholder:text-gray-300 dark:text-gray-100"
                />
                <button type="submit">Comment</button>
                {error && <span className="err">{error}</span>}
              </form>
            )}
          </div>
        </section>
      )}
    </>
  );
};
