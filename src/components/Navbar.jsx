import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="bg-linear-to-br from-[#667eea] to-[#a251b0] shadow-md sticky top-0 z-50">
      <nav className="text-white max-w-screen-2xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <div className="shrink-0 flex items-center text-2xl font-bold">
          <Link to="/" className="hover:opacity-90 transition-opacity">PhoneHub</Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-base font-medium items-center">
          <li>
            <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-white/80 transition-colors">About</Link>
          </li>
          <li>
            <Link to="/compare" className="hover:text-white/80 transition-colors">Compare</Link>
          </li>
        </ul>

        {/* Search & Login */}
        <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <input 
              type="text" 
              placeholder="Search phones..." 
              className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/90 transition-all"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#667eea] transition-colors" />
          </div>
          
          <Link to="/login" className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full transition-all font-medium backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md">
            <FaUser className="text-sm" /> Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;