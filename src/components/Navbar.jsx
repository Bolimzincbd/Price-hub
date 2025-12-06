import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // REPLACE WITH YOUR ADMIN EMAIL
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
      <nav className="text-white max-w-screen-2xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <div className="shrink-0 flex items-center text-2xl font-bold">
          <Link to="/" className="hover:opacity-90 transition-opacity">PhoneHub</Link>
        </div>

        <ul className="hidden md:flex gap-8 text-base font-medium items-center">
          <li><Link to="/" className="hover:text-white/80 transition-colors">Home</Link></li>
          <li><Link to="/about" className="hover:text-white/80 transition-colors">About</Link></li>
          <li><Link to="/compare" className="hover:text-white/80 transition-colors">Compare</Link></li>
          <SignedIn>
            {isAdmin ? (
              <li><Link to="/admin-dashboard" className="text-yellow-300 hover:text-yellow-100 font-bold border border-yellow-300 rounded px-3 py-1">Admin Panel</Link></li>
            ) : (
              <li><Link to="/dashboard" className="hover:text-white/80">My Dashboard</Link></li>
            )}
          </SignedIn>
        </ul>

        <div className="flex items-center gap-4">
          
          <div className="flex items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full transition-all font-medium backdrop-blur-sm border border-white/20 shadow-sm cursor-pointer">
                  <FaUser className="text-sm" /> Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;