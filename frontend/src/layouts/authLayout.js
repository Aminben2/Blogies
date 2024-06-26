import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const user = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
