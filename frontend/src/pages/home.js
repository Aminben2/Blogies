import React from "react";
import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Feature from "../components/Feature/Feature";
import LatestBlogs from "../components/LatestBlogs/LatestBlogs";
import Testimonials from "../components/Testimonials/Testimonials";
import Team from "../components/Team/Team";

export const Home = ({ setShowLogin }) => {
  return (
    <div className="">
      <Hero />
      <Stats />
      <Feature />
      <LatestBlogs setShowLogin={setShowLogin} />
      <Testimonials />
      <Team />
    </div>
  );
};
