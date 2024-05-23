import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/authSlice";

function LoginAlert({ setShow }) {
  const user = useSelector((state) => state.auth);
  const isDarkMOde = useSelector((state) => state.theme);

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const [msg, setMsg] = useState(null);
  const [isLoading, setLoading] = useState(null);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

  function hamdleChange(e) {
    const { value, name } = e.target;
    setLoginData((preData) => {
      return {
        ...preData,
        [name]: value,
      };
    });
  }

  const handelSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg(null);

    const response = await fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const json = await response.json();
    if (!response.ok) {
      setLoading(false);
      setMsg(json.error);
    }
    if (response.ok) {
      setLoading(false);
      dispatch(login(json));
      setShow();
    }

    setLoginData({
      username: "",
      password: "",
    });
  };
  return (
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
      <div className="relative max-w-md w-full border py-8 px-6 rounded border-gray-300 bg-white dark:bg-gray-700 dark:border-none dark:text-gray-100">
        <div className="flex justify-between items-center mb-10">
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
          <span className="text-green-600 cursor-pointer" onClick={setShow}>
            <i className="fa-solid fa-x"></i>
          </span>
        </div>
        <h2 className="text-center text-3xl font-extrabold">
          Log in to your account
        </h2>
        <form className="mt-10 space-y-4" onSubmit={handelSubmit}>
          <div>
            <input
              name="username"
              type="text"
              required
              className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-green-500 border-none bg-gray-100 dark:bg-gray-600"
              placeholder="Username"
              value={loginData.username}
              onChange={hamdleChange}
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-green-500 border-none bg-gray-100 dark:bg-gray-600"
              placeholder="Password"
              value={loginData.password}
              onChange={hamdleChange}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 shrink-0 text-green-600 focus:ring-green-500 border-gray-300 rounded border-none"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm">
                Remember me
              </label>
            </div>
            <div>
              <a
                href="jajvascript:void(0);"
                className="text-sm text-green-600 hover:text-green-500"
              >
                Forgot Password?
              </a>
            </div>
          </div>
          <div className="flex mt-2 -mx-3">
            {msg && (
              <div
                className="flex w-full bg-red-100 dark:bg-red-200 rounded-lg p-4 mx-3 mb-4 text-sm text-red-700"
                role="alert"
              >
                <svg
                  className="w-5 h-5 inline mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div>
                  <span className="font-medium">Error!</span>: {msg}
                </div>
              </div>
            )}
          </div>
          <div className="!mt-10">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginAlert;
