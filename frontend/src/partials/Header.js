import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "../store/modeSlice";
import UserDropDown from "../components/DropDown/UserDropDown";
import NotificationList from "../components/Notifications/Notifications";
import { getNotifications } from "../store/NotificationsSlice";
import { useChatState } from "../components/Chat/context/chatProvider";

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [isShowSideBar, setIsShowSideBar] = useState(false);
  const [isShowUserDRopDown, setShowUserDropDown] = useState(false);
  const [isShowNotifications, setIsShowNotifications] = useState(false);
  const isDarkMOde = useSelector((state) => state.theme);
  const switchMode = () => {
    dispatch(switchTheme());
  };

  const { notifications } = useSelector((state) => state.notifications);
  const { notification, newNotifs } = useChatState();

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      dispatch(getNotifications());
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <header className="flex shadow-sm bg-white dark:bg-gray-900 font-[sans-serif] min-h-[70px]">
      <div className="flex flex-wrap items-center justify-between sm:px-10 px-6 py-3 relative lg:gap-y-4 gap-y-6 gap-x-4 w-full">
        <div className="flex">
          <button
            id="toggleOpen"
            className="lg:hidden"
            onClick={() => setIsShowSideBar(!isShowSideBar)}
          >
            <svg
              className="w-7 h-7 dark:fill-gray-200"
              fill="#000"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <Link to="/" className="ml-8">
            <div className="flex items center">
              <img
                src={
                  isDarkMOde
                    ? "./imgs/logo-bebo-light.png"
                    : "./imgs/logo-bebo.png"
                }
                alt="logo"
                className="w-8"
              />
              <h1 className="text-2xl text-green-600 dark:text-green-500">
                logies
              </h1>
            </div>
          </Link>
        </div>

        <div className=" flex px-4 h-11 lg:w-2/4 max-md:w-full max-lg:hidden">
          <ul className="flex items-center gap-x-3 justify-center w-full  p-4 h-full">
            <li className="py-3 px-3 nav-op">
              <NavLink
                to="/"
                className="hover:text-green-600 dark:hover:text-green-500 dark:text-gray-100  font-semibold text-base "
              >
                Home
              </NavLink>
            </li>
            <li className="py-3 px-3 nav-op">
              <NavLink
                to={user ? "/blogs" : "/login"}
                className="hover:text-green-600 dark:hover:text-green-500 text-black dark:text-gray-100 font-semibold text-base"
              >
                Blogs
              </NavLink>
            </li>
            <li className="py-3 px-3 nav-op">
              <NavLink
                to={user ? "/addBlog" : "/login"}
                className="hover:text-green-600 dark:hover:text-green-500 text-black dark:text-gray-100 font-semibold text-base"
              >
                Add blog
              </NavLink>
            </li>
            <li className="py-3 px-3 nav-op">
              <NavLink
                to={user ? "/contact" : "/login"}
                className="hover:text-green-600 dark:hover:text-green-500 text-black dark:text-gray-100 font-semibold text-base"
              >
                Contact
              </NavLink>
            </li>
            <li className="py-3 px-3 nav-op">
              <NavLink
                to={user ? "/about" : "/login"}
                className="hover:text-green-600 dark:hover:text-green-500 text-black dark:text-gray-100 font-semibold text-base"
              >
                About
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-8 max-md:ml-auto">
          <div className="toggle-switch">
            <label>
              <input
                type="checkbox"
                checked={!isDarkMOde}
                onChange={switchMode}
              />
              <span className="slider"></span>
            </label>
          </div>
          <NavLink to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              className="cursor-pointer fill-[#333] dark:fill-gray-100 dark:hover:fill-green-500 hover:fill-green-500"
              viewBox="0 0 511 511.999"
            >
              <path
                d="M498.7 222.695c-.016-.011-.028-.027-.04-.039L289.805 13.81C280.902 4.902 269.066 0 256.477 0c-12.59 0-24.426 4.902-33.332 13.809L14.398 222.55c-.07.07-.144.144-.21.215-18.282 18.386-18.25 48.218.09 66.558 8.378 8.383 19.44 13.235 31.273 13.746.484.047.969.07 1.457.07h8.32v153.696c0 30.418 24.75 55.164 55.168 55.164h81.711c8.285 0 15-6.719 15-15V376.5c0-13.879 11.293-25.168 25.172-25.168h48.195c13.88 0 25.168 11.29 25.168 25.168V497c0 8.281 6.715 15 15 15h81.711c30.422 0 55.168-24.746 55.168-55.164V303.14h7.719c12.586 0 24.422-4.903 33.332-13.813 18.36-18.367 18.367-48.254.027-66.633zm-21.243 45.422a17.03 17.03 0 0 1-12.117 5.024h-22.72c-8.285 0-15 6.714-15 15v168.695c0 13.875-11.289 25.164-25.168 25.164h-66.71V376.5c0-30.418-24.747-55.168-55.169-55.168H232.38c-30.422 0-55.172 24.75-55.172 55.168V482h-66.71c-13.876 0-25.169-11.29-25.169-25.164V288.14c0-8.286-6.715-15-15-15H48a13.9 13.9 0 0 0-.703-.032c-4.469-.078-8.66-1.851-11.8-4.996-6.68-6.68-6.68-17.55 0-24.234.003 0 .003-.004.007-.008l.012-.012L244.363 35.02A17.003 17.003 0 0 1 256.477 30c4.574 0 8.875 1.781 12.113 5.02l208.8 208.796.098.094c6.645 6.692 6.633 17.54-.031 24.207zm0 0"
                data-original="#000000"
              />
            </svg>
          </NavLink>
          <div className="relative">
            <div className="relative">
              <svg
                onClick={() => setIsShowNotifications(!isShowNotifications)}
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                className="cursor-pointer fill-[#333] dark:fill-gray-100 dark:hover:fill-green-500 hover:fill-green-500"
                viewBox="0 0 371.263 371.263"
              >
                <path
                  d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
                  data-original="#000000"
                />
              </svg>
              <span className="absolute left-auto -ml-2 -top-1 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                {notifications.filter((f) => !f.seen).length > 0 && (
                  <span>{notifications.filter((f) => !f.seen).length}</span>
                )}
              </span>
            </div>
            {isShowNotifications && (
              <NotificationList
                show={isShowNotifications}
                setShow={() => setIsShowNotifications(!isShowNotifications)}
              />
            )}
          </div>
          <div>
            <NavLink to="/chats">
              <div className="relative">
                <svg
                  className="cursor-pointer fill-[#333] dark:fill-gray-100 dark:hover:fill-green-500 hover:fill-green-500"
                  width="20px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z" />
                </svg>
                <span className="absolute left-auto -ml-2 -top-1 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                  {notification.length > 0 ? (
                    <span>{notification.length}</span>
                  ) : (
                    <span>{newNotifs.length > 0 && newNotifs.length}</span>
                  )}
                </span>
              </div>
            </NavLink>
          </div>
          <div className="relative ">
            <svg
              onClick={() => setShowUserDropDown(!isShowUserDRopDown)}
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              className="cursor-pointer fill-[#333] dark:fill-gray-100 dark:hover:fill-green-500 hover:fill-green-500"
              viewBox="0 0 512 512"
            >
              <path
                d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z"
                data-original="#000000"
              />
            </svg>
            {isShowUserDRopDown && (
              <UserDropDown
                setShow={() => setShowUserDropDown(!isShowUserDRopDown)}
              />
            )}
          </div>
        </div>
      </div>

      {isShowSideBar && (
        <div
          id="collapseMenu"
          className="before:fixed before:bg-black before:opacity-40 before:inset-0 max-lg:before:z-50"
        >
          <button
            onClick={() => setIsShowSideBar(false)}
            id="toggleClose"
            className="fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button>

          <ul className="block space-x-4 space-y-3 fixed bg-white dark:bg-gray-800 w-1/2 min-w-[300px] top-0 left-0 p-4 h-full shadow-md overflow-auto z-50">
            <li
              className="pb-4 px-3 nav-op"
              onClick={() => setIsShowSideBar(!isShowSideBar)}
            >
              <NavLink to="/">
                <div className="flex items center">
                  <img
                    src={
                      isDarkMOde
                        ? "./imgs/logo-bebo-light.png"
                        : "./imgs/logo-bebo.png"
                    }
                    alt="logo"
                    className="w-8"
                  />
                  <h1 className="text-2xl text-green-600 dark:text-green-500">
                    logies
                  </h1>
                </div>
              </NavLink>
            </li>
            <li
              className="border-b dark:border-gray-200 py-3 px-3 nav-op"
              onClick={() => setIsShowSideBar(!isShowSideBar)}
            >
              <NavLink
                to="/"
                className="hover:text-green-600 dark:hover:text-green-500 dark:text-gray-100 text-green-600 block font-semibold text-base"
              >
                Home
              </NavLink>
            </li>
            <li
              className="border-b dark:border-gray-200 py-3 px-3 nav-op"
              onClick={() => setIsShowSideBar(!isShowSideBar)}
            >
              <NavLink
                to="/blogs"
                className="hover:text-green-600 dark:hover:text-green-500 dark:text-gray-100 text-black block font-semibold text-base"
              >
                Blogs
              </NavLink>
            </li>
            <li
              className="border-b dark:border-gray-200 py-3 px-3 nav-op"
              onClick={() => setIsShowSideBar(!isShowSideBar)}
            >
              <NavLink
                to="/addBlog"
                className="hover:text-green-600 dark:hover:text-green-500 dark:text-gray-100 text-black block font-semibold text-base"
              >
                Add blog
              </NavLink>
            </li>
            <li
              className="border-b dark:border-gray-200 py-3 px-3 nav-op"
              onClick={() => setIsShowSideBar(!isShowSideBar)}
            >
              <NavLink
                to="/contact"
                className="hover:text-green-600 dark:hover:text-green-500 dark:text-gray-100 text-black block font-semibold text-base"
              >
                Contact
              </NavLink>
            </li>
            <li
              className="border-b dark:border-gray-200 py-3 px-3 nav-op"
              onClick={() => setIsShowSideBar(!isShowSideBar)}
            >
              <NavLink
                to="/about"
                className="hover:text-green-600 dark:hover:text-green-500 dark:text-gray-100 text-black block font-semibold text-base"
              >
                About
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
