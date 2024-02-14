import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../store/postsSlice";
import { nanoid } from "@reduxjs/toolkit";

function AddPostFrom() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  let [postInfo, setPostInfo] = React.useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    let { value, name } = e.target;
    setPostInfo((preInfo) => {
      return {
        ...preInfo,
        [name]: value,
      };
    });
  }

  const canAddPost = Boolean(postInfo.title) && Boolean(postInfo.content);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be Loged in");
      return;
    }

    const blog = {
      title: postInfo.title,
      content: postInfo.content,
      userId: user._id,
      reactions: {
        like: 0,
        wow: 0,
        love: 0,
        care: 0,
      },
      img: "./imgs/blog-2.jpg",
      comments: [],
    };

    const response = await fetch("/api/blogs/addBlog", {
      method: "POST",
      body: JSON.stringify(blog),
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
        addPost({
          ...blog,
          _id: nanoid(),
        })
      );
    }

    setPostInfo({
      title: "",
      content: "",
      userId: "",
    });
  };

  <div className="flex items-center justify-center p-12">
    <div className="mx-auto w-full max-w-[550px]">
      <form>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Full Name"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-green-400 focus:shadow-md"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="example@domain.com"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-green-500 focus:shadow-md"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="subject"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Subject
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            placeholder="Enter your subject"
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-green-500 focus:shadow-md"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="message"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Message
          </label>
          <textarea
            rows="4"
            name="message"
            id="message"
            placeholder="Type your message"
            className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-green-500 focus:shadow-md"
          ></textarea>
        </div>
        <div>
          <button className="hover:shadow-form rounded-md bg-green-600 py-3 px-8 text-base font-semibold text-white outline-none">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>;

  return (
    <div className="flex items-center justify-center p-12 dark:bg-gray-800">
      <div className="mx-auto w-full max-w-[550px] flex flex-col gap-y-10">
        <p className="text-4xl text-teal-500 dark:text-teal-300 italic underline ">
          Add a Blog :
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
              htmlFor="title"
            >
              Title
            </label>
            <input
              placeholder="Blog title"
              type="text"
              name="title"
              value={postInfo.title}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] dark:bg-gray-600 dark:text-gray-100 outline-none focus:border-green-400 focus:shadow-md dark:border-0 dark:focus:outline dark:focus:outline-green-400"
            />
          </div>
          <div className="mb-5">
            <label
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
              htmlFor="img"
            >
              Picture
            </label>
            <input
              type="file"
              name="img"
              className="w-full text-base dark:text-gray-200 dark:bg-gray-600 bg-gray-100 py-3 px-6 rounded-md
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-gray-200 file:text-green-500
      hover:file:bg-gray-300 "
            />
          </div>
          <div className="mb-5">
            <label
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              placeholder="What is on your mind"
              cols="30"
              rows="4"
              name="content"
              value={postInfo.content}
              onChange={handleChange}
              required
              className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white  py-3 px-6 text-base font-medium text-[#6B7280] dark:bg-gray-600 dark:text-gray-100 outline-none focus:border-green-500 focus:shadow-md dark:border-0 dark:focus:outline dark:focus:outline-green-400"
            ></textarea>
          </div>

          {error && <span className="err">{error}</span>}
          <button
            className="hover:shadow-form rounded-md bg-green-600 py-3 px-8 text-base font-semibold text-white outline-none"
            type="submit"
            disabled={!canAddPost}
          >
            Add Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPostFrom;
