import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";
// Import Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Latest = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    fetch("http://localhost:5000/api/phones")
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

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1.2} // Show part of the next slide to encourage swiping
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-10" // Padding for pagination dots
      >
        {latestPhones.map((phone) => (
          <SwiperSlide key={phone._id}>
            <Phonecard phone={phone} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Latest;