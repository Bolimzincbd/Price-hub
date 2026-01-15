import React from "react";
import bannerImg from "../../assets/phones/iphone-nobg.png"; // Ensure this matches your actual image path
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-12 py-16 px-6 max-w-screen-2xl mx-auto">
      
      {/* Left Side: Text Content */}
      <div className="md:w-1/2 space-y-6 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold text-[#0f1419] leading-tight">
          Find the best <span className="text-[#667eea]">phone price</span>
        </h1>
        <p className="text-lg text-[#536471]">
          Compare prices, specs, and features of the latest smartphones from top brands. 
          Make the smart choice for your next device.
        </p>
        
        {/* ACTION BUTTONS (Instead of Search) */}
        <div className="flex gap-4 pt-4">
            <Link to="/compare" className="px-8 py-3 bg-[#0f1419] text-white rounded-full font-bold hover:bg-[#667eea] transition-all hover:shadow-lg hover:-translate-y-1">
                Compare Now
            </Link>
            <a href="#browse" className="px-8 py-3 bg-white text-[#0f1419] border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all hover:shadow-lg">
                Browse All
            </a>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="md:w-1/2 flex justify-center relative">
        {/* Background Blob Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#667eea]/20 to-[#a251b0]/20 rounded-full blur-3xl -z-10"></div>
        
        <img 
            src={bannerImg} 
            alt="iPhone 15 Banner" 
            className="w-full max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default Banner;