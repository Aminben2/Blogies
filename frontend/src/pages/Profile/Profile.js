import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePrivacy,
  deleteUserPost,
  getUserPosts,
  toggleCmnts,
} from "../../store/postsSlice";
import { Comment } from "../../components/comment";
import { formatDistanceToNow } from "date-fns";
import { NavLink } from "react-router-dom";
import WarningModal from "../../components/modals/WaeningModal";
import UpdatePostForm from "../../components/modals/UpdatePostForm";
import AuthorPost from "../../components/authorPost";
import { getUser } from "../../store/usersSlice";
import EditProfilePicForm from "../../components/modals/EditProfilePicForm";
import EditProfileCover from "../../components/modals/EditProfileCover";
import ProfileImageScaled from "../../components/modals/ProfileImageScaled";
import Work from "./Work";
import Education from "./Education";
import SocialMedia from "./SocialMedia";
import UpdatePersonnalInfo from "../../components/modals/UpdatePersonnalInfo";
import UpdateContactInfo from "../../components/modals/UpdateContactInfo";
import UpdateBio from "../../components/modals/UpdateBio";
import AddEperienceModal from "../../components/modals/AddExperienceModal";
import AddEducationModal from "../../components/modals/AddEducationModal";

export const Profile = () => {
  const user = useSelector((state) => state.auth);
  const posts = useSelector((state) => state.posts.userPosts);
  const mode = useSelector((state) => state.theme);
  const { userData } = useSelector((state) => state.users);
  const [activeBlog, setActiveBlog] = useState("");
  const [showComments, setShowCmnt] = useState(false);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showConfimrModel, setShowConfirmModel] = useState(false);
  const [privacyUpdate, setPrivacyUpdate] = useState(false);
  const [showEditBlogForm, setShowEditBlogForm] = useState(false);
  const [showEditPicProfile, setShowEditPicProfile] = useState(false);
  const [showEditCoverProfile, setShowEditCoverProfile] = useState(false);
  const [showUpdateContactInfoModal, setShowUpdateContactInfoModal] =
    useState(false);
  const [showEditContactInfo, setShowEditContactInfo] = useState(false);
  const [showUpdateBioModal, setShowUpdateBioModal] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const [showImage, setShowImgae] = useState(false);
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [showAddEducationModal, setShowEducationModal] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowControls(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    dispatch(getUserPosts(user._id));
    dispatch(getUser(user._id));
  }, [dispatch, user._id]);
  const updatePrivacy = async (obj) => {
    const response = await fetch(
      `http://localhost:4000/api/profile/${obj.postId}/privacy`,
      {
        method: "PATCH",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      // update the state
      dispatch(changePrivacy(obj));
      setPrivacyUpdate(false);
      setShowControls(false);
    }
    if (!response.ok) {
      console.log(json.error);
    }
  };

  const ConfirmDeleteBlog = (id) => {
    document.body.style.overflow = "hidden";
    setShowConfirmModel(true);
    setActiveBlog(id);
  };

  const deleteBlog = async (id) => {
    const response = await fetch(`http://localhost:4000/api/profile/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      // delete the blog from the state
      dispatch(deleteUserPost({ postId: id }));
      setShowConfirmModel(false);
      document.body.style.overflow = "auto";
    }
    if (!response.ok) {
      // show the error
      console.log(json.error);
    }
  };

  const toggleComments = async (id) => {
    const res = await fetch(
      `http://localhost:4000/api/profile/${id}/toggleComments`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await res.json();
    if (res.ok) {
      // update the state
      dispatch(toggleCmnts({ id }));
      setShowControls(false);
      json ? setShowCmnt(true) : setShowCmnt(false);
    } else {
      console.log(json.error);
    }
  };

  const closeAll = () => {
    setPrivacyUpdate(false);
    setShowControls(false);
  };
  const cancelDelete = () => {
    document.body.style.overflow = "auto";
    setShowConfirmModel(false);
  };

  const showPopUp = () => {
    setShowEditBlogForm(true);
    document.body.style.overflow = showEditBlogForm ? "auto" : "hidden";
  };
  const onCancel = () => {
    setShowEditBlogForm(false);
    document.body.style.overflow = showEditBlogForm ? "auto" : "hidden";
  };
  const blogs = posts.map((blog) => {
    return (
      <section
        key={blog._id}
        className="post one dark:bg-gray-800 relative bg-gray-800"
      >
        {showConfimrModel && blog._id === activeBlog && (
          <WarningModal
            confirm={() => deleteBlog(blog._id)}
            cancel={cancelDelete}
          />
        )}
        {showEditBlogForm && (
          <UpdatePostForm
            fun={setShowEditBlogForm}
            close={onCancel}
            {...blog}
          />
        )}
        <div className="relative flex justify-between items-center">
          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-300">
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </span>

          <span
            onClick={() => setShowControls((pre) => !pre)}
            className="self-end"
          >
            <img
              src={mode ? "./imgs/menu-light.png" : "./imgs/menu.png"}
              className="w-9 cursor-pointer dark:hover:bg-gray-700  hover:bg-gray-200 rounded-full p-1 hover:transition-colors duration-100"
              alt="menu"
            />
          </span>

          <ul
            ref={menuRef}
            onMouseLeave={closeAll}
            className={`blog-controls absolute opacity-0 ${
              showControls && "opacity-100"
            } flex flex-col  gap-2 top-10 right-0 bg-gray-200 dark:bg-gray-700 text-gray-800 p-2 rounded-md  dark:text-white`}
          >
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={() => ConfirmDeleteBlog(blog._id)}
            >
              Delete blog
            </li>
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={showPopUp}
            >
              Edit blog
            </li>
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={() => toggleComments(blog._id)}
            >
              {blog.ifCommentsEnabaled ? "Disable comments" : "Enable comments"}
            </li>
            <li
              className="cursor-pointer font-medium text-xs"
              onClick={() => setPrivacyUpdate((preState) => !preState)}
            >
              Change blog privacy
              {privacyUpdate && (
                <ul
                  onMouseLeave={() => setPrivacyUpdate(false)}
                  className={`update-controls flex flex-col ms-2 mt-1 justify-center text-gray-800  rounded-md  dark:text-white ${
                    privacyUpdate && "opacity-100"
                  }`}
                >
                  <li
                    onClick={() =>
                      updatePrivacy({ private: true, postId: blog._id })
                    }
                    className={`cursor-pointer font-sm text-xs ${
                      blog.private &&
                      "font-bold dark:bg-gray-400 px-2 rounded-sm"
                    }`}
                  >
                    For my self
                  </li>
                  <li
                    onClick={() =>
                      updatePrivacy({ private: false, postId: blog._id })
                    }
                    className={` cursor-pointer font-sm text-xs ${
                      !blog.private &&
                      "font-bold dark:bg-gray-400 px-2 rounded-sm"
                    }`}
                  >
                    Public
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <img
          src={"http://localhost:4000/uploads/" + blog.image}
          className="post-img shadow"
          alt="pic"
        />
        <h1 className="post-title text-xl text-green-500 dark:text-green-400">
          {blog.title}
        </h1>
        <p className="post-content font-bold dark:text-gray-200">
          {blog.content}
        </p>
        <div className="author">
          <AuthorPost userId={blog.userId} />
        </div>
        <div className="comments flex flex-row dark:bg-gray-600 transition duration-300">
          {blog.ifCommentsEnabaled ? (
            <div
              className="flex flex-row justify-between"
              onClick={() => setShowCmnt((pre) => !pre)}
            >
              <p className="dark:text-gray-100">
                {blog.comments ? blog.comments.length : "0"} Comments
              </p>
              {!mode ? (
                <img
                  src={
                    showComments ? "./imgs/up-arrow.png" : "./imgs/arrow.png"
                  }
                  alt=""
                  className="w-5 h-5"
                />
              ) : (
                <img
                  src={
                    showComments
                      ? "./imgs/up-arrow-light.png"
                      : "./imgs/arrow-light.png"
                  }
                  alt=""
                  className="w-5 h-5"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-row justify-between">
              <p className="dark:text-gray-100">Comments are disabled</p>
              {!mode ? (
                <img
                  src={
                    showComments ? "./imgs/up-arrow.png" : "./imgs/arrow.png"
                  }
                  alt=""
                  className="w-5 h-5"
                />
              ) : (
                <img
                  src={
                    showComments
                      ? "./imgs/up-arrow-light.png"
                      : "./imgs/arrow-light.png"
                  }
                  alt=""
                  className="w-5 h-5"
                />
              )}
            </div>
          )}

          {showComments && (
            <div className="all-comments">
              {blog.comments && blog.comments.length > 0 ? (
                <>
                  {blog.comments
                    .filter((comment) => comment.pinned)
                    .map((ele) => (
                      <Comment
                        modify={true}
                        key={ele._id}
                        {...ele}
                        postId={blog._id}
                        author={ele.userId === blog.userId}
                        isLoved={blog.loved}
                      />
                    ))}
                  {blog.comments
                    .filter((comment) => !comment.pinned)
                    .map((ele) => (
                      <Comment
                        modify={true}
                        key={ele._id}
                        {...ele}
                        postId={blog._id}
                        author={ele.userId === blog.userId}
                        isLoved={blog.loved}
                      />
                    ))}
                </>
              ) : (
                <span className="no-comments dark:text-gray-100 text-center p-5 block">
                  No comments
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    );
  });

  const openPopup = () => {
    setShowEditPicProfile(true);
    // Toggle body scroll
    document.body.style.overflow = showEditPicProfile ? "auto" : "hidden";
  };
  const closePopup = () => {
    setShowEditPicProfile(false);
    // Toggle body scroll
    document.body.style.overflow = showEditPicProfile ? "auto" : "hidden";
  };

  const openPopup1 = () => {
    setShowEditCoverProfile(true);
    // Toggle body scroll
    document.body.style.overflow = showEditCoverProfile ? "auto" : "hidden";
  };
  const closePopup1 = () => {
    setShowEditCoverProfile(false);
    // Toggle body scroll
    document.body.style.overflow = showEditCoverProfile ? "auto" : "hidden";
  };
  const showImageScale = () => {
    setShowImgae(true);

    document.body.style.overflow = showImage ? "auto" : "hidden";
  };
  const hideImageScale = () => {
    setShowImgae(false);

    document.body.style.overflow = showImage ? "auto" : "hidden";
  };

  const toggleUpdateInfoModal = () => {
    setShowUpdateInfoModal((pre) => !pre);
    document.body.style.overflow = showUpdateInfoModal ? "auto" : "hidden";
  };
  const toggleUpdateContactModal = () => {
    setShowUpdateContactInfoModal((pre) => !pre);
    document.body.style.overflow = showUpdateContactInfoModal
      ? "auto"
      : "hidden";
  };

  const toggleEditBioModal = () => {
    setShowUpdateBioModal((pre) => !pre);
    document.body.style.overflow = showUpdateBioModal ? "auto" : "hidden";
  };

  const toggleAddExperienceModal = () => {
    setShowAddExperienceModal((pre) => !pre);
    document.body.style.overflow = showAddExperienceModal ? "auto" : "hidden";
  };
  const toggleAddEducationModal = () => {
    setShowEducationModal((pre) => !pre);
    document.body.style.overflow = showAddEducationModal ? "auto" : "hidden";
  };
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
  return (
    <div className="bg-gray-100 dark:bg-gray-700">
      {showImage && (
        <ProfileImageScaled
          closeImage={hideImageScale}
          userData={userData}
          showImage={showImage}
        />
      )}
      {showEditPicProfile && (
        <EditProfilePicForm userId={user._id} closePopup={closePopup} />
      )}
      {showEditCoverProfile && (
        <EditProfileCover userId={user._id} closePopup1={closePopup1} />
      )}
      {showUpdateInfoModal && (
        <UpdatePersonnalInfo setShow={toggleUpdateInfoModal} />
      )}
      {showUpdateContactInfoModal && (
        <UpdateContactInfo setShow={toggleUpdateContactModal} />
      )}
      {showUpdateBioModal && <UpdateBio setShow={toggleEditBioModal} />}
      {showAddExperienceModal && (
        <AddEperienceModal setShow={toggleAddExperienceModal} />
      )}
      {showAddEducationModal && (
        <AddEducationModal setShow={toggleAddEducationModal} />
      )}
      {userData.cover ? (
        <div className="w-full relative">
          <img
            className="w-full h-96"
            src={"http://localhost:4000/uploads/" + userData.cover}
            alt="backGround"
          />
          <img
            onClick={openPopup1}
            className="w-8 absolute top-4 right-4 hover:cursor-pointer"
            src={mode ? "./imgs/camera.png" : "./imgs/camera-dark.png"}
            alt="edit"
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
                  <img
                    onClick={openPopup}
                    className="w-8 absolute top-24 -right-1 hover:cursor-pointer"
                    src={mode ? "./imgs/camera.png" : "./imgs/camera-dark.png"}
                    alt="edit"
                  />
                </div>

                <h1 className="text-xl font-bold">
                  {userData.firstName + " " + userData.lastName}
                </h1>
                <p className="text-gray-700 dark:text-gray-300">
                  @{userData.username}
                </p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <NavLink
                    to="/addBlog"
                    className="bg-green-500 dark:bg-green-600 dark:hover:bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Add Blog
                  </NavLink>
                  <button
                    onClick={toggleUpdateInfoModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              <hr className="my-6 border-t border-gray-300" />
              <div
                className="flex flex-col relative"
                onMouseEnter={() => setShowEditContactInfo(true)}
                onMouseLeave={() => setShowEditContactInfo(false)}
              >
                {showEditContactInfo && (
                  <div
                    onClick={toggleUpdateContactModal}
                    className="absolute -top-1 right-0 rounded-md dark:bg-gray-900 p-2 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4 dark:fill-gray-200"
                    >
                      <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                    </svg>
                  </div>
                )}
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
          </div>
          <div className="col-span-4 sm:col-span-9">
            <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-800 dark:text-gray-100 ">
              <div
                className="relative flex flex-col gap-2"
                onMouseEnter={() => setShowEditBio(true)}
                onMouseLeave={() => setShowEditBio(false)}
              >
                <h2 className="text-xl font-bold mb-">About Me</h2>
                {showEditBio && (
                  <div
                    onClick={toggleEditBioModal}
                    className="absolute -top-1 right-0 rounded-md dark:bg-gray-900 p-2 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4 dark:fill-gray-200"
                    >
                      <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                    </svg>
                  </div>
                )}
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

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold mt-6 mb-4">Experiences</h2>
                <svg
                  onClick={toggleAddExperienceModal}
                  className="w-4 dark:fill-gray-100 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                </svg>
              </div>

              {userData?.work?.length ? (
                userData?.work?.map((w, id) => <Work key={id} {...w} />)
              ) : (
                <span className="self-center dark:text-green-600">
                  You have none ,add some
                </span>
              )}

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold mt-6 mb-4">Educations</h2>
                <svg
                  onClick={toggleAddEducationModal}
                  className="w-4 dark:fill-gray-100 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                </svg>
              </div>

              {userData?.education?.length ? (
                userData?.education?.map((w, id) => (
                  <Education key={id} {...w} />
                ))
              ) : (
                <span className="self-center dark:text-green-600">
                  You have none ,add some
                </span>
              )}

              <h2 className="text-xl font-bold mt-6 mb-2">Your Blogs</h2>

              {blogs.length > 0 ? (
                <div className="bg-white flex flex-col items-center w-full m-auto  gap-y-7 dark:bg-gray-800 dark:border-none">
                  <div className="dark:border-none rounded-lg">{blogs}</div>
                </div>
              ) : (
                <div className="flex gap-y-5 flex-col justify-center items-center h-screen ">
                  <span className="text-green-500 font-bold text-2xl ">
                    You have no blogs, Add some ?
                  </span>
                  <NavLink
                    to="/addBlog"
                    className="bg-green-500 p-2 px-10 text-gray-100 rounded-lg hover:bg-green-600 shadow-md font-bold italic"
                  >
                    here
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
