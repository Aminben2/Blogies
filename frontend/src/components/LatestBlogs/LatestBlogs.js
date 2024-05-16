import React from "react";

function LatestBlogs() {
  return (
    <div className="bg-white font-[sans-serif] dark:bg-gray-700 border-t py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#333] inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-green-600 after:rounded-full dark:text-gray-100">
            LATEST BLOGS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-md:max-w-lg mx-auto">
          <div className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img
              src="https://readymadeui.com/Imagination.webp"
              alt="Blog Post 1"
              className="w-full h-96 object-cover"
            />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-white opacity-90 dark:bg-gray-300">
              <span className="text-sm block text-gray-600 mb-2 dark:text-gray-700">
                10 FEB 2023 | BY JOHN DOE
              </span>
              <h3 className="text-xl font-bold text-[#333] dark:text-black">
                A Guide to Igniting Your Imagination
              </h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-600 text-sm dark:text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  accumsan, nunc et tempus blandit, metus mi consectetur felis
                  turpis vitae ligula.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group ">
            <img
              src="https://readymadeui.com/hacks-watch.webp"
              alt="Blog Post 2"
              className="w-full h-96 object-cover"
            />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-white opacity-90 dark:bg-gray-300">
              <span className="text-sm block text-gray-600 mb-2 dark:text-gray-700">
                7 JUN 2023 | BY MARK ADAIR
              </span>
              <h3 className="text-xl font-bold text-[#333] dark:text-black">
                Hacks to Supercharge Your Day
              </h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-600 text-sm dark:text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  accumsan, nunc et tempus blandit, metus mi consectetur felis
                  turpis vitae ligula.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group ">
            <img
              src="https://readymadeui.com/prediction.webp"
              alt="Blog Post 3"
              className="w-full h-96 object-cover"
            />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-white opacity-90 dark:bg-gray-300">
              <span className="text-sm block text-gray-600 mb-2 dark:text-gray-700">
                5 OCT 2023 | BY SIMON KONECKI
              </span>
              <h3 className="text-xl font-bold text-[#333] dark:text-black">
                Trends and Predictions
              </h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-600 text-sm dark:text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  accumsan, nunc et tempus blandit, metus mi consectetur felis
                  turpis vitae ligula.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestBlogs;
