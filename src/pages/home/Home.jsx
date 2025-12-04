import React from "react";
import Banner from "./Banner";
import Latest from "./Latest";
import Recommend from "./Recommend";
import Allbrand from "./AllBrand";


const Home = () => {
  return (
    <>
      <Banner />
      <Allbrand />
      <Latest />
      <Recommend />
    </>
  );
};

export default Home;
