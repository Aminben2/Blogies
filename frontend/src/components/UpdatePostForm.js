import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editBlog } from "../store/postsSlice";

function UpdatePostForm(props) {
  const dispatch = useDispatch();
  const onCancel = () => {
    props.fun(false);
    document.body.classList.remove("overflow-hidden");
  };
  //   const [showImage, setShowImage] = useState(false);
  const user = useSelector((state) => state.auth);
  const [error, setError] = useState("");
  let [postInfo, setPostInfo] = useState({
    title: props.title,
    content: props.content,
    tags: props.tags,
    image: props.image[0],
  });

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be Loged in");
      return;
    }
    if (postInfo.title.trim() === "") {
      setError("Title is required");
      return;
    }
    if (postInfo.tags.trim() === "") {
      setError("Tags is required");
      return;
    }
    if (postInfo.content.trim() === "") {
      setError("Content is required");
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
      tags: postInfo.tags,
      image: imagesUrl, // Set the image URL in the blog object
    };

    const response = await fetch(
      `http://localhost:4000/api/profile/${props._id}/editBlog`,
      {
        method: "PATCH",
        body: JSON.stringify(blog),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError("");
      dispatch(editBlog(json));
      onCancel();
    }

    setPostInfo({
      title: "",
      content: "",
      tags: "",
      image: "",
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  rounded-lg border border-gray-300 shadow-xl fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg w-full">
        <p className="font-semibold text-gray-800">Update your blog</p>
        <svg
          className="w-6 h-6 hover:cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={onCancel}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
      <div className="flex flex-col px-6 py-5 bg-gray-50">
        <p className="mb-2 font-semibold text-gray-700">Title</p>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={postInfo.title}
          className="w-full mb-5 p-2 bg-white border border-gray-200 rounded shadow-sm appearance-non"
        />
        <p className="mb-2 font-semibold text-gray-700">Content</p>
        <textarea
          type="text"
          name="content"
          value={postInfo.content}
          onChange={handleChange}
          placeholder="Type message..."
          className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-20 resize-none"
        ></textarea>
        <p className="mb-2 font-semibold text-gray-700">Tags</p>
        <textarea
          type="text"
          name="tags"
          placeholder="Type message..."
          value={postInfo.tags}
          onChange={handleChange}
          className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-20 resize-none"
        ></textarea>

        <div className="flex flex-col sm:flex-row items-center mb-5 sm:space-x-5">
          <div className="w-full sm:w-1/2 ">
            <p className="mb-2 font-semibold text-gray-700">Choose a picture</p>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-2  bg-white border border-gray-200 rounded shadow-sm appearance-none"
            />
            {/* <button onClick={() => setShowImage((prev) => !prev)}>
              view mage
            </button>
            {showImage && (
              <img
                className="z-50 absolute top-0 right-0 w-full"
                src={"http://localhost:4000/uploads/" + props.image[0]}
                alt="img"
              />
            )} */}
          </div>
          {error && <span className="text-red-500 font-bold">{error}</span>}
        </div>
        <hr />
      </div>
      <div className="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-900 font-semibold bg-gray-400 shadow-lg rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white font-semibold bg-green-500 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default UpdatePostForm;
