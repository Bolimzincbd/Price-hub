import React from "react";

const Banner = () => {
  return (
    <div className="py-16 px-6 text-center bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-2xl mx-4 mt-6 shadow-xl mb-12">
      <h1 className="text-5xl font-bold mb-4">Find the Best Phone Prices</h1>
      <p className="text-lg opacity-90 mb-8">Compare prices from multiple stores instantly</p>
      
      <div className="bg-white p-2 rounded-full flex max-w-[600px] mx-auto shadow-lg">
        <input 
          type="text" 
          placeholder="Search for phones..." 
          className="flex-1 border-none px-5 py-3 text-base outline-none text-gray-700 rounded-l-full"
        />
        <button className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none py-3 px-8 rounded-full font-semibold cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          Search
        </button>
      </div>
    </div>
  );
};

export default Banner;