import React from "react";
import { useSelector } from "react-redux";

function ProfileImageScaled({ closeImage, userData, showImage }) {
  const mode = useSelector((state) => state.mode);
  return (
    <div
      onClick={closeImage}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm z-50  items-center justify-center flex "
    >
      <div
        className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-fit bg-gray-200 dark:bg-gray-700 p-3 flex flex-col gap-2 rounded-md shadow-lg 200 opacity-0 transition-all duration-300 ${
          showImage ? "opacity-100" : ""
        }`}
      >
        <svg
          className={`w-6 h-6 hover:cursor-pointer dark:text-gray-100 self-end  `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={closeImage}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
        <img
          className="w-full"
          src={
            userData.img
              ? `http://localhost:4000/uploads/${userData.img}`
              : mode
              ? "./imgs/defaultPic-dark.jpeg"
              : "./imgs/defaultPic.jpeg"
          }
          alt=""
        />
      </div>
    </div>
  );
}

export default ProfileImageScaled;
