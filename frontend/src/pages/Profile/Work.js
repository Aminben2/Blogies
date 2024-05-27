import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { delWork } from "../../store/usersSlice";
import { useToast } from "@chakra-ui/react";

function Work({ _id, company, position, startDate, endDate, current, desc }) {
  const [showMinus, setShowMinus] = useState(false);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();
  function formatDate(pp) {
    const date = new Date(pp);
    // Get the day, month, and year parts of the date
    const day = date.getUTCDate().toString().padStart(2, "0"); // Pad single digit days with a leading zero
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so add 1 and pad
    const year = date.getUTCFullYear();

    // Return the formatted date string
    return `${day}-${month}-${year}`;
  }
  const deleteWork = async () => {
    const response = await fetch(
      "http://localhost:4000/api/users/work/" + _id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      dispatch(delWork(_id));
      toast({
        title: `Work Experience deleted`,
        status: "success",
        isClosable: true,
      });
    } else {
      console.log(json.error);
      toast({
        title: `something went wrong`,
        status: "eror",
        isClosable: true,
      });
    }
  };
  return (
    <div
      className="mb-10 relative"
      onMouseEnter={() => setShowMinus(true)}
      onMouseLeave={() => setShowMinus(false)}
    >
      {showMinus && (
        <div
          className="absolute right-0 top-0 dark:bg-gray-500 p-2 rounded-full shadow-lg cursor-pointer"
          onClick={deleteWork}
        >
          <svg
            className="w-4 dark:fill-gray-100 "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
          </svg>
        </div>
      )}
      <div className="flex justify-between flex-wrap gap-2 w-full">
        <span className="text-gray-700 font-bold dark:text-gray-400">
          {position}
        </span>
        <p>
          <span className="text-gray-700 mr-2 dark:text-gray-400">
            at {company}
          </span>
          <span className="text-gray-700 dark:text-gray-400">
            {formatDate(startDate)} -{" "}
            {current ? "present" : formatDate(endDate)}
          </span>
        </p>
      </div>
      <p className="mt-2">{desc}</p>
    </div>
  );
}

export default Work;
