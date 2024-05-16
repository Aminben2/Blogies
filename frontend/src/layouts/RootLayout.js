import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../partials/Footer";
import { logout } from "../store/authSlice";
import { switchTheme } from "../store/modeSlice";
import Header from "../partials/Header";

export const RootLayout = () => {
  const dispatch = useDispatch();

  const isDarkMOde = useSelector((state) => state.theme);
  const user = useSelector((state) => state.auth);

  const switchMode = () => {
    dispatch(switchTheme());
  };

  return (
    <div
      className={`root-layout h-screen scroll-smooth ${
        isDarkMOde ? "dark" : ""
      }`}
    >
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
