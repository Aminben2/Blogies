import React from "react";

function Testimonials() {
  return (
    <div className="border-t font-[sans-serif] py-20 dark:bg-gray-700 dark:text-gray-100">
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold">Testimonials</h2>
        <p className="text-sm text-[#333] mt-4 leading-relaxed dark:text-gray-300">
          Veniam proident aute magna anim excepteur et ex consectetur velit
          ullamco veniam minim aute sit. Elit occaecat officia et laboris Lorem
          minim. Officia do aliqua adipisicing ullamco in
        </p>
      </div>
      <div className="grid md:grid-cols-3 md:gap-6 max-md:gap-10 max-w-6xl mx-auto">
        <div className="max-w-[350px] h-auto sm:p-8 p-4 rounded-md mx-auto shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] bg-white relative dark:bg-gray-800">
          <img
            src="https://readymadeui.com/profile_2.webp"
            className="w-14 h-14 rounded-full absolute right-0 left-0 mx-auto -top-7"
          />
          <div className="mt-8 text-center">
            <p className="text-sm text-[#333] leading-relaxed dark:text-gray-100">
              The service was amazing. I never had to wait that long for my
              food. The staff was friendly and attentive, and the delivery was
              impressively prompt.
            </p>
            <h4 className="text-base whitespace-nowrap font-extrabold mt-8">
              ( John Doe )
            </h4>
          </div>
        </div>
        <div className="max-w-[350px] h-auto sm:p-8 p-4 rounded-md mx-auto shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] bg-white relative dark:bg-gray-800">
          <img
            src="https://readymadeui.com/profile_3.webp"
            className="w-14 h-14 rounded-full absolute right-0 left-0 mx-auto -top-7"
          />
          <div className="mt-8 text-center">
            <p className="text-sm text-[#333] leading-relaxed dark:text-gray-100">
              The service was amazing. I never had to wait that long for my
              food. The staff was friendly and attentive, and the delivery was
              impressively prompt.
            </p>
            <h4 className="text-base whitespace-nowrap font-extrabold mt-8">
              ( Mark Adair )
            </h4>
          </div>
        </div>
        <div className="max-w-[350px] h-auto sm:p-8 p-4 rounded-md mx-auto shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] bg-white relative dark:bg-gray-800">
          <img
            src="https://readymadeui.com/profile_4.webp"
            className="w-14 h-14 rounded-full absolute right-0 left-0 mx-auto -top-7"
          />
          <div className="mt-8 text-center">
            <p className="text-sm text-[#333] leading-relaxed dark:text-gray-100">
              The service was amazing. I never had to wait that long for my
              food. The staff was friendly and attentive, and the delivery was
              impressively prompt.
            </p>
            <h4 className="text-base whitespace-nowrap font-extrabold mt-8">
              ( Simon Konecki )
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
