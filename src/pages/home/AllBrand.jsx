import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";
import { FaFilter } from "react-icons/fa";

const AllBrand = () => {
  const [phones, setPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const [minRam, setMinRam] = useState(0);

 useEffect(() => {
    // OLD: fetch("phones.json")
    // NEW: Connect to backend
    fetch("http://localhost:5000/api/phones")
      .then((res) => res.json())
      .then((data) => {
        setPhones(data);
        setFilteredPhones(data); // Initialize filtered list
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading phones:", error);
        setLoading(false);
      });
  }, []);
  
// Filter Logic
    useEffect(() => {
        let result = phones;

        if (selectedBrand !== "All") {
            result = result.filter(phone => phone.category === selectedBrand.toLowerCase());
        }

        result = result.filter(phone => phone.price <= priceRange);

        // Parse RAM from string "8GB" to number 8
        result = result.filter(phone => {
            // FIX: Check if specs and specs.ram exist before parsing
            if (!phone.specs || !phone.specs.ram) return false; 
            
            const ram = parseInt(phone.specs.ram);
            return ram >= minRam;
        });

        setFilteredPhones(result);
    }, [selectedBrand, priceRange, minRam, phones]);

  const brands = ["All", "iPhone", "Samsung", "OnePlus"];

  if (loading) return <div className="py-16 text-center text-[#536471]">Loading...</div>;

  return (
    <div className="py-10 px-4 md:px-6" id="browse">
      <h2 className="text-3xl font-bold text-[#0f1419] mb-8">Browse Phones</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <div className="w-full lg:w-64 shrink-0 space-y-8 bg-white p-6 rounded-2xl border border-gray-200 h-fit shadow-sm">
            <div className="flex items-center gap-2 text-xl font-bold text-[#667eea] border-b pb-4">
                <FaFilter /> Filters
            </div>

            {/* Brand Filter */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800">Brand</h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio" 
                                name="brand" 
                                checked={selectedBrand === brand}
                                onChange={() => setSelectedBrand(brand)}
                                className="w-4 h-4 text-[#667eea] focus:ring-[#667eea]"
                            />
                            <span className={`text-sm ${selectedBrand === brand ? 'font-bold text-[#667eea]' : 'text-gray-600'} group-hover:text-[#667eea]`}>{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800">Max Price: ${priceRange}</h3>
                <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#667eea]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>$0</span>
                    <span>$2000+</span>
                </div>
            </div>

             {/* Specs Filter (RAM) */}
             <div>
                <h3 className="font-semibold mb-3 text-gray-800">Min RAM: {minRam}GB</h3>
                <div className="flex gap-2 flex-wrap">
                    {[4, 6, 8, 12].map((ram) => (
                        <button 
                            key={ram}
                            onClick={() => setMinRam(ram === minRam ? 0 : ram)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                                minRam === ram 
                                ? "bg-[#667eea] text-white border-[#667eea]" 
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#667eea]"
                            }`}
                        >
                            {ram}GB
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredPhones.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-lg">No phones match your filters</p>
                <button onClick={() => {setPriceRange(2000); setSelectedBrand("All"); setMinRam(0)}} className="mt-4 text-[#667eea] font-bold hover:underline">Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredPhones.map((phone) => (
                <div key={phone._id} className="h-[400px]">
                    <Phonecard phone={phone} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBrand;