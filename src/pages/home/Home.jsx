import React from "react";
import Banner from "./Banner";
import Latest from "./Latest";
import Recommend from "./Recommend";
import Allbrand from "./AllBrand";
import LatestBlogs from "./LatestBlogs"; // Import the new component

const Home = () => {
  return (
    <>
      <Banner />
      <Allbrand />
      <Latest />
      <Recommend />
      <LatestBlogs /> {/* Added block below Recommend */}
    </>
  );
};

export default Home;