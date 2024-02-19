import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/footer";
import { logout } from "../store/authSlice";
import { switchTheme } from "../store/modeSlice";

export const RootLayout = () => {
  const dispatch = useDispatch();

  const isDarkMOde = useSelector((state) => state.theme);
  const user = useSelector((state) => state.auth);

  const switchMode = () => {
    dispatch(switchTheme());
  };

  return (
    <div
      className={`root-layout h-screen scroll-smooth ${
        isDarkMOde ? "dark" : ""
      }`}
    >
      <header className="z-50  sticky top-0 bg-white dark:text-gray-200 dark:bg-gray-900 shadow-md flex items-center justify-between px-8">
        <h1 className="w-3/12">
          <NavLink to={"/"}>
            <h1 className="text-3xl dark:text-green-400 text-green-500 font-bold flex flex-row items-center">
              <img
                src={
                  isDarkMOde
                    ? "./imgs/logo-bebo-light.png"
                    : "./imgs/logo-bebo.png"
                }
                className="w-10"
                alt=""
              />
              <span>logies</span>
            </h1>
          </NavLink>
        </h1>

        <ul className="flex items-center  list-none font-bold text-xl p-0">
          <li className="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 dark:hover:text-green-400 duration-200 cursor-pointer">
            <NavLink className="" to={"/"}>
              Home
            </NavLink>
          </li>

          <li className=" flex justify-center items-center p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 dark:hover:text-green-400 duration-200 cursor-pointer h-full">
            <NavLink to={"/blogs"}>Blogs</NavLink>
          </li>
          <li className="flex justify-center items-center p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 dark:hover:text-green-400 duration-200 cursor-pointer h-full">
            <NavLink to={"/addBlog"}>Add Blog</NavLink>
          </li>
          <li className="flex justify-center items-center p-4 border-b-2 border-green-500  border-opacity-0 hover:border-opacity-100  hover:text-green-500 dark:hover:text-green-400 duration-200 cursor-pointer ">
            <NavLink className="h-full" to={"/contact"}>
              Contact
            </NavLink>
          </li>
          <li className="p-4 cursor-pointer">
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
          </li>
        </ul>

        <div className="w-3/12 flex justify-end ">
          <ul className="flex items-center font-semibold text-lg list-none ">
            {user ? (
              <>
                <li className="p-4 border-b-2 border-orange-500 border-opacity-0 hover:border-opacity-100 hover:text-orange-500 active:border-orange-500 duration-200 cursor-pointe flex justify-center items-center ">
                  <NavLink to="/profile" className="text-orange-500 ">
                    <lord-icon
                      src="https://cdn.lordicon.com/kthelypq.json"
                      trigger="hover"
                      colors="primary:#e86830"
                      style={{ width: "40px", height: "40px" }}
                    ></lord-icon>
                  </NavLink>
                </li>
                <li className="p-4 border-b-2 border-red-500 border-opacity-0 hover:border-opacity-100 hover:text-red-500 duration-200 cursor-pointer h-full">
                  <button
                    className="log-out text-red-500 h-full"
                    onClick={() => dispatch(logout())}
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="p-4 border-b-2 border-green-500  border-opacity-0 hover:border-opacity-100  hover:text-green-500 dark:hover:text-green-400 duration-200 cursor-pointer">
                  <NavLink className="" to={"/login"}>
                    Log in
                  </NavLink>
                </li>
                <li className="p-4 border-b-2 border-green-500  border-opacity-0 hover:border-opacity-100  hover:text-green-500 dark:hover:text-green-400 duration-200 cursor-pointer">
                  <NavLink className="" to={"/signup"}>
                    Sign up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>
      <Outlet />
      <Footer />
    </div>
  );
};
