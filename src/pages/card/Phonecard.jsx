import React, { useState, useEffect } from "react";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";
import { FaMemory, FaHdd, FaBatteryFull, FaHeart, FaRegHeart } from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";

const Phonecard = ({ phone }) => {
  const { user } = useUser();
  const [inWishlist, setInWishlist] = useState(false);

  // Check if this phone is in wishlist on load
  useEffect(() => {
    if (user && phone?._id) {
      fetch(`http://localhost:5000/api/wishlist/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          const exists = data.some((item) => 
            (item.phoneId && item.phoneId._id === phone._id) || item.phoneId === phone._id
          );
          setInWishlist(exists);
        })
        .catch((err) => console.error(err));
    }
  }, [user, phone]);

  const toggleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigating to details page
    e.stopPropagation(); 

    if (!user) {
      alert("Please login to use wishlist");
      return;
    }

    try {
      if (inWishlist) {
        await fetch(`http://localhost:5000/api/wishlist/${user.id}/${phone._id}`, { method: "DELETE" });
        setInWishlist(false);
      } else {
        await fetch(`http://localhost:5000/api/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, phoneId: phone._id }),
        });
        setInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#667eea] group h-full flex flex-col cursor-pointer relative">
      
      {/* --- WISHLIST BUTTON (Top Right) --- */}
      <button
        onClick={toggleWishlist}
        className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-md text-lg transition-transform hover:scale-110 hover:bg-red-50 text-gray-400"
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {inWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>

      {/* Badge for Latest */}
      {phone.latest && (
        <span className="absolute top-4 left-4 z-10 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
          New
        </span>
      )}

      {/* Image Container */}
      <div className="bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] rounded-xl mb-4 flex items-center justify-center p-6 h-56 relative overflow-hidden">
        <Link to={`/phones/${phone._id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={getImgUrl(phone.coverImage)}
            alt={phone.name}
            className="h-full w-auto object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{phone.category}</span>
           <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
             <span>★</span> {phone.rating || "N/A"}
           </div>
        </div>

        <Link to={`/phones/${phone._id}`}>
          <h3 className="text-lg font-bold text-[#0f1419] mb-3 group-hover:text-[#667eea] transition-colors line-clamp-1">
            {phone.name}
          </h3>
        </Link>
        
        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-[10px] text-gray-500">
            <div className="flex flex-col items-center bg-gray-50 p-1.5 rounded-lg">
                <FaMemory className="mb-1 text-[#667eea]" />
                <span className="truncate w-full text-center">{phone.specs?.ram || "-"}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 p-1.5 rounded-lg">
                <FaHdd className="mb-1 text-[#667eea]" />
                <span className="truncate w-full text-center">{phone.specs?.storage?.split('/')[0] || "-"}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 p-1.5 rounded-lg">
                <FaBatteryFull className="mb-1 text-[#667eea]" />
                <span className="truncate w-full text-center">{phone.specs?.battery || "-"}</span>
            </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <p className="text-xl font-bold text-[#667eea]">
            ${phone.price}
          </p>
          <Link 
            to={`/phones/${phone._id}`}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-[#667eea] transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Phonecard;