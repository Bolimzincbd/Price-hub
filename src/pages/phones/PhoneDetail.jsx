import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";

const PhoneDetail = () => {
  const { id } = useParams();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("specs");

  useEffect(() => {
    fetch("http://localhost:5000/api/phones") // UPDATED URL
      .then((res) => res.json())
      .then((data) => {
        setPhones(data);
        setFilteredPhones(data);
        setLoading(false);
      })
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-xl text-gray-500">Loading details...</div>;
  }

  if (!phone) {
    return <div className="py-20 text-center text-xl text-gray-500">Phone not found.</div>;
  }

  return (
    <div className="py-12 px-4 max-w-screen-xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-[#667eea] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{phone.category}</span>
        <span className="mx-2">/</span>
        <span className="font-semibold text-gray-800">{phone.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left Column: Image */}
        <div className="bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] rounded-3xl p-8 flex items-center justify-center min-h-[400px] md:min-h-[500px] shadow-inner group">
          <img
            src={getImgUrl(phone.coverImage)}
            alt={phone.name}
            className="max-h-[350px] md:max-h-[450px] w-auto object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            {phone.latest && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4">
                LATEST MODEL
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f1419] mb-4 tracking-tight">
            {phone.name}
          </h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="text-yellow-400 text-lg">★★★★★</div>
            {/* Dynamic Rating */}
            <span className="text-sm text-gray-500 font-medium">
              {phone.rating || "N/A"} (Based on {phone.reviewCount || 0} reviews)
            </span>
          </div>

          <div className="text-3xl font-bold text-[#667eea] mb-6">
            ${phone.price}
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {phone.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Buy Now
            </button>
            <button className="flex-1 bg-white text-[#667eea] border-2 border-[#667eea] font-bold py-4 rounded-xl hover:bg-indigo-50 transition-all duration-300">
              Add to Compare
            </button>
          </div>

          {/* Dynamic Quick Specs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Release Year</span>
              <span className="font-semibold text-gray-800">{phone.year}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Category</span>
              <span className="font-semibold text-gray-800 capitalize">{phone.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Section */}
      <div>
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {['specs', 'reviews', 'stores'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab
                  ? "border-[#667eea] text-[#667eea]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === 'specs' ? 'Specifications' : tab}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm min-h-[300px]">
          {activeTab === 'specs' && phone.specs && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {Object.entries(phone.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 font-medium capitalize">{key}</span>
                    <span className="font-semibold text-gray-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Customer Reviews</h3>
              <div className="space-y-6">
                {phone.reviews && phone.reviews.length > 0 ? (
                  phone.reviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-gray-800">{review.user}</span>
                        <span className="text-yellow-400 text-sm">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No reviews yet for this product.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stores' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Available Stores</h3>
              <div className="space-y-3">
                {phone.stores && phone.stores.length > 0 ? (
                  phone.stores.map((store, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:border-[#667eea] transition-colors cursor-pointer bg-white group">
                      <div className="font-bold text-gray-800">{store.name}</div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold text-[#667eea]">${store.price.toFixed(2)}</div>
                        <button className="px-6 py-2 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                          Visit
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No store listings available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail;