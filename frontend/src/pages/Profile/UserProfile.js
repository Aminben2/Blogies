import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUserPostsListing } from "../../store/postsSlice";
import { getUser } from "../../store/usersSlice";
import OneBlog from "../Blogs/OneBlog";
import ProfileImageScaled from "../../components/modals/ProfileImageScaled";
import Work from "./Work";
import SocialMedia from "./SocialMedia";
import Education from "./Education";

function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const mode = useSelector((state) => state.theme);
  const [showImage, setShowImgae] = useState(false);
  const { userPostsListing } = useSelector((state) => state.posts);
  const { userData } = useSelector((state) => state.users);
  useEffect(() => {
    dispatch(getUserPostsListing(id));
    dispatch(getUser(id));
  }, [dispatch, id]);
  if (user._id === id) {
    navigate("/profile");
    return;
  }

  const blogs = userPostsListing
    .filter((blog) => !blog.private)
    .map((blog) => <OneBlog key={blog._id} {...blog} />);

  function formatDate(pp) {
    const date = new Date(pp);
    // Get the day, month, and year parts of the date
    const day = date.getUTCDate().toString().padStart(2, "0"); // Pad single digit days with a leading zero
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so add 1 and pad
    const year = date.getUTCFullYear();

    // Return the formatted date string
    return `${day}-${month}-${year}`;
  }
  function hasAllTruthyValues(obj) {
    return obj && Object.entries(obj).every(([key, value]) => Boolean(value));
  }

  const showImageScale = () => {
    setShowImgae(true);

    document.body.style.overflow = showImage ? "auto" : "hidden";
  };
  const hideImageScale = () => {
    setShowImgae(false);

    document.body.style.overflow = showImage ? "auto" : "hidden";
  };
  return (
    <div className="bg-gray-100 dark:bg-gray-700">
      {showImage && (
        <ProfileImageScaled
          closeImage={hideImageScale}
          userData={userData}
          showImage={showImage}
        />
      )}
      {userData.cover ? (
        <div className="w-full relative">
          <img
            className="w-full h-96"
            src={"http://localhost:4000/uploads/" + userData.cover}
            alt="backGround"
          />
        </div>
      ) : (
        <div className="h-40 w-full bg-green-500"></div>
      )}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <div className="col-span-4 sm:col-span-3">
            <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-800 dark:text-gray-100">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    onClick={showImageScale}
                    src={
                      userData.img
                        ? "http://localhost:4000/uploads/" + userData.img
                        : mode
                        ? "./imgs/defaultPic-dark.jpeg"
                        : "./imgs/defaultPic.jpeg"
                    }
                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  />
                </div>

                <h1 className="text-xl font-bold">
                  {userData.firstName + " " + userData.lastName}
                </h1>
                <p className="text-gray-700 dark:text-gray-300">
                  @{userData.username}
                </p>
              </div>
              <hr className="my-6 border-t border-gray-300" />
              <span className="text-gray-700 uppercase font-bold tracking-wider mb-2 dark:text-gray-100">
                Contact Info
              </span>
              <ul>
                <li className="mb-2">
                  <span className="font-bold">Birth Date: </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {" "}
                    {userData?.dateOfBirth
                      ? formatDate(userData?.dateOfBirth)
                      : "N/A"}
                  </span>
                </li>
                <li className="mb-2">
                  <span className="font-bold">Phone: </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {" "}
                    {userData?.contactInfo?.phone
                      ? userData?.contactInfo?.phone
                      : "N/A"}
                  </span>
                </li>
                <li className="mb-2">
                  <span className="font-bold">Address: </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {userData?.contactInfo?.address
                      ? userData?.contactInfo?.address
                      : "N/A"}
                  </span>
                </li>
                <li className="mb-2">
                  <span className="font-bold">Website: </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {userData?.contactInfo?.website
                      ? userData?.contactInfo?.website
                      : "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-9">
            <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-800 dark:text-gray-100 ">
              <div className="relative flex flex-col gap-2">
                <h2 className="text-xl font-bold mb-">About Me</h2>

                <p className="text-gray-700 mb-6 dark:text-gray-400">
                  {userData.bio ? userData.bio : "Speak about yourself"}
                </p>
              </div>

              {userData?.socialLinks &&
                hasAllTruthyValues(userData?.socialLinks) && (
                  <>
                    <h3 className="font-semibold text-center mt-3 -mb-2">
                      Find me on
                    </h3>
                    <SocialMedia {...userData?.socialLinks} />
                  </>
                )}

              <h2 className="text-xl font-bold mt-6 mb-4">Experiences</h2>
              {userData?.work?.length ? (
                userData?.work?.map((w, id) => <Work key={id} {...w} />)
              ) : (
                <span className="self-center dark:text-green-600">Empty</span>
              )}

              <h2 className="text-xl font-bold mt-6 mb-4">Educations</h2>

              {userData?.education?.length ? (
                userData?.education?.map((w, id) => (
                  <Education key={id} {...w} />
                ))
              ) : (
                <span className="self-center dark:text-green-600">Empty</span>
              )}

              <h2 className="text-xl font-bold mt-6 mb-2">
                {userData.username}'s Blogs
              </h2>

              {blogs.length > 0 ? (
                <div className="bg-white flex flex-col items-center w-full m-auto  gap-y-7 dark:bg-gray-800 dark:border-none">
                  <div className="dark:border-none rounded-lg">{blogs}</div>
                </div>
              ) : (
                <div className="flex gap-y-5 flex-col justify-center items-center h-screen ">
                  <span className="text-green-500 font-bold text-2xl ">
                    Has No blogs
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
