import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";

const Recommend = () => {
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

  const recommendedPhones = phones.filter(phone => phone.recommend === true);

  if (loading) return null;

  return (
    <div className="py-10 px-6 bg-[#f5f7fa] rounded-xl mx-4 mb-12 border border-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
          Recommended for you
          <span className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-xs font-semibold">HOT</span>
        </div>
      </div>

       {/* Horizontal Scroll Container */}
       <div className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x">
        {recommendedPhones.map((phone) => (
            <div key={phone._id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <Phonecard phone={phone} />
            </div>
        ))}
      </div>
    </div>
  );
};

export default Recommend;