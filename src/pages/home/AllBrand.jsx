import React, { useEffect, useState } from "react";
import ScrollList from "../../components/ScrollList"; // Imported ScrollList
import { FaFilter } from "react-icons/fa";
import config from '../../config';

const AllBrand = () => {
  const [phones, setPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const [minRam, setMinRam] = useState(0);

  useEffect(() => {
    fetch(`${config.baseURL}/api/phones`)
      .then((res) => res.json())
      .then((data) => {
        // Safety check: ensure data is an array
        if (Array.isArray(data)) {
            setPhones(data);
            setFilteredPhones(data);
        } else {
            console.error("API Error: Expected array but got", data);
            setPhones([]);
            setFilteredPhones([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading phones:", error);
        setPhones([]);
        setFilteredPhones([]);
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
        if (!phone.specs || !phone.specs.ram) return false;
        const ram = parseInt(phone.specs.ram);
        return ram >= minRam;
    });

    setFilteredPhones(result);
  }, [selectedBrand, priceRange, minRam, phones]);

  const brands = ["All", "iPhone", "Samsung", "OnePlus"];

  if (loading) return <div className="py-16 text-center text-[#536471]">Loading...</div>;

  return (
    <div className="py-10 px-4 md:px-6 max-w-screen-2xl mx-auto" id="browse">
      <h2 className="text-3xl font-bold text-[#0f1419] mb-6">Browse Phones</h2>

      {/* HORIZONTAL FILTER BAR */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-6">
            
            {/* Brand Filter */}
            <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase">
                    <FaFilter className="text-[#667eea]" /> Brand
                </div>
                <div className="flex flex-wrap gap-4">
                    {brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
                            <input 
                                type="radio" 
                                name="brand" 
                                checked={selectedBrand === brand}
                                onChange={() => setSelectedBrand(brand)}
                                className="accent-[#667eea] w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-sm font-medium ${selectedBrand === brand ? 'text-[#667eea]' : 'text-gray-600'}`}>
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-2 w-full md:w-64">
                <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-500 uppercase">Max Price</span>
                    <span className="text-[#667eea] font-bold">${priceRange}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#667eea]"
                />
            </div>

             {/* Specs Filter (RAM) */}
             <div className="flex flex-col gap-2">
                <span className="font-bold text-gray-500 text-sm uppercase">Min RAM</span>
                <div className="flex flex-wrap gap-2">
                    {[4, 6, 8, 12].map((ram) => (
                        <button 
                            key={ram}
                            onClick={() => setMinRam(ram === minRam ? 0 : ram)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                                minRam === ram 
                                ? "bg-[#667eea] text-white border-[#667eea]" 
                                : "bg-white text-gray-500 border-gray-200 hover:border-[#667eea] hover:text-[#667eea]"
                            }`}
                        >
                            {ram}GB
                        </button>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <button 
                onClick={() => {setPriceRange(2000); setSelectedBrand("All"); setMinRam(0)}} 
                className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors border border-dashed border-gray-300 rounded-lg hover:border-red-300"
            >
                Reset
            </button>
        </div>
      </div>

      {/* Sliding Product List (Replaced Grid) */}
      <div className="w-full">
          {filteredPhones.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-lg">No phones match your filters</p>
                <button onClick={() => {setPriceRange(2000); setSelectedBrand("All"); setMinRam(0)}} className="mt-4 text-[#667eea] font-bold hover:underline">Reset Filters</button>
            </div>
          ) : (
            // Use ScrollList to slide items horizontally
            <ScrollList items={filteredPhones} />
          )}
      </div>
    </div>
  );
};

export default AllBrand;