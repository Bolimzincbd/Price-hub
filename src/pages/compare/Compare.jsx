import React, { useState, useEffect } from 'react';
import { getImgUrl } from "../../utils/getImgUrl";

const Compare = () => {
  const [allPhones, setAllPhones] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([null, null, null]); // 3 slots
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);

  // 1. Fetch data on load
  useEffect(() => {
    fetch("/phones.json")
      .then((res) => res.json())
      .then((data) => setAllPhones(data))
      .catch((err) => console.error("Failed to load phones", err));
  }, []);

  // 2. Open modal to select a phone for a specific slot
  const handleAddClick = (index) => {
    setActiveSlotIndex(index);
    setIsModalOpen(true);
  };

  // 3. Confirm selection
  const handleSelectPhone = (phone) => {
    const newSelection = [...selectedPhones];
    newSelection[activeSlotIndex] = phone;
    setSelectedPhones(newSelection);
    setIsModalOpen(false);
  };

  // 4. Remove a phone from comparison
  const handleRemovePhone = (index) => {
    const newSelection = [...selectedPhones];
    newSelection[index] = null;
    setSelectedPhones(newSelection);
  };

  return (
    <div className="py-12 px-4 max-w-screen-2xl mx-auto relative">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Compare Phones</h1>
        <p className="text-lg text-gray-500">Select up to 3 devices to compare specs side-by-side</p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selectedPhones.map((phone, index) => (
          <div key={index} className="relative">
            {phone ? (
              // POPULATED CARD
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-full hover:shadow-2xl transition-shadow duration-300">
                <button 
                  onClick={() => handleRemovePhone(index)}
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-red-50 text-red-500 font-bold w-10 h-10 flex items-center justify-center"
                >
                  ✕
                </button>
                
                <div className="bg-linear-to-b from-gray-50 to-white p-8 flex items-center justify-center h-64">
                   <img 
                     src={getImgUrl(phone.coverImage)} 
                     alt={phone.name} 
                     className="max-h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                   />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-6 border-b border-gray-100 pb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{phone.name}</h3>
                      <div className="text-[#667eea] font-bold text-2xl">${phone.price}</div>
                  </div>
                  
                  <div className="space-y-4 text-gray-600 flex-1">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Category</span>
                      <span className="font-semibold text-gray-800 capitalize">{phone.category}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Release Year</span>
                      <span className="font-semibold text-gray-800">{phone.year}</span>
                    </div>
                    <div className="py-2">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Description</span>
                      <p className="text-sm leading-relaxed text-gray-600">{phone.description}</p>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 py-3 border-2 border-[#667eea] text-[#667eea] rounded-xl font-bold hover:bg-[#667eea] hover:text-white transition-all duration-300">
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              // EMPTY "ADD DEVICE" CARD
              <div 
                onClick={() => handleAddClick(index)}
                className="bg-white border-3 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center h-full min-h-[450px] cursor-pointer hover:border-[#667eea] hover:bg-indigo-50/30 transition-all duration-300 group"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#667eea] group-hover:text-white transition-all duration-300 shadow-sm">
                  <span className="text-4xl group-hover:text-white text-gray-400 transition-colors font-light">+</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-500 group-hover:text-[#667eea] transition-colors">Add Device</h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SELECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800">Select a Phone</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allPhones.map((phone) => (
                <div 
                  key={phone._id}
                  onClick={() => handleSelectPhone(phone)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#667eea] hover:bg-indigo-50/30 cursor-pointer transition-all group"
                >
                  <div className="w-16 h-16 shrink-0 bg-white rounded-lg p-2 border border-gray-100">
                    <img 
                      src={getImgUrl(phone.coverImage)} 
                      alt={phone.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#667eea] transition-colors">{phone.name}</h4>
                    <p className="text-sm text-gray-500">${phone.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;