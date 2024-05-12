import React from "react";

function LatestBlogs() {
  return (
    <div class="bg-white font-[sans-serif]">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-[#333] inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">
            LATEST BLOGS
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-md:max-w-lg mx-auto">
          <div class="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img
              src="https://readymadeui.com/Imagination.webp"
              alt="Blog Post 1"
              class="w-full h-96 object-cover"
            />
            <div class="p-6 absolute bottom-0 left-0 right-0 bg-white opacity-90">
              <span class="text-sm block text-gray-600 mb-2">
                10 FEB 2023 | BY JOHN DOE
              </span>
              <h3 class="text-xl font-bold text-[#333]">
                A Guide to Igniting Your Imagination
              </h3>
              <div class="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p class="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  accumsan, nunc et tempus blandit, metus mi consectetur felis
                  turpis vitae ligula.
                </p>
              </div>
            </div>
          </div>
          <div class="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img
              src="https://readymadeui.com/hacks-watch.webp"
              alt="Blog Post 2"
              class="w-full h-96 object-cover"
            />
            <div class="p-6 absolute bottom-0 left-0 right-0 bg-white opacity-90">
              <span class="text-sm block text-gray-600 mb-2">
                7 JUN 2023 | BY MARK ADAIR
              </span>
              <h3 class="text-xl font-bold text-[#333]">
                Hacks to Supercharge Your Day
              </h3>
              <div class="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p class="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  accumsan, nunc et tempus blandit, metus mi consectetur felis
                  turpis vitae ligula.
                </p>
              </div>
            </div>
          </div>
          <div class="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img
              src="https://readymadeui.com/prediction.webp"
              alt="Blog Post 3"
              class="w-full h-96 object-cover"
            />
            <div class="p-6 absolute bottom-0 left-0 right-0 bg-white opacity-90">
              <span class="text-sm block text-gray-600 mb-2">
                5 OCT 2023 | BY SIMON KONECKI
              </span>
              <h3 class="text-xl font-bold text-[#333]">
                Trends and Predictions
              </h3>
              <div class="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p class="text-gray-600 text-sm">
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
