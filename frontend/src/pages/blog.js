import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AuthorPost from "../components/authorPost";
import { Comment } from "../components/comment";
import OnePostLoader from "../components/loaders/onePostLoader";
import { addComment, addReply, getOnePost } from "../store/postsSlice";
import ImageLoader from "../components/loaders/ImageLoader";
import { getUser } from "../store/usersSlice";

export const Blog = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { onePost, isLoadigOnePost } = useSelector((state) => state.posts);
  const { userData, isUserIsLoading } = useSelector((state) => state.users);

  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [commentId, setCommentId] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [rep, setRep] = useState("");
  const [hashRep, setHashRep] = useState("");

  useEffect(() => {
    if (replyTo) {
      dispatch(getUser(replyTo));
    }
  }, [dispatch, replyTo]);

  useEffect(() => {
    if (userData && userData.username) {
      setHashRep("@" + userData.username);
    }
  }, [userData]);

  React.useEffect(() => {
    dispatch(getOnePost(id));
  }, [id, dispatch]);

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
          author={onePost.userId === ele.userId}
          postId={onePost._id}
          setRep={() => setIsReplying(true)}
          setCommentId={setCommentId}
          setReplyTo={setReplyTo}
          replyTo={replyTo}
        />
      )),
      ...nonPinnedComments.map((ele) => (
        <Comment
          key={ele._id}
          {...ele}
          author={onePost.userId === ele.userId}
          postId={onePost._id}
          setRep={() => setIsReplying(true)}
          setCommentId={setCommentId}
          setReplyTo={setReplyTo}
          replyTo={replyTo}
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
  const reply = async (e) => {
    e.preventDefault();
    const replyObj = {
      commentId,
      postId: onePost._id,
      reply: rep,
      replyTo,
    };
    const res = await fetch(`http://localhost:4000/api/blogs/addReply`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(replyObj),
    });
    const data = await res.json();

    if (res.ok) {
      dispatch(addReply({ userId: user._id, commentId, reply: rep, replyTo }));
      setRep("");
      setIsReplying(false);
      setReplyTo("");
      setCommentId("");
    } else {
      console.log(data.error);
    }
  };
  const handleBlur = () => {
    if (isReplying) {
      setRep("");
      setIsReplying(false);
      setReplyTo("");
      setCommentId("");
    }
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
              <form
                className="comment-form flex "
                onSubmit={isReplying ? reply : handleSubmit}
              >
                <div className="relative">
                  <input
                    id="commentInput"
                    type="text"
                    name="comment"
                    placeholder={isReplying ? "Reply..." : "Leave your comment"}
                    onChange={
                      isReplying ? (e) => setRep(e.target.value) : handleChange
                    }
                    onBlur={handleBlur}
                    value={isReplying ? rep : comment}
                    required
                    className="dark:bg-gray-500 bg-gray-50 focus:bg-white border-0 outline outline-none outline-0 
                  hover:outline-2 focus:outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-50 dark:text-gray-100 placeholder:text-sm"
                  />
                  {isReplying && !isUserIsLoading && (
                    <span className="absolute left-0 -top-3 bg-gray-300 px-1 rounded-lg text-sm">
                      replying on {hashRep}
                    </span>
                  )}
                </div>
                <button type="submit" className="w-32">
                  {isReplying ? "Reply" : "Comment"}
                </button>
                {error && <span className="err">{error}</span>}
              </form>
            )}
          </div>
        </section>
      )}
    </>
  );
};
