import React from "react";
import { Outlet } from "react-router-dom";

export const BlogLayout = () => {
  return (
    <div className="dark:bg-gray-900 bg-gray-100">
      <Outlet />
    </div>
  );
};
