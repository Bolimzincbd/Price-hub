import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl"; // Adjust path if needed

const PhoneDetail = () => {
  const { id } = useParams(); // Get the ID from the URL (e.g., "1")
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the single source of truth
    fetch("/phones.json")
      .then((res) => res.json())
      .then((data) => {
        // Find the specific phone by ID
        const foundPhone = data.find((p) => p._id === parseInt(id));
        setPhone(foundPhone);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading phone data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!phone) return <div className="text-center py-10">Phone not found</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="text-sm breadcrumbs mb-6 text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link> &gt; 
        <span className="mx-1 capitalize">{phone.category}</span> &gt; 
        <span className="font-bold text-gray-800 ml-1">{phone.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image */}
        <div className="flex justify-center items-center bg-gray-50 rounded-xl p-8 border border-gray-100">
          <img
            src={getImgUrl(phone.coverImage)}
            alt={phone.name}
            className="max-h-96 w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right: Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{phone.name}</h1>
          <p className="text-2xl text-blue-600 font-bold mb-6">${phone.price}</p>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            {phone.description}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-500 text-sm block">Release Year</span>
              <span className="font-semibold">{phone.year}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-500 text-sm block">Category</span>
              <span className="font-semibold capitalize">{phone.category}</span>
            </div>
          </div>

          <button className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail;