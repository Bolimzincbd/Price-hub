import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-sky-800   ">
      <nav className=" text-white flex justify-between items-center max-w-screen-2xl mx-auto px-4 py-6">
        <div className="shrink-0 flex items-center text-2xl font-bold ">
          PhoneHub
        </div>

        <ul className="flex gap-20">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/compare">Compare</Link>
          </li>
        </ul>

        <div>
          <input type="text" placeholder="Search..." />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
