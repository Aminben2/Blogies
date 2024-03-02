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
  const handleChange = (e) => {
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
  };
  const canAddPost = Boolean(postInfo.title) && Boolean(postInfo.content);
  const validateInputs = () => {
    if (!postInfo.title) {
      setError("Please enter a title.");
      return false;
    }
    if (!postInfo.content) {
      setError("Please enter the content.");
      return false;
    }
    if (!postInfo.category) {
      setError("Please choose a category.");
      return false;
    }

    // Add more validation for other inputs if needed

    setError(""); // Clear any previous error
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be Loged in");
      return;
    }
    if (!validateInputs()) {
      return;
    }

    const uploadImage = async () => {
      const formData = new FormData();
      formData.append("files", postInfo.image); // Assuming the file input is named 'image'

      try {
        const response = await fetch("http://localhost:4000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
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
      reactions: [],
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
      dispatch(addPost(json));
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
    <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-bold text-center text-green-500 mb-4">
            Add a Blog
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                placeholder="Enter blog title"
                type="text"
                name="title"
                value={postInfo.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="image"
              >
                Picture
              </label>
              <input
                onChange={handleChange}
                required
                type="file"
                name="image"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="content"
              >
                Content
              </label>
              <textarea
                placeholder="What's on your mind"
                cols="30"
                rows="4"
                name="content"
                value={postInfo.content}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="tags"
              >
                Tags
              </label>
              <input
                placeholder="Add some tags"
                type="text"
                name="tags"
                value={postInfo.tags}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <select
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white"
                name="category"
                value={postInfo.category}
                onChange={handleChange}
                required
              >
                {categoriesOptions}
              </select>
            </div>

            {error && (
              <span className="text-red-500 text-sm mb-4">{error}</span>
            )}
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={!canAddPost}
            >
              Add Blog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPostFrom;
