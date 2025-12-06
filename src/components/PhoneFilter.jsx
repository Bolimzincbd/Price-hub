import React from 'react';

const PhoneFilter = ({ filters, setFilters, clearFilters }) => {
  const brands = ["Apple", "Samsung", "OnePlus", "Google"];
  const rams = ["4GB", "6GB", "8GB", "12GB", "16GB"];
  
  const handleChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-[#667eea] hover:underline">Reset</button>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm text-gray-700 uppercase">Brand</h4>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="brand" 
                className="accent-[#667eea]"
                checked={filters.brand === brand.toLowerCase()}
                onChange={() => handleChange('brand', brand.toLowerCase())}
              />
              <span className="text-gray-600 group-hover:text-[#667eea] transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-sm text-gray-700 uppercase">Max Price: ${filters.price}</h4>
        <input 
          type="range" 
          min="0" 
          max="2000" 
          step="50"
          value={filters.price}
          onChange={(e) => handleChange('price', Number(e.target.value))}
          className="w-full accent-[#667eea]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$0</span>
          <span>$2000+</span>
        </div>
      </div>

      {/* RAM Filter */}
      <div>
        <h4 className="font-semibold mb-3 text-sm text-gray-700 uppercase">RAM</h4>
        <div className="flex flex-wrap gap-2">
          {rams.map(ram => (
            <button
              key={ram}
              onClick={() => handleChange('ram', ram)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                filters.ram === ram 
                ? 'bg-[#667eea] text-white border-[#667eea]' 
                : 'bg-white text-gray-600 border-gray-300 hover:border-[#667eea]'
              }`}
            >
              {ram}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhoneFilter;