import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../store/postsSlice";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../store/categorySlice";

function AddPostFrom() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const { categories, isCategoriesLoading } = useSelector(
    (state) => state.categories
  );
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  const navigate = useNavigate();
  let [postInfo, setPostInfo] = React.useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    image: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    let { value, name } = e.target;
    setPostInfo((preInfo) => {
      if (name === "image") {
        const { files } = e.target;
        return {
          ...preInfo,
          [name]: files[0],
        };
      } else {
        return {
          ...preInfo,
          [name]: value,
        };
      }
    });
  }
  const canAddPost = Boolean(postInfo.title) && Boolean(postInfo.content);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be Loged in");
      return;
    }

    const uploadImage = async () => {
      console.log(postInfo.image);
      const formData = new FormData();
      formData.append("files", postInfo.image); // Assuming the file input is named 'image'

      try {
        const response = await fetch("http://localhost:4000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);
        return data.url; // Assuming the response from the server contains the URL of the uploaded image
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    };

    // Upload image and get its URL
    const imagesUrl = await uploadImage();
    if (!imagesUrl) {
      setError("Error uploading image");
      return;
    }

    const blog = {
      title: postInfo.title,
      content: postInfo.content,
      userId: user._id,
      category: postInfo.category,
      tags: postInfo.tags,
      reactions: {
        like: 0,
        wow: 0,
        love: 0,
        care: 0,
      },
      image: imagesUrl, // Set the image URL in the blog object
      comments: [],
    };

    // {"_id":"65a2b23ba16608ac54bf9380","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWEyYjIzYmExNjYwOGFjNTRiZjkzODAiLCJpYXQiOjE3MDc5MjE3MTksImV4cCI6MTcwODE4MDkxOX0.5wTjOeOkIsy-zstV0H2JmNH7Jp9YJ9Dy6as1s1Cjngw"}
    const response = await fetch("http://localhost:4000/api/blogs/", {
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
      dispatch(addPost(blog));
      navigate("/blogs");
    }

    setPostInfo({
      title: "",
      content: "",
      userId: "",
      category: "",
      tags: "",
      image: "",
    });
  };
  let categoriesOptions;
  if (!isCategoriesLoading)
    categoriesOptions = categories.map((cate) => (
      <option key={cate._id} value={cate.name}>
        {cate.name}
      </option>
    ));
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
              htmlFor="image"
            >
              Picture
            </label>
            <input
              onChange={handleChange}
              type="file"
              name="image"
              className="w-full text-base dark:text-gray-200 dark:bg-gray-600 bg-gray-100 py-2 px-6 rounded-md
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
          <div className="mb-5">
            <label
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
              htmlFor="tags"
            >
              Tags
            </label>
            <textarea
              placeholder="Add some tags"
              cols="30"
              rows="4"
              name="tags"
              value={postInfo.tags}
              onChange={handleChange}
              required
              className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white  py-3 px-6 text-base font-medium text-[#6B7280] dark:bg-gray-600 dark:text-gray-100 outline-none focus:border-green-500 focus:shadow-md dark:border-0 dark:focus:outline dark:focus:outline-green-400"
            ></textarea>
          </div>
          <div className="mb-5">
            <label
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className="w-full p-2 px-5 rounded dark:bg-gray-600 dark:text-gray-100"
              name="category"
              value={postInfo.category}
              onChange={handleChange}
            >
              {categoriesOptions}
            </select>
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
