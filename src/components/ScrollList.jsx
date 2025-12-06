import React, { useRef } from "react";
import Phonecard from "../pages/card/Phonecard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ScrollList = ({ items }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const {current} = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Scroll Buttons (Hidden on mobile, visible on hover desktop) */}
      <button 
        onClick={() => scroll("left")} 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-white text-[#667eea]"
      >
        <FaChevronLeft />
      </button>
      
      <button 
        onClick={() => scroll("right")} 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-white text-[#667eea]"
      >
        <FaChevronRight />
      </button>

      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide scroll-smooth px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for clean look
      >
        {items.map((phone) => (
          <div key={phone._id} className="min-w-[280px] md:min-w-[300px] snap-start">
            <Phonecard phone={phone} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollList;