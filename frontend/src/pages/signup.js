import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { NavLink, useNavigate } from "react-router-dom";

export const Signup = () => {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;

    setFormData((preData) => {
      return {
        ...preData,
        [name]: value,
      };
    });
  };

  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    if (formData.password === formData.confirmPassword) {
      const response = await fetch("http://localhost:4000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (!response.ok) {
        setLoading(false);
        setError(json.error);
        console.log(json.error);
      }
      if (response.ok) {
        setLoading(false);
        dispatch(login(json));
      }

      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
      });
    } else {
      setError("Password do not match");
    }
  };
  const [type, setType] = useState(false);
  const switchType = () => {
    setType((preTYpe) => !preTYpe);
  };

  return (
    <div className="min-w-screen min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center px-5 py-5">
      <div className="bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100  rounded-3xl shadow-xl w-full overflow-hidden">
        <div className="md:flex w-full">
          <div className="hidden md:block w-1/2 bg-green-600 py-10 px-10">
            <img
              src="./imgs/logo-bebo-light.png"
              alt="Placeholder"
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-100 ">
                REGISTER
              </h1>
              <p>Enter your information to register</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex -mx-3">
                <div className="w-1/2 px-3 mb-5">
                  <label
                    htmlFor="fisrtName"
                    className="text-xs font-semibold px-1"
                  >
                    First name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-account-outline text-gray-400 text-lg dark:text-gray-100"></i>
                    </div>
                    <input
                      type="text"
                      onChange={handleChange}
                      value={formData.firstName}
                      name="firstName"
                      required
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none dark:bg-gray-400 focus:border-green-500 dark:placeholder:text-gray-300 "
                      placeholder="First name"
                    />
                  </div>
                </div>
                <div className="w-1/2 px-3 mb-5">
                  <label
                    htmlFor="lastName"
                    className="text-xs font-semibold px-1"
                  >
                    Last name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-account-outline text-gray-400 text-lg dark:text-gray-100 "></i>
                    </div>
                    <input
                      type="text"
                      onChange={handleChange}
                      value={formData.lastName}
                      name="lastName"
                      required
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500 dark:bg-gray-400  dark:placeholder:text-gray-300"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label htmlFor="email" className="text-xs font-semibold px-1">
                    Email
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-email-outline text-gray-400 text-lg dark:text-gray-100"></i>
                    </div>
                    <input
                      type="email"
                      onChange={handleChange}
                      value={formData.email}
                      name="email"
                      required
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500 dark:bg-gray-400 dark:placeholder:text-gray-300 "
                      placeholder="johnsmith@example.com"
                    />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label
                    htmlFor="username"
                    className="text-xs font-semibold px-1"
                  >
                    Username
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-account-outline text-gray-400 text-lg dark:text-gray-100"></i>
                    </div>
                    <input
                      type="text"
                      onChange={handleChange}
                      value={formData.username}
                      name="username"
                      required
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500 dark:bg-gray-400 dark:placeholder:text-gray-300"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="flex flex-col w-full px-3 mb-1">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold px-1"
                  >
                    Password
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-lock-outline text-gray-400 text-lg dark:text-gray-100"></i>
                    </div>
                    <input
                      type={!type ? "password" : "text"}
                      onChange={handleChange}
                      value={formData.password}
                      name="password"
                      required
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500 dark:bg-gray-400 dark:placeholder:text-gray-300"
                      placeholder="************"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={switchType}
                    className="w-fit text-xs font-bold px-1 text-gray-500 self-end mt-1 dark:text-gray-200"
                  >
                    Show password
                  </button>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-10">
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-semibold px-1"
                  >
                    Confirm password
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-lock-outline text-gray-400 text-lg dark:text-gray-100"></i>
                    </div>
                    <input
                      type="password"
                      onChange={handleChange}
                      value={formData.confirmPassword}
                      name="confirmPassword"
                      required
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500 dark:bg-gray-400 dark:placeholder:text-gray-300"
                      placeholder="************"
                    />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                {error && (
                  <div
                    class="flex w-full bg-red-100 dark:bg-red-200 rounded-lg p-4 mx-3 mb-4 text-sm text-red-700"
                    role="alert"
                  >
                    <svg
                      class="w-5 h-5 inline mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span class="font-medium">Error!</span>: {error}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex -mx-3">
                <div className=" flex flex-col items-center gap-y-3 w-full px-3 mb-5">
                  <button
                    disabled={isLoading}
                    className="block w-full max-w-xs mx-auto bg-green-500 hover:bg-green-700 active:bg-green-700 text-white rounded-lg px-3 py-3 font-semibold"
                  >
                    REGISTER NOW
                  </button>
                  <NavLink
                    to="/login"
                    className="text-green-500 hover:underline font-bold"
                  >
                    Log in here
                  </NavLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
