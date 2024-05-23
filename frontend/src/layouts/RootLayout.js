import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../partials/Footer";
import { switchTheme } from "../store/modeSlice";
import Header from "../partials/Header";
import LoginAlert from "../components/Alerts/LoginAlert";

export const RootLayout = () => {
  const dispatch = useDispatch();

  const isDarkMOde = useSelector((state) => state.theme);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
    document.body.style.overflow = showLoginModal ? "auto" : "hidden";
  };

  const switchMode = () => {
    dispatch(switchTheme());
  };

  return (
    <div
      className={`root-layout h-screen scroll-smooth ${
        isDarkMOde ? "dark" : ""
      }`}
    >
      {showLoginModal && (
        <LoginAlert show={showLoginModal} setShow={toggleLoginModal} />
      )}
      <Header setShowLogin={toggleLoginModal} />
      <Outlet setShowLogin={toggleLoginModal} />
      <Footer />
    </div>
  );
};
