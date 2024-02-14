import React, { useState } from "react";
import { useSelector } from "react-redux";

const Contact = () => {
  const user = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((preData) => {
      return {
        ...preData,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formData),
    });
    const json = response.json();

    if (!response.ok) {
      setError(json.error);
      console.log(json.error);
    }
    if (response.ok) {
      setError("Our Team recieced your words");
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };
  return (
    <div className="flex items-center justify-center p-12 dark:bg-gray-800">
      <div className="mx-auto w-full max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="fullName"
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              value={formData.fullName}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-green-400 focus:shadow-md dark:bg-gray-600 dark:text-gray-100 dark:border-0 dark:focus:outline dark:focus:outline-green-400"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@domain.com"
              onChange={handleChange}
              value={formData.email}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-green-500 focus:shadow-md dark:bg-gray-600 dark:text-gray-100 dark:border-0 dark:focus:outline dark:focus:outline-green-400"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="subject"
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
            >
              Subject
            </label>
            <input
              type="text"
              name="subject"
              placeholder="Enter your subject"
              onChange={handleChange}
              value={formData.subject}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-green-500 focus:shadow-md dark:bg-gray-600 dark:text-gray-100 dark:border-0 dark:focus:outline dark:focus:outline-green-400"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="message"
              className="mb-3 block text-base font-medium text-[#07074D] dark:text-sky-500"
            >
              Message
            </label>
            <textarea
              rows="4"
              name="message"
              placeholder="Type your message"
              value={formData.message}
              onChange={handleChange}
              className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-green-500 focus:shadow-md dark:bg-gray-600 dark:text-gray-100
                            dark:border-0 dark:focus:outline dark:focus:outline-green-400"
            ></textarea>
          </div>
          {error && (
            <div
              className="flex bg-green-100 dark:bg-green-200 rounded-lg p-4 mb-4 text-sm text-green-700 dark:text-green-800"
              role="alert"
            >
              <svg
                className="w-5 h-5 inline mr-3"
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
                <span className="font-medium">Success alert!</span> {error}
              </div>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="hover:shadow-form rounded-md bg-green-600 py-3 px-8 text-base font-semibold text-white outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
