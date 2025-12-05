import React from "react";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";

const Phonecard = ({ phone }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#667eea] group h-full flex flex-col cursor-pointer">
      {/* Image Container with Gradient Background */}
      <div className="bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] rounded-xl mb-4 flex items-center justify-center p-6 h-64 relative overflow-hidden">
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
        <Link to={`/phones/${phone._id}`}>
          <h3 className="text-lg font-bold text-[#0f1419] mb-1 group-hover:text-[#667eea] transition-colors line-clamp-1">
            {phone.name}
          </h3>
        </Link>
        
        {/* Rating / Stores (Mock data for style match) */}
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <span className="text-yellow-400 text-sm">★★★★★</span>
          <span>4.8 (120 reviews)</span>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{phone.category}</span>
             <p className="text-xl font-bold text-[#667eea]">
              ${phone.price}
            </p>
          </div>
          
          <Link 
            to={`/phones/${phone._id}`}
            className="px-4 py-2 bg-gray-50 text-[#536471] rounded-lg text-sm font-semibold hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white transition-all shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Phonecard;