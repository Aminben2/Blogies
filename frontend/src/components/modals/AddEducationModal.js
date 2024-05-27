import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEducation } from "../../store/usersSlice";
import { useToast } from "@chakra-ui/react";

function AddEducationModal({ setShow }) {
  const [data, setData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    current: false,
    desc: "",
  });

  const [msg, setMsg] = useState(null);
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const response = await fetch(
      "http://localhost:4000/api/users/addEducation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setMsg(json.error);
    }
    if (response.ok) {
      dispatch(addEducation(data));
      setShow();
      toast({
        title: `Education added`,
        status: "success",
        isClosable: true,
      });
      setData({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        current: false,
        desc: "",
      });
    }
  };

  function hamdleChange(e) {
    const { value, name, type, checked } = e.target;
    setData((preData) => {
      return {
        ...preData,
        [name]: type == "checkbox" ? checked : value,
      };
    });
  }
  return (
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative dark:bg-gray-700 dark:text-gray-100">
        <svg
          onClick={setShow}
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 cursor-pointer shrink-0 fill-[#333] hover:fill-red-500 float-right dark:fill-gray-100"
          viewBox="0 0 320.591 320.591"
        >
          <path
            d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
            data-original="#000000"
          ></path>
          <path
            d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
            data-original="#000000"
          ></path>
        </svg>
        <form onSubmit={handleSubmit}>
          <div className="my-8 text-center">
            <h4 className="text-2xl text-[#333] font-semibold dark:text-gray-100 mb-2">
              Add Education
            </h4>
            <input
              value={data.school}
              onChange={hamdleChange}
              name="school"
              type="text"
              required
              placeholder="Enter school name"
              className="px-4 py-3 mt-6 bg-[#f0f1f2] text-black w-full text-sm outline-[#333] rounded dark:bg-gray-600 dark:text-gray-100"
            />
            <input
              value={data.degree}
              onChange={hamdleChange}
              required
              name="degree"
              placeholder="Enter degree"
              type="text"
              className="px-4 py-3 mt-6 bg-[#f0f1f2] text-black w-full text-sm outline-[#333] rounded dark:bg-gray-600 dark:text-gray-100"
            />
            <input
              value={data.fieldOfStudy}
              onChange={hamdleChange}
              required
              name="fieldOfStudy"
              placeholder="Enter field Of Study"
              type="text"
              className="px-4 py-3 mt-6 bg-[#f0f1f2] text-black w-full text-sm outline-[#333] rounded dark:bg-gray-600 dark:text-gray-100"
            />
            <div className="flex flex-col gap-2 mt-4">
              <label className="dark:text-gray-100 text-left">Start Date</label>
              <input
                value={data.startDate}
                onChange={hamdleChange}
                name="startDate"
                type="date"
                className="px-4 py-3 bg-[#f0f1f2] dark:bg-gray-600 text-black w-full text-sm outline-green-500 rounded dark:text-gray-100"
                required
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="dark:text-gray-100 text-left">Start Date</label>
              <input
                value={data.endDate}
                onChange={hamdleChange}
                name="endDate"
                type="date"
                className="px-4 py-3 bg-[#f0f1f2] dark:bg-gray-600 text-black w-full text-sm outline-green-500 rounded dark:text-gray-100"
              />
            </div>
            <div className="flex items-center mt-6 ml-2">
              <input
                id="checkbox1"
                type="checkbox"
                className="hidden peer"
                checked={data.current}
                onChange={hamdleChange}
                name="current"
              />
              <label
                htmlFor="checkbox1"
                className="relative flex items-center justify-center p-1 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-4 h-4 cursor-pointer bg-green-500 border rounded overflow-hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full fill-white"
                  viewBox="0 0 520 520"
                >
                  <path
                    d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                    data-name="7-Check"
                    data-original="#000000"
                  />
                </svg>
              </label>
              <p className="text-sm text-black ml-2 dark:text-gray-100">
                Present
              </p>
            </div>

            <textarea
              value={data.desc}
              onChange={hamdleChange}
              name="desc"
              required
              placeholder="Enter description"
              className="px-4 py-3 mt-6 bg-[#f0f1f2] text-black w-full text-sm rounded dark:bg-gray-600 dark:text-gray-100 outline-green-500"
            ></textarea>
          </div>
          {msg && <span className="text-red-500 text-sm mb-4">{msg}</span>}
          <button
            type="submit"
            className="px-6 py-2.5 min-w-[150px] w-full rounded text-white text-sm font-semibold border-none outline-none bg-green-500 hover:bg-green-600"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEducationModal;
