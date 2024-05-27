import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateContactInfo } from "../../store/usersSlice";
import { useToast } from "@chakra-ui/react";

function UpdateContactInfo({ setShow }) {
  const [data, setData] = useState({
    phone: "",
    address: "",
    website: "",
    dateOfBirth: "",
  });
  const [msg, setMsg] = useState(null);
  const user = useSelector((state) => state.auth);
  const toast = useToast();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const response = await fetch(
      "http://localhost:4000/api/users/contactInfo",
      {
        method: "PATCH",
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
      dispatch(updateContactInfo(data));
      setShow();
      toast({
        title: `Contact info are updated`,
        status: "success",
        isClosable: true,
      });
      setData({
        phone: "",
        address: "",
        website: "",
        dateOfBirth: "",
      });
    }
  };

  function hamdleChange(e) {
    const { value, name } = e.target;
    setData((preData) => {
      return {
        ...preData,
        [name]: value,
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
            <h4 className="text-2xl text-[#333] font-semibold dark:text-gray-100">
              Update Your Contact Informations
            </h4>
            <label class="mb-2 block text-left mt-6">Date of Birth</label>
            <input
              value={data.dateOfBirth}
              onChange={hamdleChange}
              name="dateOfBirth"
              type="date"
              className="px-4 py-3 bg-[#f0f1f2] dark:bg-gray-600 text-black w-full text-sm outline-green-500 rounded dark:text-gray-100"
            />
            <input
              name="phone"
              value={data.phone}
              onChange={hamdleChange}
              type="text"
              placeholder="Enter New Phone"
              className="px-4 py-3 mt-6 bg-[#f0f1f2] text-black w-full text-sm outline-[#333] rounded dark:bg-gray-600"
            />
            <input
              name="website"
              value={data.website}
              onChange={hamdleChange}
              type="text"
              placeholder="Enter New website link"
              className="px-4 py-3 mt-6 bg-[#f0f1f2] text-black w-full text-sm outline-[#333] rounded dark:bg-gray-600"
            />
            <input
              name="address"
              value={data.address}
              onChange={hamdleChange}
              type="text"
              placeholder="Enter New address "
              className="px-4 py-3 mt-6 bg-[#f0f1f2] text-black w-full text-sm outline-[#333] rounded dark:bg-gray-600"
            />
          </div>
          {msg && <span className="text-red-500 text-sm my-4">{msg}</span>}
          <button
            type="submit"
            className="px-6 py-2.5 min-w-[150px] w-full rounded text-white text-sm font-semibold border-none outline-none bg-green-500 hover:bg-green-600"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateContactInfo;
