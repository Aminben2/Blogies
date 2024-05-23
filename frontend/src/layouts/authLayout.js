import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const AuthLayout = () => {
  const user = useSelector((state) => state.auth);
  const [validToken, setValidToken] = useState(true); // Assume token is valid initially

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const response = await axios.post(
          "http://localhost:4000/validate-token",
          { token: user.token }
        );
        setValidToken(response.data.valid); // Update the state based on token validation result
      } catch (error) {
        console.log(error);
        setValidToken(false); // Set token as invalid in case of error
      }
    };

    fetchData();
  }, [user]);

  // Render Navigate component based on the validity of the token
  if (!validToken) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
