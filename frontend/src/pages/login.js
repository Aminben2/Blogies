import React, { useEffect } from "react";
import { login } from "../store/authSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
const Login = () => {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });
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
    }

    setLoginData({
      username: "",
      password: "",
    });
  };
  const [type, setType] = useState(false);
  const switchType = () => {
    setType((preTYpe) => !preTYpe);
  };
  const mode = useSelector((state) => state.theme);
  return (
    <div className="bg-gray-100 dark:bg-gray-700 flex justify-center items-center h-screen">
      <div className="flex max-lg:hidden bg-white dark:bg-gray-800 flex-row justify-center items-center w-1/2 h-full ">
        <img
          src={mode ? "./imgs/logo-bebo-light.png" : "./imgs/logo-bebo.png"}
          alt="Placeholder"
          className="w-1/2"
        />
        <h1 className="text-green-500 -ms-8 font-extrabold text-7xl">logies</h1>
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4 dark:text-gray-100">
          Login
        </h1>
        <form onSubmit={handelSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-600 dark:text-gray-100"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={hamdleChange}
              value={loginData.username}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-green-500 dark:bg-gray-400"
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 dark:text-gray-100"
            >
              Password
            </label>
            <input
              type={!type ? "password" : "text"}
              id="password"
              name="password"
              value={loginData.password}
              onChange={hamdleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-green-500 dark:bg-gray-400"
              autoComplete="off"
            />
            <button
              type="button"
              className="font-semibold italic text-xs dark:text-gray-100"
              onClick={switchType}
            >
              Show password
            </button>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="text-green-500"
            />
            <label
              htmlFor="remember"
              className="text-gray-600 ml-2 dark:text-gray-100"
            >
              Remember Me
            </label>
          </div>
          <div className="mb-6 text-green-500">
            <Link className="hover:underline">Forgot Password?</Link>
          </div>
          {msg && (
            <div
              className="flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700"
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
                <span className="font-medium">Error alert!</span>: {msg}
              </div>
            </div>
          )}
          <button
            disabled={isLoading}
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-green-500 text-center">
          <NavLink to="/signup" className="hover:underline">
            Sign up Here
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
