import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { Link, NavLink } from "react-router-dom";

function UserDropDown({ setShow }) {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <ul
      onMouseLeave={() => {
        setTimeout(() => {
          setShow();
        }, 1000);
      }}
      className="absolute -right-5 top-12 shadow-lg bg-white dark:bg-gray-700 py-2 z-[1000] min-w-full w-max rounded-lg max-h-96 overflow-auto transition-all duration-1000"
    >
      <NavLink to={user ? "/profile" : "/login"} onClick={setShow}>
        <li className="py-2.5 px-6 flex items-center hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-500 text-[#333] text-sm cursor-pointe r">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-[18px] h-[18px] mr-3"
            viewBox="0 0 512 512"
          >
            <path
              d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z"
              data-original="#000000"
            ></path>
          </svg>
          View profile
        </li>
      </NavLink>
      {!user ? (
        <>
          <NavLink to="/login" onClick={setShow}>
            <li className="py-2.5 px-6 flex items-center dark:text-gray-100 dark:hover:bg-gray-500 hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
              <i className="fa-solid fa-right-to-bracket w-[18px] h-[18px] mr-3"></i>
              Login
            </li>
          </NavLink>
          <NavLink to="/signup" onClick={setShow}>
            <li className="py-2.5 px-6 flex items-center dark:text-gray-100 dark:hover:bg-gray-500 hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
              <i className="fa-solid fa-right-to-bracket w-[18px] h-[18px] mr-3"></i>
              Signup
            </li>
          </NavLink>
        </>
      ) : (
        <>
          <li className="py-2.5 px-6 flex items-center dark:text-gray-100 dark:hover:bg-gray-500 hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
            <Link to={user ? "/chats" : "/login"} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[16px] h-[16px] mr-3 dark:fill-gray-100"
                viewBox="0 0 512 512"
              >
                <path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z" />
              </svg>
              Messages
            </Link>
          </li>
          <li
            onClick={() => {
              setShow();
              dispatch(logout());
            }}
            className="py-2.5 px-6 flex items-center dark:text-gray-100 dark:hover:bg-gray-500 hover:bg-gray-100 text-[#333] text-sm cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-[18px] h-[18px] mr-3"
              viewBox="0 0 6.35 6.35"
            >
              <path
                d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                data-original="#000000"
              ></path>
            </svg>
            Logout
          </li>
        </>
      )}
    </ul>
  );
}

export default UserDropDown;
