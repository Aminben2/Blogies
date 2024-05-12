import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const isDarkMOde = useSelector((state) => state.theme);
  return (
    <footer className="bg-white dark:bg-gray-800 dark:text-gray-200 py-12 px-10 font-sans tracking-wide">
      <div className="lg:max-w-[50%] mx-auto text-center dark:text-gray-200">
        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Newsletter
        </h3>
        <p className="text-sm mt-6 text-gray-500 dark:text-gray-200">
          Subscribe to our newsletter and stay up to date with the latest news,
          updates, and exclusive offers. Get valuable insights. Join our
          community today!
        </p>

        <div className="bg-[#dddddd] dark:bg-gray-600 placeholder:text-gray-100 flex px-2 py-1.5 rounded-full text-left mt-10">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full outline-none bg-transparent text-sm pl-4"
          />
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-full px-5 py-2.5 ml-4 transition-all dark:bg-green-600 dark:text-gray-100 dark:font-blod"
          >
            Submit
          </button>
        </div>
      </div>

      <hr className="border-gray-300 my-12" />

      <div className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 lg:grid-cols-4 gap-8 dark:text-gray-200">
        <div>
          <h4 className="text-lg font-bold mb-6 text-gray-800 dark:text-gray-200">
            About Us
          </h4>
          <p className="text-gray-500 mb-2 text-sm dark:text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            gravida, mi eu pulvinar cursus, sem elit interdum mauris.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-gray-800 dark:text-gray-200">
            Services
          </h4>
          <ul className="space-y-4">
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Web Development
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Mobile App Development
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                UI/UX Design
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Digital Marketing
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-gray-800 dark:text-gray-200">
            Resources
          </h4>
          <ul className="space-y-4">
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Webinars
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Ebooks
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Templates
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Tutorials
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-gray-800 dark:text-gray-200">
            About Us
          </h4>
          <ul className="space-y-4">
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Our Story
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Mission and Values
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Team
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-500 hover:text-gray-800 text-[15px] dark:text-gray-200"
              >
                Testimonials
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
