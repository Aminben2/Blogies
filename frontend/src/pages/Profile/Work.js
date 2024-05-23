import React from "react";

function Work({ company, position, startDate, endDate, current, desc }) {
  function formatDate(pp) {
    const date = new Date(pp);
    // Get the day, month, and year parts of the date
    const day = date.getUTCDate().toString().padStart(2, "0"); // Pad single digit days with a leading zero
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so add 1 and pad
    const year = date.getUTCFullYear();

    // Return the formatted date string
    return `${day}-${month}-${year}`;
  }
  return (
    <div className="mb-10 ">
      <div className="flex justify-between flex-wrap gap-2 w-full">
        <span className="text-gray-700 font-bold dark:text-gray-400">{position}</span>
        <p>
          <span className="text-gray-700 mr-2 dark:text-gray-400">at {company}</span>
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
