import { Outlet } from "react-router-dom";

export const BlogLayout = () => {
  return (
    <div className="blog-layout dark:bg-gray-900">
      <Outlet />
    </div>
  );
};
