import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";

const PhoneDetail = () => {
  const { id } = useParams();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("specs");

  useEffect(() => {
    fetch("/phones.json")
      .then((res) => res.json())
      .then((data) => {
        // Find the phone that matches the ID from the URL
        const foundPhone = data.find((p) => p._id === parseInt(id));
        setPhone(foundPhone);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading phone data:", error);
        setLoading(false);
      });
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
        <Link to="/" className="hover:text-[#667eea]">Home</Link>
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
            <span className="text-sm text-gray-500 font-medium">4.8 (Based on 120 reviews)</span>
          </div>

          <div className="text-3xl font-bold text-[#667eea] mb-6">
            ${phone.price}
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {phone.description} This device represents the pinnacle of {phone.year} technology, 
            offering a premium experience for {phone.category} lovers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Buy Now
            </button>
            <button className="flex-1 bg-white text-[#667eea] border-2 border-[#667eea] font-bold py-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
              Add to Compare
            </button>
          </div>

          {/* Quick Specs Mockup */}
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

        {/* Tab Content */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm min-h-[300px]">
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
              {/* Mock Specs Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Display</span>
                  <span className="font-medium text-gray-900">6.7" Super Retina XDR</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Processor</span>
                  <span className="font-medium text-gray-900">Latest Bionic / Snapdragon</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">RAM</span>
                  <span className="font-medium text-gray-900">8GB / 12GB</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Storage</span>
                  <span className="font-medium text-gray-900">128GB / 256GB / 512GB</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Battery</span>
                  <span className="font-medium text-gray-900">4500 mAh (Approx)</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Camera</span>
                  <span className="font-medium text-gray-900">48MP Main + 12MP Ultra Wide</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-800">John Doe</span>
                      <span className="text-yellow-400 text-sm">★★★★★</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      "Absolutely amazing phone! The battery life is incredible and the display is stunning. 
                      Best purchase I've made this year."
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stores' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Available Stores</h3>
              <div className="space-y-3">
                {[
                  { name: "Official Store", price: phone.price },
                  { name: "Amazon", price: phone.price - 20 },
                  { name: "Best Buy", price: phone.price + 10 },
                ].map((store, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:border-[#667eea] transition-colors cursor-pointer bg-white">
                    <div className="font-bold text-gray-800">{store.name}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-[#667eea]">${store.price.toFixed(2)}</div>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700">Visit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail;