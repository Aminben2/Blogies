import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfilePic } from "../../store/usersSlice";
import { useToast } from "@chakra-ui/react";

function EditProfilePicForm({ closePopup, userId }) {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const updatePic = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("No file selected.");
      return;
    }

    // Verify if the selected file is an image
    if (!file.type.startsWith("image/")) {
      setError("Selected file is not an image.");
      return;
    }
    const imagesUrl = await uploadImage();
    if (!imagesUrl) {
      setError("Error uploading image.");
      return;
    }
    const res = await fetch(
      `http://localhost:4000/api/users/${userId}/profilePic`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ imageUrl: imagesUrl[0] }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      closePopup();
      dispatch(updateProfilePic({ imageUrl: imagesUrl[0] }));
      toast({
        title: `Profile picture is updated`,
        status: "success",
        isClosable: true,
      });
    } else {
      console.log(data.error);
    }
  };
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("files", file); // Assuming the file input is named 'image'
    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  return (
    <div
      onClick={closePopup}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-900 p-3 rounded-lg shadow-lg dark:bg-gray-800"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold dark:text-gray-100">
            Update your picture
          </h1>
          <svg
            className="w-6 h-6 hover:cursor-pointer dark:text-gray-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={closePopup}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <form className="flex flex-col gap-4" onSubmit={updatePic}>
          <div className="flex flex-col gap-1">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 "
              id="file_input"
              type="file"
              name="file"
              onChange={handleFileChange}
            />
            {error && (
              <span className="text-red-500 text-sm font-bold">{error}</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 rounded p-1 text-gray-50 font-bold hover:bg-green-600 shadow"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePicForm;
