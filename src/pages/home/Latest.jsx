import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";

const Latest = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("phones.json")
      .then((res) => res.json())
      .then((data) => {
        setPhones(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading phones:", error);
        setLoading(false);
      });
  }, []);

  const latestPhones = phones.filter(phone => phone.latest === true);

  if (loading) return null;

  return (
    <div className="py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
          Latest Products 
          <span className="bg-[#dbeafe] text-[#1e40af] px-3 py-1 rounded-full text-xs font-semibold">NEW</span>
        </div>
        <div className="text-[#536471] hover:text-[#667eea] cursor-pointer transition-colors font-medium">
          View All →
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x">
        {latestPhones.map((phone) => (
            <div key={phone._id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <Phonecard phone={phone} />
            </div>
        ))}
      </div>
    </div>
  );
};

export default Latest;