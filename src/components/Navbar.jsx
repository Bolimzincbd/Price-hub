import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, SignOutButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const ADMIN_EMAIL = "mooneweea@gmail.com"; 
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  return (
    <header className="bg-gradient-to-br from-[#667eea] to-[#a251b0] shadow-md sticky top-0 z-50">
      <nav className="text-white max-w-screen-2xl mx-auto px-4 py-3">
        
        {/* Top Row: Logo, Desktop Menu, User Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          
          {/* Logo */}
          <div className="shrink-0 flex items-center text-2xl font-bold">
            <Link to="/" className="hover:opacity-90 transition-opacity">PhoneHub</Link>
          </div>

          {/* Search Bar - Hidden on small mobile, visible on tablet+ */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search phones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full text-gray-800 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#667eea]">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex gap-6 text-sm font-medium items-center">
            <li><Link to="/" className="hover:text-white/80 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white/80 transition-colors">About</Link></li>
            <li><Link to="/compare" className="hover:text-white/80 transition-colors">Compare</Link></li>
            <SignedIn>
              {isAdmin ? (
                <li><Link to="/admin-dashboard" className="text-yellow-300 hover:text-yellow-100 font-bold border border-yellow-300 rounded px-3 py-1">Admin</Link></li>
              ) : (
                <li><Link to="/dashboard" className="hover:text-white/80">Dashboard</Link></li>
              )}
            </SignedIn>
          </ul>

          {/* User Actions (Login/Logout) */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all text-sm font-medium backdrop-blur-sm border border-white/20 shadow-sm cursor-pointer text-white">
                  <FaUser className="text-xs" /> 
                  <span>Login</span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Search Bar - Visible ONLY on small screens */}
        <div className="mt-3 md:hidden w-full pb-1">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search phones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-lg text-gray-800 bg-white/95 focus:bg-white focus:outline-none shadow-inner text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <FaSearch />
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;