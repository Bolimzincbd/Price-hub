import React from "react";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";

const Phonecard = ({phone}) => {
  return (
    <div className=" rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
        <div className="sm:h-72 sm:shrink-0 border rounded-md">
          <Link to={`/phones/${phone._id}`}>
            <img
              src={`${getImgUrl(phone.coverImage)}`}
              alt=""
              className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        <div>
          <Link to={`/phones/${phone._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {phone.name}
            </h3>
          </Link>
          
          <p className="font-medium mb-5">
            {phone.price}
          </p>
          <button className="btn-primary px-6 space-x-1 flex items-center gap-1 ">
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Phonecard;
